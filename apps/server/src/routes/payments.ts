import { Payment } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { requireAuth } from "@/middleware/authentication.middleware";
import {
	createPaymentIntentBodySchema,
	paymentWebhookBodySchema,
} from "@/schemas/payment.schema";

type Variables = {
	user: User | null; // Mixed routes - create-intent requires auth, webhook is public
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Create payment intent (Auth required)
app.post(
	"/create-intent",
	requireAuth,
	zValidator("json", createPaymentIntentBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const { amount, orderId, method } = c.req.valid("json");

		// TODO: Integrate with Stripe/Razorpay
		// For now, return a mock client secret
		const clientSecret = `mock_client_secret_${Math.random().toString(36).substring(7)}`;

		// Create payment record
		await Payment.create({
			orderId,
			userId: user.id,
			amount,
			method,
			status: "pending",
			transactionId: `tx_${Math.random().toString(36).substring(7)}`,
		});

		return c.json({ clientSecret });
	},
);

// Webhook for payment updates (Public)
app.post(
	"/webhook",
	zValidator("json", paymentWebhookBodySchema),
	async (c) => {
		// TODO: Verify webhook signature from payment gateway
		const body = c.req.valid("json");
		console.log("Payment webhook received:", body);

		// TODO: Update payment status based on webhook event
		// Example: await Payment.findOneAndUpdate(
		//   { transactionId: body.transactionId },
		//   { status: body.status, gatewayResponse: body }
		// );

		return c.json({ received: true });
	},
);

export default app;
