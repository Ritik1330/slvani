"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/image-upload-field";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function NewImagePage() {
	const router = useRouter();
	const [imageUrl, setImageUrl] = useState("");
	const [usedFor, setUsedFor] = useState<
		"product" | "category" | "banner" | "other"
	>("other");

	const handleImageChange = (url: string) => {
		setImageUrl(url);
		if (url) {
			toast.success(
				"Image uploaded successfully! You can upload more or go back to the list.",
			);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div>
				<h2 className="font-bold text-xl tracking-tight md:text-2xl">
					Upload Image
				</h2>
				<p className="text-muted-foreground text-sm">
					Upload images to Cloudinary
				</p>
			</div>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Image Upload</CardTitle>
					<CardDescription>
						Select usage type and upload your image
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Field>
							<FieldLabel htmlFor="used-for">Used For</FieldLabel>
							<Select
								value={usedFor}
								onValueChange={(
									value: "product" | "category" | "banner" | "other",
								) => setUsedFor(value)}
							>
								<SelectTrigger id="used-for">
									<SelectValue placeholder="Select usage" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="product">Product</SelectItem>
									<SelectItem value="category">Category</SelectItem>
									<SelectItem value="banner">Banner</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<FieldLabel>Image</FieldLabel>
							<ImageUploadField
								value={imageUrl}
								onChange={handleImageChange}
								usedFor={usedFor}
								returnType="url"
							/>
						</Field>
					</div>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/dashboard/images")}
						>
							Back to List
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
