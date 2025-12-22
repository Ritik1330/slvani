import { z } from "zod";

// Schema for verifying a coupon
export const verifyCouponBodySchema = z.object({
	code: z.string().min(1, "Coupon code is required").toUpperCase(),
});

// Schema for creating a coupon
export const createCouponBodySchema = z.object({
	code: z
		.string()
		.min(3, "Coupon code must be at least 3 characters")
		.max(20, "Coupon code must be at most 20 characters")
		.toUpperCase(),
	discountType: z.enum(["percentage", "fixed"], {
		message: "Discount type must be 'percentage' or 'fixed'",
	}),
	discountValue: z.number().positive("Discount value must be positive"),
	minPurchase: z
		.number()
		.min(0, "Minimum purchase amount cannot be negative")
		.default(0),
	maxDiscount: z
		.number()
		.positive("Maximum discount amount must be positive")
		.optional(),
	startDate: z.string().datetime("Invalid start date format").optional(),
	expiryDate: z.string().datetime("Invalid expiry date format").optional(),
	usageLimit: z
		.number()
		.int()
		.positive("Usage limit must be a positive integer")
		.optional(),
	isActive: z.boolean().default(true),
	description: z.string().optional(),
});

// Schema for updating a coupon
export const updateCouponBodySchema = z.object({
	code: z
		.string()
		.min(3, "Coupon code must be at least 3 characters")
		.max(20, "Coupon code must be at most 20 characters")
		.toUpperCase()
		.optional(),
	discountType: z.enum(["percentage", "fixed"]).optional(),
	discountValue: z.number().positive().optional(),
	minPurchase: z.number().min(0).optional(),
	maxDiscount: z.number().positive().optional(),
	startDate: z.string().datetime().optional(),
	expiryDate: z.string().datetime().optional(),
	usageLimit: z.number().int().positive().optional(),
	isActive: z.boolean().optional(),
	description: z.string().optional(),
});

// Schema for coupon ID parameter
export const getCouponParamsSchema = z.object({
	id: z.string().min(1, "Coupon ID is required"),
});
