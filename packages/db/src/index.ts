import mongoose from "mongoose";

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export { client };
export * from "./models/address.model";
export * from "./models/cart.model";
export * from "./models/category.model";
export * from "./models/coupon.model";
export * from "./models/image.model";
export * from "./models/order.model";
export * from "./models/payment.model";
export * from "./models/product.model";
export * from "./models/review.model";
export * from "./models/wishlist.model";
