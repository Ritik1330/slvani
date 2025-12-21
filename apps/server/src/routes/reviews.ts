import { Order, Review } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { canAccessResource } from "@/middleware/authorization.middleware";
import {
	createReviewBodySchema,
	getProductReviewsParamsSchema,
	getReviewParamsSchema,
} from "@/schemas/review.schema";

type Variables = {
	user: User | null; // Mixed routes - GET is public, POST/DELETE require auth
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Get reviews for a product
app.get(
	"/product/:productId",
	zValidator("param", getProductReviewsParamsSchema),
	async (c) => {
		const { productId } = c.req.valid("param");
		const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
		return c.json(reviews);
	},
);

// Add review (Auth required)
app.post(
	"/",
	requireAuth,
	zValidator("json", createReviewBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const body = c.req.valid("json");

		// Check if user already reviewed this product
		const existingReview = await Review.findOne({
			userId: user.id,
			productId: body.productId,
		});

		if (existingReview) {
			throw new HTTPException(400, {
				message: "You have already reviewed this product",
			});
		}

		// Verify user has purchased the product
		const hasPurchased = await Order.findOne({
			userId: user.id,
			"items.productId": body.productId,
			status: "delivered",
		});

		if (!hasPurchased) {
			throw new HTTPException(403, {
				message: "You can only review products you have purchased and received",
			});
		}

		const review = await Review.create({
			...body,
			userId: user.id,
			isVerifiedPurchase: true,
		});

		return c.json(review, 201);
	},
);

// Delete review (Auth required, Owner/Admin)
app.delete(
	"/:id",
	requireAuth,
	zValidator("param", getReviewParamsSchema),
	async (c) => {
		const user = c.get("user") as User;
		const { id } = c.req.valid("param");

		const review = await Review.findById(id);

		if (!review) {
			throw new HTTPException(404, { message: "Review not found" });
		}

		if (!canAccessResource(user, review.userId)) {
			throw new HTTPException(403, { message: "Forbidden" });
		}

		await Review.findByIdAndDelete(id);
		return c.json({ message: "Review deleted successfully" });
	},
);

export default app;
