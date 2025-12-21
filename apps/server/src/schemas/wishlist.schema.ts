import { z } from "zod";

// Schema for toggling wishlist item
export const toggleWishlistBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
});
