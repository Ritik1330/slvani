import crypto from "node:crypto";
import { Order, Payment } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import Razorpay from "razorpay";
import { z } from "zod";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import { getPaymentsQuerySchema } from "@/schemas/payment.schema";

type Variables = {
	user: User | null;
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Initialize Razorpay
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID || "",
	key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Get all payments (Admin only)
app.get(
	"/admin/all",
	requireAuth,
	requireAdmin,
	zValidator("query", getPaymentsQuerySchema),
	async (c) => {
		const query = c.req.valid("query");

		const filter: any = {};

		if (query.status) {
			filter.status = query.status;
		}

		if (query.method) {
			filter.method = query.method;
		}

		if (query.orderId) {
			filter.orderId = query.orderId;
		}

		const limit = query.limit || 10;
		const skip = query.skip || 0;

		const payments = await Payment.find(filter)
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(skip);

		return c.json(payments);
	},
);

// Create Razorpay order schema
const createRazorpayOrderSchema = z.object({
	amount: z.number().positive("Amount must be positive"),
});

// Create Razorpay order (Auth required)
app.post(
	"/create-order",
	requireAuth,
	zValidator("json", createRazorpayOrderSchema),
	async (c) => {
		const { amount } = c.req.valid("json");

		try {
			const options = {
				amount: Math.round(amount * 100), // Razorpay expects amount in paise
				currency: "INR",
				receipt: `receipt_${Date.now()}`,
			};

			const order = await razorpay.orders.create(options);

			return c.json({
				orderId: order.id,
				amount: order.amount,
				currency: order.currency,
				keyId: process.env.RAZORPAY_KEY_ID,
			});
		} catch (error) {
			console.error("Razorpay order creation failed:", error);
			throw new HTTPException(500, {
				message: "Failed to create payment order",
			});
		}
	},
);

// Verify payment schema
const verifyPaymentSchema = z.object({
	razorpay_order_id: z.string(),
	razorpay_payment_id: z.string(),
	razorpay_signature: z.string(),
	orderId: z.string(), // Our order ID
});

// Verify Razorpay payment (Auth required)
app.post(
	"/verify",
	requireAuth,
	zValidator("json", verifyPaymentSchema),
	async (c) => {
		const user = c.get("user") as User;
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			orderId,
		} = c.req.valid("json");

		// Verify signature
		const body = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
			.update(body)
			.digest("hex");

		if (expectedSignature !== razorpay_signature) {
			throw new HTTPException(400, { message: "Invalid payment signature" });
		}

		// Fetch payment details from Razorpay to double-check
		try {
			const payment = await razorpay.payments.fetch(razorpay_payment_id);

			// Verify payment status
			if (payment.status !== "captured" && payment.status !== "authorized") {
				throw new HTTPException(400, { message: "Payment not successful" });
			}

			// Verify order ID matches
			if (payment.order_id !== razorpay_order_id) {
				throw new HTTPException(400, { message: "Order ID mismatch" });
			}

			// Fetch order and verify ownership
			const order = await Order.findById(orderId);

			if (!order) {
				throw new HTTPException(404, { message: "Order not found" });
			}

			// Verify user owns this order
			if (order.userId !== user.id) {
				throw new HTTPException(403, {
					message: "Unauthorized: Order does not belong to you",
				});
			}

			// Verify order amount matches payment amount
			if (order.total * 100 !== payment.amount) {
				throw new HTTPException(400, { message: "Amount mismatch" });
			}

			// Update order payment status
			order.paymentStatus = "paid";
			order.transactionId = razorpay_payment_id;
			order.status = "confirmed";
			await order.save();

			// Create payment record
			await Payment.create({
				orderId,
				userId: user.id,
				amount: order.total,
				method: payment.method || "card",
				status: "success",
				transactionId: razorpay_payment_id,
				gatewayResponse: {
					razorpay_order_id,
					razorpay_payment_id,
					razorpay_signature,
					payment_status: payment.status,
					payment_method: payment.method,
				},
			});

			return c.json({ success: true, order });
		} catch (error) {
			console.error("Razorpay verification error:", error);
			throw new HTTPException(500, { message: "Payment verification failed" });
		}
	},
);

// Webhook for Razorpay payment updates (Public)
app.post("/webhook", async (c) => {
	const body = await c.req.text();
	const signature = c.req.header("x-razorpay-signature");

	// Verify webhook signature
	if (signature) {
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
			.update(body)
			.digest("hex");

		if (expectedSignature !== signature) {
			console.error("Invalid webhook signature");
			return c.json({ error: "Invalid signature" }, 400);
		}
	}

	const payload = JSON.parse(body);
	console.log("Razorpay webhook received:", payload.event);

	// Handle different webhook events
	if (payload.event === "payment.captured") {
		const paymentEntity = payload.payload.payment.entity;

		await Payment.findOneAndUpdate(
			{ transactionId: paymentEntity.id },
			{
				status: "success",
				gatewayResponse: paymentEntity,
			},
		);
	} else if (payload.event === "payment.failed") {
		const paymentEntity = payload.payload.payment.entity;

		await Payment.findOneAndUpdate(
			{ transactionId: paymentEntity.id },
			{
				status: "failed",
				failureReason: paymentEntity.error_description,
				gatewayResponse: paymentEntity,
			},
		);
	}

	return c.json({ received: true });
});

export default app;
