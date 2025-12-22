"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { ImagePreview } from "@/components/image-preview";
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { useCreateProduct } from "@/hooks/use-products";

const formSchema = z.object({
	title: z
		.string()
		.min(5, "Title must be at least 5 characters.")
		.max(100, "Title must be at most 100 characters."),
	description: z
		.string()
		.min(20, "Description must be at least 20 characters.")
		.max(500, "Description must be at most 500 characters."),
	price: z.number().min(1, "Price must be at least 1."),
	coverImage: z.string().min(1, "Cover image is required."),
	images: z.array(z.string()).default([]),
	category: z.string().min(1, "Category is required."),
	gender: z.enum(["unisex", "men", "women"]),
});

export default function NewProductPage() {
	const router = useRouter();
	const { data: categories } = useCategoriesQuery();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			price: 0,
			coverImage: "",
			images: [],
			category: "",
			gender: "unisex",
		},
	});

	const createMutation = useCreateProduct();

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		createMutation.mutate(
			{
				title: data.title,
				description: data.description,
				price: data.price,
				coverImage: data.coverImage,
				images: data.images,
				category: data.category,
				gender: data.gender,
			},
			{
				onSuccess: () => {
					router.push("/dashboard/products");
				},
			},
		);
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div>
				<h2 className="font-bold text-xl tracking-tight md:text-2xl">
					Add Product
				</h2>
				<p className="text-muted-foreground text-sm">
					Create a new product in your catalog
				</p>
			</div>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardDescription>
						Fill in the information below to create a new product.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="title"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="product-title">
											Product Title
										</FieldLabel>
										<Input
											{...field}
											id="product-title"
											aria-invalid={fieldState.invalid}
											placeholder="Premium Cotton T-Shirt"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="description"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="product-description">
											Description
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												{...field}
												id="product-description"
												placeholder="A detailed description of the product..."
												rows={4}
												className="min-h-24 resize-none"
												aria-invalid={fieldState.invalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.value?.length || 0}/500 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<div className="grid gap-4 md:grid-cols-2">
								<Controller
									name="price"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="product-price">Price (₹)</FieldLabel>
											<Input
												{...field}
												id="product-price"
												type="number"
												aria-invalid={fieldState.invalid}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="gender"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="product-gender">Gender</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger id="product-gender">
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="unisex">Unisex</SelectItem>
													<SelectItem value="men">Men</SelectItem>
													<SelectItem value="women">Women</SelectItem>
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<Controller
								name="category"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="product-category">Category</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="product-category">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{categories?.map((cat) => (
													<SelectItem key={cat._id} value={cat._id}>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldDescription>
											Select the category this product belongs to.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="coverImage"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="product-image">Cover Image</FieldLabel>
										<ImageUploadField
											value={field.value}
											onChange={field.onChange}
											usedFor="product"
											returnType="id"
										/>
										<FieldDescription>
											Upload the product cover image (Image ID will be stored).
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="images"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Additional Images (Optional)</FieldLabel>
										<div className="space-y-2">
											{field.value.map((imageId) => (
												<div key={imageId} className="flex items-center gap-3">
													<ImagePreview imageId={imageId} />
													<div className="flex-1 rounded-lg border bg-muted p-2 text-sm">
														<p className="truncate font-medium text-xs">
															Image ID: {imageId}
														</p>
													</div>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => {
															const newImages = field.value.filter(
																(id) => id !== imageId,
															);
															field.onChange(newImages);
														}}
													>
														Remove
													</Button>
												</div>
											))}
											<ImageUploadField
												value=""
												onChange={(imageId) => {
													if (imageId) {
														field.onChange([...field.value, imageId]);
													}
												}}
												usedFor="product"
												returnType="id"
												placeholder="Upload additional image"
											/>
										</div>
										<FieldDescription>
											Upload multiple product images (optional).
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/dashboard/products")}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							form="product-form"
							disabled={createMutation.isPending}
						>
							{createMutation.isPending ? "Creating..." : "Create Product"}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
