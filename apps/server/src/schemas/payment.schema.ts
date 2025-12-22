import { z } from "zod";

// Schema for creating payment intent
export const createPaymentIntentBodySchema = z.object({
	amount: z.number().positive("Amount must be positive"),
	orderId: z.string().min(1, "Order ID is required"),
	method: z
		.enum(["card", "upi", "netbanking", "cod"], {
			message: "Invalid payment method",
		})
		.default("card"),
});

// Schema for query parameters when getting payments (admin)
export const getPaymentsQuerySchema = z.object({
	status: z.enum(["pending", "success", "failed", "refunded"]).optional(),
	method: z.enum(["card", "upi", "netbanking", "cod"]).optional(),
	orderId: z.string().optional(),
	limit: z
		.string()
		.transform(Number)
		.pipe(z.number().int().positive())
		.optional(),
	skip: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
});

// Schema for webhook payload (basic validation)
export const paymentWebhookBodySchema = z
	.object({
		event: z.string().optional(),
		transactionId: z.string().optional(),
		status: z.enum(["pending", "success", "failed", "refunded"]).optional(),
		orderId: z.string().optional(),
		amount: z.number().optional(),
	})
	.passthrough(); // Allow additional fields from payment gateway
