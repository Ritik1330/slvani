import { Cart, Product } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import {
	addToCartBodySchema,
	removeFromCartBodySchema,
	updateCartBodySchema,
} from "@/schemas/cart.schema";

type Variables = {
	user: User; // Non-null because all routes require auth
	session: Session;
};

const app = new Hono<{ Variables: Variables }>();

// All cart routes require authentication
app.use("*", requireAuth);

// Get user's cart
app.get("/", async (c) => {
	const user = c.get("user");
	let cart = await Cart.findOne({ userId: user.id }).populate(
		"items.productId",
	);

	if (!cart) {
		cart = await Cart.create({ userId: user.id, items: [] });
	}

	return c.json(cart);
});

// Add item to cart
app.post("/add", zValidator("json", addToCartBodySchema), async (c) => {
	const user = c.get("user");
	const { productId, quantity } = c.req.valid("json");

	// Verify product exists
	const product = await Product.findById(productId);
	if (!product) {
		throw new HTTPException(404, { message: "Product not found" });
	}

	let cart = await Cart.findOne({ userId: user.id });

	if (!cart) {
		cart = await Cart.create({
			userId: user.id,
			items: [{ productId, quantity }],
		});
	} else {
		const itemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId,
		);

		if (itemIndex > -1) {
			const item = cart.items[itemIndex];
			if (item) {
				item.quantity += quantity;
			}
		} else {
			cart.items.push({ productId, quantity });
		}
		await cart.save();
	}

	// Return populated cart
	await cart.populate("items.productId");
	return c.json(cart);
});

// Remove item from cart
app.post("/remove", zValidator("json", removeFromCartBodySchema), async (c) => {
	const user = c.get("user");
	const { productId } = c.req.valid("json");

	const cart = await Cart.findOne({ userId: user.id });
	if (!cart) {
		throw new HTTPException(404, { message: "Cart not found" });
	}

	cart.items = cart.items.filter(
		(item) => item.productId.toString() !== productId,
	);
	await cart.save();

	// Return populated cart
	await cart.populate("items.productId");
	return c.json(cart);
});

// Update item quantity
app.post("/update", zValidator("json", updateCartBodySchema), async (c) => {
	const user = c.get("user");
	const { productId, quantity } = c.req.valid("json");

	const cart = await Cart.findOne({ userId: user.id });
	if (!cart) {
		throw new HTTPException(404, { message: "Cart not found" });
	}

	if (quantity <= 0) {
		// Remove item if quantity is 0 or less
		cart.items = cart.items.filter(
			(item) => item.productId.toString() !== productId,
		);
	} else {
		const itemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId,
		);

		if (itemIndex > -1) {
			const item = cart.items[itemIndex];
			if (item) {
				item.quantity = quantity;
			}
		} else {
			throw new HTTPException(404, { message: "Item not found in cart" });
		}
	}

	await cart.save();
	await cart.populate("items.productId");
	return c.json(cart);
});

// Clear cart
app.post("/clear", async (c) => {
	const user = c.get("user");
	await Cart.findOneAndUpdate({ userId: user.id }, { items: [] });
	return c.json({ message: "Cart cleared successfully" });
});

export default app;
