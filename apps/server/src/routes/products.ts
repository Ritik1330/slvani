import { Category, Product } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	createProductBodySchema,
	getProductParamsSchema,
	getProductsQuerySchema,
	updateProductBodySchema,
} from "@/schemas/product.schema";

type Variables = {
	user: User | null; // Mixed routes - GET is public, POST/PUT/DELETE require admin
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Get all products with filtering and pagination
app.get("/", zValidator("query", getProductsQuerySchema), async (c) => {
	const query = c.req.valid("query");
	const filter: any = {};

	if (query.category) {
		filter.category = query.category;
	}

	if (query.search) {
		filter.$or = [
			{ title: { $regex: query.search, $options: "i" } },
			{ description: { $regex: query.search, $options: "i" } },
		];
	}

	if (query.minPrice || query.maxPrice) {
		filter.price = {};
		if (query.minPrice) filter.price.$gte = query.minPrice;
		if (query.maxPrice) filter.price.$lte = query.maxPrice;
	}

	let sortOption: any = { createdAt: -1 };
	if (query.sort === "price_asc") sortOption = { price: 1 };
	if (query.sort === "price_desc") sortOption = { price: -1 };
	if (query.sort === "rating") sortOption = { "rating.rate": -1 };

	const skip = (query.page - 1) * query.limit;

	const [products, total] = await Promise.all([
		Product.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(query.limit)
			.populate("category")
			.populate("coverImage")
			.populate("images"),
		Product.countDocuments(filter),
	]);

	return c.json({
		data: products,
		pagination: {
			total,
			page: query.page,
			limit: query.limit,
			pages: Math.ceil(total / query.limit),
		},
	});
});

// Get single product
app.get("/:id", zValidator("param", getProductParamsSchema), async (c) => {
	const { id } = c.req.valid("param");
	const product = await Product.findById(id)
		.populate("category")
		.populate("coverImage")
		.populate("images");

	if (!product) {
		throw new HTTPException(404, { message: "Product not found" });
	}

	return c.json(product);
});

// Create product (Admin only)
app.post(
	"/",
	requireAuth,
	requireAdmin,
	zValidator("json", createProductBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const body = c.req.valid("json");

		const product = await Product.create({
			...body,
			createdBy: user.id,
			updatedBy: user.id,
		});

		return c.json(product, 201);
	},
);

// Update product (Admin only)
app.put(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getProductParamsSchema),
	zValidator("json", updateProductBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		const product = await Product.findByIdAndUpdate(
			id,
			{ ...body, updatedBy: user.id },
			{ new: true },
		);

		if (!product) {
			throw new HTTPException(404, { message: "Product not found" });
		}

		return c.json(product);
	},
);

// Delete product (Admin only)
app.delete(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getProductParamsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			throw new HTTPException(404, { message: "Product not found" });
		}

		return c.json({ message: "Product deleted successfully" });
	},
);

// Seed products (Admin only - or dev only)
app.post("/seed", async (c) => {
	// Basic check to prevent accidental seeding in production
	if (process.env.NODE_ENV === "production") {
		throw new HTTPException(403, {
			message: "Seeding not allowed in production",
		});
	}

	// Drop collection to clear any conflicting indexes
	try {
		await Product.collection.drop();
	} catch (_error) {
		// Ignore error if collection doesn't exist
	}

	// Drop Category collection as well to ensure clean state
	try {
		await Category.collection.drop();
	} catch (_error) {
		// Ignore
	}

	// Create Categories first
	const categories = await Category.create([
		{
			name: "Necklaces",
			slug: "necklaces",
			description: "Beautiful necklaces",
		},
		{ name: "Rings", slug: "rings", description: "Elegant rings" },
		{ name: "Earrings", slug: "earrings", description: "Stunning earrings" },
		{
			name: "Bracelets",
			slug: "bracelets",
			description: "Charming bracelets",
		},
	]);

	// Map category slugs to IDs for easy lookup
	const categoryMap = categories.reduce((acc: any, cat: any) => {
		acc[cat.slug] = cat._id;
		return acc;
	}, {});

	const mockProducts = [
		{
			title: "Ethereal Gold Necklace",
			price: 1250,
			coverImage:
				"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
			category: categoryMap.necklaces,
			description:
				"A stunning gold necklace that captures the essence of elegance.",
			rating: { rate: 4.8, count: 120 },
		},
		{
			title: "Diamond Solitaire Ring",
			price: 3400,
			coverImage:
				"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
			category: categoryMap.rings,
			description:
				"A classic diamond solitaire ring, perfect for special occasions.",
			rating: { rate: 4.9, count: 85 },
		},
		{
			title: "Pearl Drop Earrings",
			price: 890,
			coverImage:
				"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
			category: categoryMap.earrings,
			description:
				"Elegant pearl drop earrings that add a touch of sophistication.",
			rating: { rate: 4.7, count: 200 },
		},
		{
			title: "Gold Cuff Bracelet",
			price: 1500,
			coverImage:
				"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
			category: categoryMap.bracelets,
			description: "A bold gold cuff bracelet that makes a statement.",
			rating: { rate: 4.6, count: 150 },
		},
	];

	const products = await Product.create(mockProducts);
	return c.json({
		message: "Database seeded successfully",
		count: products.length,
	});
});

export default app;
