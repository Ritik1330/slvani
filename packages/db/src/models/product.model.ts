import mongoose from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IProduct {
	_id: string;
	title: string;
	price: number;
	description: string;
	coverImage: string;
	images: string[];
	category: string;
	gender: "unisex" | "men" | "women";
	rating: {
		rate: number;
		count: number;
	};
	isActive: boolean;
	createdBy: string;
	updatedBy: string;
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
	{
		_id: { type: String, default: () => generateId() },
		title: { type: String, required: true },
		price: { type: Number, required: true },
		description: { type: String, required: true },
		coverImage: { type: String, ref: "Image", required: true },
		images: [{ type: String, ref: "Image" }],
		category: { type: String, ref: "Category", required: true },
		gender: {
			type: String,
			enum: ["unisex", "men", "women"],
			default: "unisex",
		},
		rating: {
			rate: { type: Number, default: 0 },
			count: { type: Number, default: 0 },
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		createdBy: { type: String, ref: "User", required: true },
		updatedBy: { type: String, ref: "User", required: true },
	},
	{ timestamps: true },
);

export const Product = (mongoose.models.Product ||
	mongoose.model<IProduct>(
		"Product",
		productSchema,
	)) as mongoose.Model<IProduct>;
