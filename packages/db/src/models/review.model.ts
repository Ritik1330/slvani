import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IReview {
	_id: string;
	userId: string;
	productId: string; // Using String to match Product _id type
	rating: number;
	comment?: string;
	images?: string[];
	isVerifiedPurchase: boolean;
	likes: number;
	createdAt: Date;
	updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
	{
		_id: { type: String, default: () => generateId() },
		userId: { type: String, required: true, index: true },
		productId: { type: String, required: true, ref: "Product", index: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, trim: true },
		images: [{ type: String }],
		isVerifiedPurchase: { type: Boolean, default: false },
		likes: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

// Prevent multiple reviews from the same user for the same product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = (mongoose.models.Review ||
	mongoose.model<IReview>("Review", reviewSchema)) as mongoose.Model<IReview>;
