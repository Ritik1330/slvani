import { Coupon } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	createCouponBodySchema,
	verifyCouponBodySchema,
} from "@/schemas/coupon.schema";

type Variables = {
	user: User | null; // Mixed routes - verify needs auth, admin routes need admin
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Verify coupon (Auth required - any logged-in user)
app.post(
	"/verify",
	requireAuth,
	zValidator("json", verifyCouponBodySchema),
	async (c) => {
		// const user = c.get("user") as User;
		const { code } = c.req.valid("json");

		const coupon = await Coupon.findOne({ code: code.toUpperCase() });

		if (!coupon) {
			throw new HTTPException(404, { message: "Invalid coupon code" });
		}

		if (!coupon.isActive) {
			throw new HTTPException(400, { message: "Coupon is inactive" });
		}

		const now = new Date();
		if (
			now < coupon.startDate ||
			(coupon.expiryDate && now > coupon.expiryDate)
		) {
			throw new HTTPException(400, {
				message: "Coupon is expired or not yet valid",
			});
		}

		if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
			throw new HTTPException(400, { message: "Coupon usage limit reached" });
		}

		return c.json(coupon);
	},
);

// Get all coupons (Admin only)
app.get("/", requireAuth, requireAdmin, async (c) => {
	const coupons = await Coupon.find().sort({ createdAt: -1 });
	return c.json(coupons);
});

// Create coupon (Admin only)
app.post(
	"/",
	requireAuth,
	requireAdmin,
	zValidator("json", createCouponBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const body = c.req.valid("json");

		const coupon = await Coupon.create({
			...body,
			code: body.code.toUpperCase(),
			createdBy: user.id,
			updatedBy: user.id,
		});

		return c.json(coupon, 201);
	},
);

export default app;
