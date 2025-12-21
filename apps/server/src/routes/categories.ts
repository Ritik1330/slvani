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
		const category = await Category.create({
			...body,
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

export default app;
