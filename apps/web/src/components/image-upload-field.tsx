"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApiClient } from "@/lib/api-client";

interface UploadedImage {
	_id: string;
	title: string;
	url: string;
	usedFor: string;
}

interface ImageUploadFieldProps {
	value: string;
	onChange: (url: string, imageId?: string) => void;
	placeholder?: string;
	usedFor?: "product" | "category" | "banner" | "other";
	returnType?: "url" | "id" | "both";
}

export function ImageUploadField({
	value,
	onChange,
	placeholder = "https://example.com/image.jpg",
	usedFor = "other",
	returnType = "url",
}: ImageUploadFieldProps) {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [title, setTitle] = useState("");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const imageInputId = useId();
	const titleInputId = useId();

	const createImageMutation = useMutation({
		mutationFn: adminApiClient.createImage.bind(adminApiClient),
		onSuccess: (data: UploadedImage) => {
			queryClient.invalidateQueries({ queryKey: ["images"] });

			// Handle different return types
			if (returnType === "url") {
				onChange(data.url);
			} else if (returnType === "id") {
				onChange(data._id);
			} else {
				// both
				onChange(data.url, data._id);
			}

			// Auto copy URL to clipboard
			navigator.clipboard.writeText(data.url);
			setCopiedId(data._id);
			toast.success("Image uploaded & URL set!");
			setTimeout(() => setCopiedId(null), 2000);

			// Add to uploaded images list
			setUploadedImages((prev) => [data, ...prev]);

			// Reset form but keep dialog open
			setSelectedFile(null);
			setTitle("");
			setPreviewUrl(null);
			setIsUploading(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to save image");
			setIsUploading(false);
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);

			// Auto-set title to file name (without extension)
			const fileName = file.name;
			const nameWithoutExtension =
				fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
			setTitle(nameWithoutExtension || "");
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !title.trim()) {
			toast.error("Please select file and add title");
			return;
		}

		setIsUploading(true);

		try {
			// Step 1: Get upload signature from backend
			const signatureData = await adminApiClient.getUploadSignature(usedFor);

			// Step 2: Upload to Cloudinary
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("signature", signatureData.signature);
			formData.append("timestamp", String(signatureData.timestamp));
			formData.append("api_key", signatureData.apiKey);
			if (signatureData.folder) {
				formData.append("folder", signatureData.folder);
			}

			const cloudinaryResponse = await fetch(
				`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (!cloudinaryResponse.ok) {
				throw new Error("Failed to upload to Cloudinary");
			}

			const cloudinaryData = await cloudinaryResponse.json();

			// Step 3: Save image metadata to our database
			createImageMutation.mutate({
				title,
				url: cloudinaryData.secure_url,
				usedFor,
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload image",
			);
			setIsUploading(false);
		}
	};

	const handleUseImage = (url: string, id: string) => {
		if (returnType === "url") {
			onChange(url);
		} else if (returnType === "id") {
			onChange(id);
		} else {
			onChange(url, id);
		}
		toast.success("Image set!");
	};

	const handleCopyUrl = (url: string, id: string) => {
		navigator.clipboard.writeText(url);
		setCopiedId(id);
		toast.success("Image URL copied to clipboard");
		setTimeout(() => setCopiedId(null), 2000);
	};

	const handleClose = () => {
		setSelectedFile(null);
		setTitle("");
		setPreviewUrl(null);
		setUploadedImages([]);
		setCopiedId(null);
		setIsUploading(false);
		setDialogOpen(false);
	};

	// Helper function to check if URL is a valid image URL
	const isValidImageUrl = (url: string) => {
		if (!url || !url.trim()) return false;
		try {
			const urlObj = new URL(url);
			const pathname = urlObj.pathname.toLowerCase();
			return (
				/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(pathname) ||
				url.includes("image") ||
				url.includes("img") ||
				url.includes("cloudinary")
			);
		} catch {
			return false;
		}
	};

	return (
		<>
			<div className="space-y-3">
				<div className="flex gap-2">
					<Input
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="flex-1"
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() => setDialogOpen(true)}
					>
						<ImageIcon className="h-4 w-4" />
					</Button>
				</div>

				{/* Image Preview */}
				{value && isValidImageUrl(value) && (
					<div className="relative h-32 w-full overflow-hidden rounded-lg border bg-muted">
						<Image
							src={value}
							alt="Image preview"
							fill
							className="object-contain"
							onError={() => {
								// Handle image load error silently
							}}
						/>
					</div>
				)}
			</div>

			<Dialog open={dialogOpen} onOpenChange={handleClose}>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden">
					<DialogHeader>
						<DialogTitle>Upload Image</DialogTitle>
						<DialogDescription>
							Upload an image to Cloudinary and set it
						</DialogDescription>
					</DialogHeader>

					<div className="max-h-[calc(90vh-120px)] space-y-6 overflow-y-auto pr-2">
						{/* Upload Form */}
						<div className="space-y-4 rounded-lg border p-4">
							<div className="grid gap-2">
								<Label htmlFor={imageInputId}>Image File</Label>
								<Input
									id={imageInputId}
									type="file"
									accept="image/*"
									onChange={handleFileChange}
								/>
								{previewUrl && (
									<div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg border">
										<Image
											src={previewUrl}
											alt="Preview"
											fill
											className="object-contain"
										/>
									</div>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor={titleInputId}>Title</Label>
								<Input
									id={titleInputId}
									placeholder="Describe the image"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>

							<div className="grid gap-2">
								<Label>Used For</Label>
								<Input value={usedFor} readOnly className="bg-muted" />
							</div>

							<Button
								onClick={handleUpload}
								disabled={isUploading || !selectedFile}
								className="w-full"
							>
								{isUploading ? (
									<>
										<Upload className="mr-2 h-4 w-4 animate-pulse" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="mr-2 h-4 w-4" />
										Upload & Set Image
									</>
								)}
							</Button>
						</div>

						{/* Uploaded Images List */}
						{uploadedImages.length > 0 && (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-sm">
										Uploaded Images ({uploadedImages.length})
									</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setUploadedImages([])}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
								<div className="max-h-[300px] overflow-y-auto rounded-lg border">
									<div className="space-y-2 p-4">
										{uploadedImages.map((image) => (
											<div
												key={image._id}
												className="flex items-center gap-3 rounded-lg border p-3"
											>
												<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
													<Image
														src={image.url}
														alt={image.title}
														fill
														className="object-cover"
													/>
												</div>
												<div className="flex-1 overflow-hidden">
													<p className="truncate font-medium text-sm">
														{image.title}
													</p>
													<p className="truncate text-muted-foreground text-xs">
														{image.usedFor}
													</p>
													<code className="block truncate rounded bg-muted px-2 py-1 font-mono text-xs">
														{image.url}
													</code>
												</div>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleUseImage(image.url, image._id)}
													>
														Use
													</Button>
													<Button
														variant={
															copiedId === image._id ? "default" : "outline"
														}
														size="sm"
														onClick={() => handleCopyUrl(image.url, image._id)}
													>
														{copiedId === image._id ? (
															<>
																<Check className="mr-1 h-3 w-3" />
																Copied
															</>
														) : (
															<>
																<Copy className="mr-1 h-3 w-3" />
																Copy
															</>
														)}
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="flex justify-end">
						<Button variant="outline" onClick={handleClose}>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
