import { z } from "zod";

// Schema for adding item to cart
export const addToCartBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

// Schema for removing item from cart
export const removeFromCartBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
});

// Schema for updating cart item quantity
export const updateCartBodySchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	quantity: z.number().int().min(0, "Quantity must be 0 or more"),
});

// Schema for cart item ID parameter (if needed in future)
export const getCartItemParamsSchema = z.object({
	id: z.string().min(1, "Cart item ID is required"),
});
