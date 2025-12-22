import { z } from "zod";

// Schema for creating a review
export const createReviewBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	rating: z
		.number()
		.int()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating must be at most 5"),
	comment: z.string().optional(),
	images: z.array(z.string().url("Invalid image URL")).optional(),
});

// Schema for updating a review
export const updateReviewBodySchema = z.object({
	rating: z.number().int().min(1).max(5).optional(),
	comment: z.string().optional(),
	images: z.array(z.string().url()).optional(),
});

// Schema for review ID parameter
export const getReviewParamsSchema = z.object({
	id: z.string().min(1, "Review ID is required"),
});

// Schema for product ID parameter
export const getProductReviewsParamsSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
});

// Schema for query parameters when getting reviews (admin)
export const getReviewsQuerySchema = z.object({
	productId: z.string().optional(),
	isVerifiedPurchase: z
		.string()
		.transform((val) => val === "true")
		.optional(),
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().int().positive())
		.optional(),
	skip: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
});
