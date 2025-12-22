import { Wishlist } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	getWishlistsQuerySchema,
	toggleWishlistBodySchema,
} from "@/schemas/wishlist.schema";

type Variables = {
	user: User; // All routes require auth
	session: Session;
};

const app = new Hono<{ Variables: Variables }>();

// All wishlist routes require authentication
app.use("*", requireAuth);

// Get all wishlists (Admin only)
app.get(
	"/admin/all",
	requireAdmin,
	zValidator("query", getWishlistsQuerySchema),
	async (c) => {
		const query = c.req.valid("query");

		const limit = query.limit || 10;
		const skip = query.skip || 0;

		const wishlists = await Wishlist.find()
			.populate("productIds")
			.sort({ updatedAt: -1 })
			.limit(limit)
			.skip(skip);

		return c.json(wishlists);
	},
);

// Get user's wishlist
app.get("/", async (c) => {
	const user = c.get("user");
	let wishlist = await Wishlist.findOne({ userId: user.id }).populate(
		"productIds",
	);

	if (!wishlist) {
		wishlist = await Wishlist.create({ userId: user.id, productIds: [] });
	}

	return c.json(wishlist);
});

// Toggle item in wishlist (Add/Remove)
app.post("/toggle", zValidator("json", toggleWishlistBodySchema), async (c) => {
	const user = c.get("user");
	const { productId } = c.req.valid("json");

	let wishlist = await Wishlist.findOne({ userId: user.id });

	if (!wishlist) {
		wishlist = await Wishlist.create({
			userId: user.id,
			productIds: [productId],
		});
	} else {
		const index = wishlist.productIds.indexOf(productId);
		if (index > -1) {
			// Remove if exists
			wishlist.productIds.splice(index, 1);
		} else {
			// Add if not exists
			wishlist.productIds.push(productId);
		}
		await wishlist.save();
	}

	await wishlist.populate("productIds");
	return c.json(wishlist);
});

export default app;
