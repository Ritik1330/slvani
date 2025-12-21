import { Address } from "@ecommerce/db";
import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "better-auth/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "@/middleware/authentication.middleware";
import { canAccessResource } from "@/middleware/authorization.middleware";
import {
	createAddressBodySchema,
	getAddressParamsSchema,
	updateAddressBodySchema,
} from "@/schemas/address.schema";

type Variables = {
	user: User; // Non-null because all routes require auth
	session: Session;
};

const app = new Hono<{ Variables: Variables }>();

// All address routes require authentication
app.use("*", requireAuth);

// Get user's addresses
app.get("/", async (c) => {
	const user = c.get("user");
	const addresses = await Address.find({ userId: user.id });
	return c.json(addresses);
});

// Add address
app.post("/", zValidator("json", createAddressBodySchema), async (c) => {
	const user = c.get("user");
	const body = c.req.valid("json");

	const address = await Address.create({
		...body,
		userId: user.id,
	});

	return c.json(address, 201);
});

// Update address
app.put(
	"/:id",
	zValidator("param", getAddressParamsSchema),
	zValidator("json", updateAddressBodySchema),
	async (c) => {
		const user = c.get("user");
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		const address = await Address.findById(id);
		if (!address) {
			throw new HTTPException(404, { message: "Address not found" });
		}

		// Check ownership (user owns it or is admin)
		if (!canAccessResource(user, address.userId)) {
			throw new HTTPException(403, { message: "Forbidden" });
		}

		const updatedAddress = await Address.findByIdAndUpdate(id, body, {
			new: true,
		});

		return c.json(updatedAddress);
	},
);

// Delete address
app.delete("/:id", zValidator("param", getAddressParamsSchema), async (c) => {
	const user = c.get("user");
	const { id } = c.req.valid("param");

	const address = await Address.findById(id);
	if (!address) {
		throw new HTTPException(404, { message: "Address not found" });
	}

	// Check ownership (user owns it or is admin)
	if (!canAccessResource(user, address.userId)) {
		throw new HTTPException(403, { message: "Forbidden" });
	}

	await Address.findByIdAndDelete(id);
	return c.json({ message: "Address deleted successfully" });
});

export default app;
