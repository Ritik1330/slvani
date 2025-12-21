import { z } from "zod";

// Schema for creating an image
export const createImageBodySchema = z.object({
	title: z.string().min(1, "Title is required"),
	url: z.url("Invalid URL format"),
	usedFor: z.enum(["product", "category", "banner", "other"], {
		message: "usedFor must be 'product', 'category', 'banner', or 'other'",
	}),
	altText: z.string().optional(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
});

// Schema for updating an image
export const updateImageBodySchema = z.object({
	title: z.string().min(1).optional(),
	url: z.string().url().optional(),
	usedFor: z.enum(["product", "category", "banner", "other"]).optional(),
	altText: z.string().optional(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
});

// Schema for image ID parameter
export const getImageParamsSchema = z.object({
	id: z.string().min(1, "Image ID is required"),
});

// Schema for query parameters
export const getImagesQuerySchema = z.object({
	usedFor: z.enum(["product", "category", "banner", "other"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});

// Schema for upload signature
export const uploadSignatureBodySchema = z.object({
	folder: z.string().default("ecommerce"),
});
