import "dotenv/config";
import { auth } from "@ecommerce/auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
	globalErrorHandler,
	notFoundHandler,
} from "./middleware/httpException.middleware";
import addressesRouter from "./routes/addresses";
import cartRouter from "./routes/cart";
import categoriesRouter from "./routes/categories";
import couponsRouter from "./routes/coupons";
import imagesRouter from "./routes/images";
import ordersRouter from "./routes/orders";
import paymentsRouter from "./routes/payments";
import productsRouter from "./routes/products";
import reviewsRouter from "./routes/reviews";
import wishlistRouter from "./routes/wishlist";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// Global error & not found handlers
app.onError(globalErrorHandler);
app.notFound(notFoundHandler);

// Auth routes
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// API Routes
app.route("/api/products", productsRouter);
app.route("/api/cart", cartRouter);
app.route("/api/categories", categoriesRouter);
app.route("/api/orders", ordersRouter);
app.route("/api/reviews", reviewsRouter);
app.route("/api/wishlist", wishlistRouter);
app.route("/api/addresses", addressesRouter);
app.route("/api/coupons", couponsRouter);
app.route("/api/payments", paymentsRouter);
app.route("/api/images", imagesRouter);

// Health check
app.get("/", (c) => {
	return c.text("OK");
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
