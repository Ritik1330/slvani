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
app.get("/admin/all", requireAuth, requireAdmin, async (c) => {
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

// Seed orders (Dev only)
app.post("/seed", async (c) => {
	// Basic check to prevent accidental seeding in production
	if (process.env.NODE_ENV === "production") {
		throw new HTTPException(403, {
			message: "Seeding not allowed in production",
		});
	}

	// Drop collection to clear any existing data
	try {
		await Order.collection.drop();
	} catch (_error) {
		// Ignore error if collection doesn't exist
	}

	const userId = "6949110c580e0c06b522b4bd";
	const productId = "UChx0pbKti";

	const mockOrders = [
		{
			userId,
			items: [
				{
					productId,
					title: "Ethereal Gold Necklace",
					price: 1250,
					quantity: 2,
					image:
						"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
				},
				{
					productId,
					title: "Diamond Solitaire Ring",
					price: 3400,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
				},
			],
			subtotal: 5900,
			discount: 590,
			total: 5310,
			status: "pending",
			paymentStatus: "pending",
			paymentMethod: "card",
			shippingAddress: {
				fullName: "Rajesh Kumar",
				phone: "+91 98765 43210",
				addressLine1: "123, MG Road",
				addressLine2: "Near City Mall",
				city: "Mumbai",
				state: "Maharashtra",
				pincode: "400001",
				country: "India",
			},
			billingAddress: {
				fullName: "Rajesh Kumar",
				phone: "+91 98765 43210",
				addressLine1: "123, MG Road",
				addressLine2: "Near City Mall",
				city: "Mumbai",
				state: "Maharashtra",
				pincode: "400001",
				country: "India",
			},
			couponCode: "WELCOME10",
			transactionId: "TXN123456789",
		},
		{
			userId,
			items: [
				{
					productId,
					title: "Pearl Drop Earrings",
					price: 890,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
				},
			],
			subtotal: 890,
			discount: 0,
			total: 890,
			status: "confirmed",
			paymentStatus: "paid",
			paymentMethod: "upi",
			shippingAddress: {
				fullName: "Priya Sharma",
				phone: "+91 87654 32109",
				addressLine1: "456, Park Street",
				city: "Delhi",
				state: "Delhi",
				pincode: "110001",
				country: "India",
			},
			billingAddress: {
				fullName: "Priya Sharma",
				phone: "+91 87654 32109",
				addressLine1: "456, Park Street",
				city: "Delhi",
				state: "Delhi",
				pincode: "110001",
				country: "India",
			},
			transactionId: "UPI987654321",
		},
		{
			userId,
			items: [
				{
					productId,
					title: "Gold Cuff Bracelet",
					price: 1500,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
				},
				{
					productId,
					title: "Ethereal Gold Necklace",
					price: 1250,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
				},
			],
			subtotal: 2750,
			discount: 275,
			total: 2475,
			status: "processing",
			paymentStatus: "paid",
			paymentMethod: "netbanking",
			shippingAddress: {
				fullName: "Amit Patel",
				phone: "+91 76543 21098",
				addressLine1: "789, Ring Road",
				addressLine2: "Satellite Area",
				city: "Ahmedabad",
				state: "Gujarat",
				pincode: "380015",
				country: "India",
			},
			billingAddress: {
				fullName: "Amit Patel",
				phone: "+91 76543 21098",
				addressLine1: "789, Ring Road",
				addressLine2: "Satellite Area",
				city: "Ahmedabad",
				state: "Gujarat",
				pincode: "380015",
				country: "India",
			},
			couponCode: "SAVE10",
			transactionId: "NET456789123",
		},
		{
			userId,
			items: [
				{
					productId,
					title: "Diamond Solitaire Ring",
					price: 3400,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
				},
			],
			subtotal: 3400,
			discount: 0,
			total: 3400,
			status: "shipped",
			paymentStatus: "paid",
			paymentMethod: "card",
			shippingAddress: {
				fullName: "Sneha Reddy",
				phone: "+91 65432 10987",
				addressLine1: "321, Banjara Hills",
				city: "Hyderabad",
				state: "Telangana",
				pincode: "500034",
				country: "India",
			},
			billingAddress: {
				fullName: "Sneha Reddy",
				phone: "+91 65432 10987",
				addressLine1: "321, Banjara Hills",
				city: "Hyderabad",
				state: "Telangana",
				pincode: "500034",
				country: "India",
			},
			transactionId: "CARD789456123",
		},
		{
			userId,
			items: [
				{
					productId,
					title: "Pearl Drop Earrings",
					price: 890,
					quantity: 2,
					image:
						"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
				},
				{
					productId,
					title: "Gold Cuff Bracelet",
					price: 1500,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
				},
			],
			subtotal: 3280,
			discount: 0,
			total: 3280,
			status: "delivered",
			paymentStatus: "paid",
			paymentMethod: "cod",
			shippingAddress: {
				fullName: "Vikram Singh",
				phone: "+91 54321 09876",
				addressLine1: "654, Civil Lines",
				city: "Jaipur",
				state: "Rajasthan",
				pincode: "302006",
				country: "India",
			},
			billingAddress: {
				fullName: "Vikram Singh",
				phone: "+91 54321 09876",
				addressLine1: "654, Civil Lines",
				city: "Jaipur",
				state: "Rajasthan",
				pincode: "302006",
				country: "India",
			},
		},
		{
			userId,
			items: [
				{
					productId,
					title: "Ethereal Gold Necklace",
					price: 1250,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
				},
			],
			subtotal: 1250,
			discount: 0,
			total: 1250,
			status: "cancelled",
			paymentStatus: "refunded",
			paymentMethod: "upi",
			shippingAddress: {
				fullName: "Anita Desai",
				phone: "+91 43210 98765",
				addressLine1: "987, Koramangala",
				city: "Bangalore",
				state: "Karnataka",
				pincode: "560034",
				country: "India",
			},
			billingAddress: {
				fullName: "Anita Desai",
				phone: "+91 43210 98765",
				addressLine1: "987, Koramangala",
				city: "Bangalore",
				state: "Karnataka",
				pincode: "560034",
				country: "India",
			},
			transactionId: "UPI123789456",
		},
	];

	const orders = await Order.create(mockOrders);
	return c.json({
		message: "Orders seeded successfully",
		count: orders.length,
	});
});

export default app;
