import { z } from "zod";

// Schema for toggling wishlist item
export const toggleWishlistBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
});

// Schema for query parameters when getting wishlists (admin)
export const getWishlistsQuerySchema = z.object({
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().int().positive())
		.optional(),
	skip: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
});
