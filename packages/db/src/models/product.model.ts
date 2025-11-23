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
	rating: {
		rate: number;
		count: number;
	};
}

const productSchema = new mongoose.Schema<IProduct>(
	{
		_id: { type: String, default: () => generateId() },
		title: { type: String, required: true },
		price: { type: Number, required: true },
		description: { type: String, required: true },
		coverImage: { type: String, required: true },
		images: [{ type: String }],
		category: { type: String, ref: "Category", required: true },
		rating: {
			rate: { type: Number, required: true },
			count: { type: Number, required: true },
		},
	},
	{ timestamps: true },
);

export const Product =
	mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
