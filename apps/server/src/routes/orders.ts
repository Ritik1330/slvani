import { Order } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import {
	canAccessResource,
	requireAdmin,
} from "@/middleware/authorization.middleware";
import {
	createOrderBodySchema,
	getOrderParamsSchema,
	updateOrderStatusBodySchema,
} from "@/schemas/order.schema";

type Variables = {
	user: User; // All routes require auth
	session: Session;
};

const app = new Hono<{ Variables: Variables }>();

// All routes require authentication
app.use("*", requireAuth);

// Create order (Auth required)
app.post("/", zValidator("json", createOrderBodySchema), async (c) => {
	const user = c.get("user");
	const body = c.req.valid("json");

	// In production, validate prices from DB to prevent tampering
	const order = await Order.create({
		...body,
		userId: user.id,
	});

	return c.json(order, 201);
});

// Get user's orders (Auth required)
app.get("/", async (c) => {
	const user = c.get("user");

	// Users see only their own orders
	const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
	return c.json(orders);
});

// Get all orders (Admin only)
app.get("/admin/all", requireAdmin, async (c) => {
	const orders = await Order.find().sort({ createdAt: -1 });
	return c.json(orders);
});

// Get order details (Auth required, Owner/Admin)
app.get("/:id", zValidator("param", getOrderParamsSchema), async (c) => {
	const user = c.get("user");
	const { id } = c.req.valid("param");

	const order = await Order.findById(id);

	if (!order) {
		throw new HTTPException(404, { message: "Order not found" });
	}

	if (!canAccessResource(user, order.userId)) {
		throw new HTTPException(403, { message: "Forbidden" });
	}

	return c.json(order);
});

// Update order status (Admin only)
app.put(
	"/:id/status",
	requireAdmin,
	zValidator("param", getOrderParamsSchema),
	zValidator("json", updateOrderStatusBodySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { status } = c.req.valid("json");

		const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

		if (!order) {
			throw new HTTPException(404, { message: "Order not found" });
		}

		return c.json(order);
	},
);

export default app;
