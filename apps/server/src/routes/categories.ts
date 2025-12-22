import { Category } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	createCategoryBodySchema,
	getCategoriesQuerySchema,
	getCategoryParamsSchema,
	updateCategoryBodySchema,
} from "@/schemas/category.schema";

type Variables = {
	user: User | null;
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Get all categories
app.get("/", zValidator("query", getCategoriesQuerySchema), async (c) => {
	const query = c.req.valid("query");
	const filter: any = {};

	if (query.isActive !== undefined) {
		filter.isActive = query.isActive;
	}
	if (query.parentCategory) {
		filter.parentCategory = query.parentCategory;
	}

	const categories = await Category.find(filter)
		.sort({ order: 1 })
		.limit(query.limit || 0)
		.skip(query.skip || 0);

	return c.json(categories);
});

// Get single category by ID
app.get("/:id", zValidator("param", getCategoryParamsSchema), async (c) => {
	const { id } = c.req.valid("param");
	const category = await Category.findById(id);

	if (!category) {
		throw new HTTPException(404, { message: "Category not found" });
	}

	return c.json(category);
});

// Create category (Admin only)
app.post(
	"/",
	requireAuth,
	requireAdmin,
	zValidator("json", createCategoryBodySchema),
	async (c) => {
		const user = c.get("user");
		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}
		const body = c.req.valid("json");

		// Check if slug already exists
		const existingCategory = await Category.findOne({ slug: body.slug });
		if (existingCategory) {
			throw new HTTPException(400, {
				message: "A category with this slug already exists",
			});
		}

		// Auto-assign order based on max existing order
		const maxOrderCategory = await Category.findOne()
			.sort({ order: -1 })
			.select("order");
		const nextOrder = maxOrderCategory ? (maxOrderCategory.order || 0) + 1 : 1;

		const category = await Category.create({
			...body,
			order: nextOrder,
			createdBy: user.id,
			updatedBy: user.id,
		});
		return c.json(category, 201);
	},
);

// Update category (Admin only)
app.put(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getCategoryParamsSchema),
	zValidator("json", updateCategoryBodySchema),
	async (c) => {
		const user = c.get("user");
		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		const category = await Category.findByIdAndUpdate(
			id,
			{ ...body, updatedBy: user.id },
			{ new: true },
		);

		if (!category) {
			throw new HTTPException(404, { message: "Category not found" });
		}

		return c.json(category);
	},
);

// Delete category (Admin only)
app.delete(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getCategoryParamsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const category = await Category.findByIdAndDelete(id);

		if (!category) {
			throw new HTTPException(404, { message: "Category not found" });
		}

		return c.json({ message: "Category deleted successfully" });
	},
);

// Reorder categories (Admin only)
app.post("/reorder", requireAuth, requireAdmin, async (c) => {
	const body = await c.req.json();
	const updates = body.updates;

	if (!Array.isArray(updates)) {
		throw new HTTPException(400, { message: "Updates must be an array" });
	}

	const bulkOps = updates.map(
		(update: { id: string; displayOrder: number }) => ({
			updateOne: {
				filter: { _id: update.id },
				update: { $set: { order: update.displayOrder } },
			},
		}),
	);

	await Category.bulkWrite(bulkOps);

	return c.json({ message: "Categories reordered successfully" });
});

export default app;
