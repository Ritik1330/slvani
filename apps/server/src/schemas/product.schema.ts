import { z } from "zod";

// Schema for creating a product
export const createProductBodySchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().positive("Price must be positive"),
	category: z.string().min(1, "Category is required"),
	coverImage: z.string().min(1, "Cover image is required"),
	images: z.array(z.string()).default([]),
	gender: z
		.enum(["unisex", "men", "women"], {
			message: "Gender must be 'unisex', 'men', or 'women'",
		})
		.default("unisex"),
	rating: z
		.object({
			rate: z.number().min(0).max(5).default(0),
			count: z.number().int().min(0).default(0),
		})
		.default({ rate: 0, count: 0 }),
});

// Schema for updating a product
export const updateProductBodySchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	price: z.number().positive().optional(),
	category: z.string().min(1).optional(),
	coverImage: z.string().min(1).optional(),
	images: z.array(z.string()).optional(),
	gender: z.enum(["unisex", "men", "women"]).optional(),
	rating: z
		.object({
			rate: z.number().min(0).max(5),
			count: z.number().int().min(0),
		})
		.optional(),
});

// Schema for product ID parameter
export const getProductParamsSchema = z.object({
	id: z.string().min(1, "Product ID is required"),
});

// Schema for query parameters
export const getProductsQuerySchema = z.object({
	category: z.string().optional(),
	search: z.string().optional(),
	sort: z.enum(["price_asc", "price_desc", "rating", "newest"]).optional(),
	minPrice: z.coerce.number().positive().optional(),
	maxPrice: z.coerce.number().positive().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});
