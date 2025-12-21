import { z } from "zod";

// Schema for creating a category
export const createCategoryBodySchema = z.object({
	name: z.string().min(1, "Name is required").trim(),
	slug: z
		.string()
		.min(1, "Slug is required")
		.toLowerCase()
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	description: z.string().trim().optional(),
	parentCategory: z.string().optional(),
	coverImage: z.string().url("Cover image must be a valid URL").optional(),
	order: z.number().int().min(0).default(0),
	isActive: z.boolean().default(true),
});

// Schema for updating a category
export const updateCategoryBodySchema = z.object({
	name: z.string().min(1, "Name is required").trim().optional(),
	slug: z
		.string()
		.min(1, "Slug is required")
		.toLowerCase()
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		)
		.optional(),
	description: z.string().trim().optional(),
	parentCategory: z.string().optional().nullable(),
	coverImage: z
		.string()
		.url("Cover image must be a valid URL")
		.optional()
		.nullable(),
	order: z.number().int().min(0).optional(),
	isActive: z.boolean().optional(),
});

// Schema for query parameters when getting categories
export const getCategoriesQuerySchema = z.object({
	isActive: z
		.string()
		.transform((val) => val === "true")
		.optional(),
	parentCategory: z.string().optional(),
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().int().positive())
		.optional(),
	skip: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
});

// Schema for route parameters when getting a single category
export const getCategoryParamsSchema = z.object({
	id: z.string().min(1, "Category ID is required"),
});
