import mongoose from "mongoose";
import { generateId } from "../utils/generate-id";

export interface ICartItem {
	productId: string;
	quantity: number;
}

export interface ICart {
	_id: string;
	userId: string;
	items: ICartItem[];
	createdAt: Date;
	updatedAt: Date;
}

const cartItemSchema = new mongoose.Schema<ICartItem>(
	{
		productId: { type: String, required: true },
		quantity: { type: Number, required: true, min: 1 },
	},
	{ _id: false },
);

const cartSchema = new mongoose.Schema<ICart>(
	{
		_id: { type: String, default: () => generateId() },
		userId: { type: String, required: true, unique: true },
		items: [cartItemSchema],
	},
	{ timestamps: true },
);

export const Cart = (mongoose.models.Cart ||
	mongoose.model<ICart>("Cart", cartSchema)) as mongoose.Model<ICart>;
