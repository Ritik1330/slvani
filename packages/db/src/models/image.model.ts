import mongoose from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IImage {
	_id: string;
	title: string;
	url: string;
	usedFor: "blog" | "product" | "category" | "banner" | "other";
	createdBy: string;
	updatedBy: string;
	createdAt: Date;
	updatedAt: Date;
}

const imageSchema = new mongoose.Schema<IImage>(
	{
		_id: { type: String, default: () => generateId() },
		title: { type: String, required: true },
		url: { type: String, required: true },
		usedFor: {
			type: String,
			enum: ["blog", "product", "category", "banner", "other"],
			required: true,
		},
		createdBy: { type: String, ref: "User", required: true },
		updatedBy: { type: String, ref: "User", required: true },
	},
	{ timestamps: true },
);

export const Image = (mongoose.models.Image ||
	mongoose.model<IImage>("Image", imageSchema)) as mongoose.Model<IImage>;
