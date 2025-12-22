"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";
import * as z from "zod";

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
import { Switch } from "@/components/ui/switch";
import { useCreateCategory, useParentCategories } from "@/hooks/use-categories";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Category name must be at least 2 characters.")
		.max(50, "Category name must be at most 50 characters."),
	slug: z
		.string()
		.min(2, "Slug must be at least 2 characters.")
		.max(50, "Slug must be at most 50 characters.")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase with hyphens only.",
		),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters.")
		.max(200, "Description must be at most 200 characters.")
		.optional()
		.or(z.literal("")),
	parentCategory: z.string().optional().or(z.literal("")),
	coverImage: z
		.string()
		.url("Must be a valid URL.")
		.optional()
		.or(z.literal("")),
	isActive: z.boolean(),
});

export default function NewCategoryPage() {
	const router = useRouter();
	const { parentCategories } = useParentCategories();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			parentCategory: undefined,
			coverImage: "",
			isActive: true,
		},
	});

	const createMutation = useCreateCategory();

	function onSubmit(data: z.infer<typeof formSchema>) {
		createMutation.mutate(
			{
				name: data.name,
				slug: data.slug,
				description: data.description || undefined,
				parentCategory: data.parentCategory || undefined,
				coverImage: data.coverImage || undefined,
				isActive: data.isActive,
			},
			{
				onSuccess: () => {
					router.push("/dashboard/categories");
				},
			},
		);
	}

	// Auto-generate slug from name using slugify
	const handleNameChange = (value: string) => {
		form.setValue("name", value);
		if (!form.formState.dirtyFields.slug) {
			const generatedSlug = slugify(value, {
				lower: true,
				strict: true,
				remove: /[*+~.()'"!:@]/g,
			});
			form.setValue("slug", generatedSlug);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div>
				<h2 className="font-bold text-xl tracking-tight md:text-2xl">
					Create Category
				</h2>
				<p className="text-muted-foreground text-sm">
					Add a new category to organize your content
				</p>
			</div>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Category Details</CardTitle>
					<CardDescription>
						Fill in the information below to create a new category.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-name">
											Category Name
										</FieldLabel>
										<Input
											{...field}
											id="category-name"
											aria-invalid={fieldState.invalid}
											placeholder="Electronics"
											autoComplete="off"
											onChange={(e) => handleNameChange(e.target.value)}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="slug"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-slug">Slug</FieldLabel>
										<Input
											{...field}
											id="category-slug"
											aria-invalid={fieldState.invalid}
											placeholder="electronics"
											autoComplete="off"
										/>
										<FieldDescription>
											URL-friendly version. Auto-generated from name using
											slugify.
										</FieldDescription>
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
										<FieldLabel htmlFor="category-description">
											Description
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												{...field}
												id="category-description"
												placeholder="A brief description of this category..."
												rows={4}
												className="min-h-24 resize-none"
												aria-invalid={fieldState.invalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.value?.length || 0}/200 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										<FieldDescription>
											Provide a clear description of what this category
											includes.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="parentCategory"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-parent">
											Parent Category (Optional)
										</FieldLabel>
										<Select
											value={field.value || "none"}
											onValueChange={(value) =>
												field.onChange(value === "none" ? undefined : value)
											}
										>
											<SelectTrigger id="category-parent">
												<SelectValue placeholder="Select parent category" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												{parentCategories.map((cat) => (
													<SelectItem key={cat._id} value={cat._id}>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldDescription>
											Make this a subcategory of another category.
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
										<FieldLabel htmlFor="category-image">
											Cover Image URL (Optional)
										</FieldLabel>
										<Input
											{...field}
											id="category-image"
											aria-invalid={fieldState.invalid}
											placeholder="https://example.com/image.jpg"
											autoComplete="off"
										/>
										<FieldDescription>
											Provide a URL for the category cover image.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Field orientation="horizontal">
										<div className="space-y-0.5">
											<FieldLabel htmlFor="category-active">
												Active Status
											</FieldLabel>
											<FieldDescription>
												Inactive categories won't be visible to users.
											</FieldDescription>
										</div>
										<Switch
											id="category-active"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
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
							onClick={() => router.push("/dashboard/categories")}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							form="category-form"
							disabled={createMutation.isPending}
						>
							{createMutation.isPending ? "Creating..." : "Create Category"}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
