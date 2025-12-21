import { z } from "zod";

// Schema for order item
const orderItemSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	title: z.string().min(1, "Product title is required"),
	price: z.number().positive("Price must be positive"),
	quantity: z.number().int().positive("Quantity must be at least 1"),
	image: z.string().url("Invalid image URL"),
});

// Schema for address
const addressSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	addressLine1: z.string().min(1, "Address line 1 is required"),
	addressLine2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	pincode: z.string().min(1, "Pincode is required"),
	country: z.string().default("India"),
});

// Schema for creating an order
export const createOrderBodySchema = z.object({
	items: z.array(orderItemSchema).min(1, "At least one item is required"),
	subtotal: z.number().min(0, "Subtotal cannot be negative"),
	discount: z.number().min(0, "Discount cannot be negative").default(0),
	total: z.number().min(0, "Total cannot be negative"),
	paymentMethod: z.enum(["card", "upi", "netbanking", "cod"], {
		message: "Invalid payment method",
	}),
	shippingAddress: addressSchema,
	billingAddress: addressSchema,
	couponCode: z.string().optional(),
	transactionId: z.string().optional(),
});

// Schema for updating order status
export const updateOrderStatusBodySchema = z.object({
	status: z.enum(
		["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
		{
			message: "Invalid order status",
		},
	),
});

// Schema for order ID parameter
export const getOrderParamsSchema = z.object({
	id: z.string().min(1, "Order ID is required"),
});
