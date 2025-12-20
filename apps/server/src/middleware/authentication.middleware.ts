import type { Context } from "hono";
import { auth } from "@ecommerce/auth";

/**
 * Authentication middleware to protect routes
 * Checks for valid session and attaches user info to context
 */
export async function requireAuth(c: Context, next: () => Promise<void>) {
	try {
		// Get session from auth handler
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		// Attach user info to context
		c.set("user", session.user);
		c.set("session", session.session);

		await next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		return c.json({ error: "Unauthorized" }, 401);
	}
}

/**
 * Optional auth middleware - doesn't block if not authenticated
 * Useful for routes that work differently for authenticated users
 */
// export async function optionalrequireAuth(c: Context, next: () => Promise<void>) {
// 	try {
// 		const session = await auth.api.getSession({
// 			headers: c.req.raw.headers,
// 		});

// 		if (session) {
// 			c.set("user", session.user);
// 			c.set("session", session.session);
// 		}

// 		await next();
// 	} catch (error) {
// 		// Continue even if auth fails
// 		await next();
// 	}
// }
