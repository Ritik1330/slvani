import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IWishlist {
	_id: string;
	userId: string;
	productIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
	{
		_id: { type: String, default: () => generateId() },
		userId: { type: String, required: true, unique: true, index: true },
		productIds: [{ type: String, ref: "Product" }],
	},
	{ timestamps: true },
);

// Add index for faster lookups
wishlistSchema.index({ userId: 1, productIds: 1 });

export const Wishlist = (mongoose.models.Wishlist ||
	mongoose.model<IWishlist>("Wishlist", wishlistSchema)) as mongoose.Model<IWishlist>;
