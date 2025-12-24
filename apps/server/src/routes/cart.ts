import { Cart, Product } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	addToCartBodySchema,
	removeFromCartBodySchema,
	updateCartBodySchema,
} from "@/schemas/cart.schema";

type Variables = {
	user: User; // All routes require auth
	session: Session;
};

const app = new Hono<{ Variables: Variables }>();

// All cart routes require authentication
app.use("*", requireAuth);

// Admin: Get all carts
app.get("/admin/all", requireAdmin, async (c) => {
	const limit = Number(c.req.query("limit")) || 10;
	const skip = Number(c.req.query("skip")) || 0;

	const carts = await Cart.find()
		.sort({ updatedAt: -1 })
		.limit(limit)
		.skip(skip);

	// Populate each cart with product details
	const populatedCarts = await Promise.all(
		carts.map((cart) => populateCartWithProducts(cart)),
	);

	return c.json(populatedCarts);
});

// Helper function to populate cart with product details
async function populateCartWithProducts(cart: any) {
	const populatedItems = await Promise.all(
		cart.items.map(async (item: any) => {
			const product = await Product.findById(item.productId)
				.populate("coverImage")
				.populate("category");

			// Extract values from populated fields
			const coverImage =
				typeof product?.coverImage === "string"
					? product.coverImage
					: product?.coverImage?.url || "";

			const category =
				typeof product?.category === "string"
					? product.category
					: product?.category?.name || "";

			return {
				productId: item.productId,
				quantity: item.quantity,
				price: product?.price || 0,
				title: product?.title || "Unknown Product",
				coverImage,
				category,
			};
		}),
	);

	return {
		...cart.toObject(),
		items: populatedItems,
	};
}

// Get user's cart
app.get("/", async (c) => {
	const user = c.get("user");
	let cart = await Cart.findOne({ userId: user.id });

	if (!cart) {
		cart = await Cart.create({ userId: user.id, items: [] });
	}

	const populatedCart = await populateCartWithProducts(cart);
	return c.json(populatedCart);
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
	const populatedCart = await populateCartWithProducts(cart);
	return c.json(populatedCart);
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
	const populatedCart = await populateCartWithProducts(cart);
	return c.json(populatedCart);
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
	const populatedCart = await populateCartWithProducts(cart);
	return c.json(populatedCart);
});

// Clear cart
app.post("/clear", async (c) => {
	const user = c.get("user");
	await Cart.findOneAndUpdate({ userId: user.id }, { items: [] });
	return c.json({ message: "Cart cleared successfully" });
});

export default app;
