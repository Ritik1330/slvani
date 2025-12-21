import { Image } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { generateUploadSignature } from "@/lib/cloudinary";
import { requireAuth } from "@/middleware/authentication.middleware";
import { requireAdmin } from "@/middleware/authorization.middleware";
import {
	createImageBodySchema,
	getImageParamsSchema,
	getImagesQuerySchema,
	updateImageBodySchema,
	uploadSignatureBodySchema,
} from "@/schemas/image.schema";

type Variables = {
	user: User | null; // Mixed routes - GET is public, POST/PUT/DELETE require admin
	session: Session | null;
};

const app = new Hono<{ Variables: Variables }>();

// Get all images (with optional filter by usedFor and pagination)
app.get("/", zValidator("query", getImagesQuerySchema), async (c) => {
	const query = c.req.valid("query");

	const filter = query.usedFor ? { usedFor: query.usedFor } : {};

	const total = await Image.countDocuments(filter);
	const images = await Image.find(filter)
		.sort({ createdAt: -1 })
		.skip((query.page - 1) * query.limit)
		.limit(query.limit);

	return c.json({
		data: images,
		pagination: {
			total,
			page: query.page,
			limit: query.limit,
			pages: Math.ceil(total / query.limit),
		},
	});
});

// Get single image by ID
app.get("/:id", zValidator("param", getImageParamsSchema), async (c) => {
	const { id } = c.req.valid("param");
	const image = await Image.findById(id);

	if (!image) {
		throw new HTTPException(404, { message: "Image not found" });
	}

	return c.json(image);
});

// Create new image (Admin only)
app.post(
	"/",
	requireAuth,
	requireAdmin,
	zValidator("json", createImageBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const body = c.req.valid("json");

		const image = await Image.create({
			...body,
			createdBy: user.id,
			updatedBy: user.id,
		});

		return c.json(image, 201);
	},
);

// Update image (Admin only)
app.put(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getImageParamsSchema),
	zValidator("json", updateImageBodySchema),
	async (c) => {
		const user = c.get("user") as User;
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		const image = await Image.findByIdAndUpdate(
			id,
			{ ...body, updatedBy: user.id },
			{ new: true },
		);

		if (!image) {
			throw new HTTPException(404, { message: "Image not found" });
		}

		return c.json(image);
	},
);

// Delete image (Admin only)
app.delete(
	"/:id",
	requireAuth,
	requireAdmin,
	zValidator("param", getImageParamsSchema),
	async (c) => {
		const { id } = c.req.valid("param");

		const image = await Image.findByIdAndDelete(id);

		if (!image) {
			throw new HTTPException(404, { message: "Image not found" });
		}

		return c.json({ message: "Image deleted successfully" });
	},
);

// Generate upload signature for client-side uploads (Admin only)
app.post(
	"/upload-signature",
	requireAuth,
	requireAdmin,
	zValidator("json", uploadSignatureBodySchema),
	async (c) => {
		const body = c.req.valid("json");
		const signatureData = generateUploadSignature(body.folder);
		return c.json(signatureData);
	},
);

export default app;
