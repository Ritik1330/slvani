import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IOrderItem {
	productId: string;
	title: string;
	price: number;
	quantity: number;
	image: string;
}

export interface IOrderAddress {
	fullName: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	pincode: string;
	country: string;
}

export interface IOrder {
	_id: string;
	userId: string;
	items: IOrderItem[];
	subtotal: number;
	discount: number;
	total: number;
	status:
		| "pending"
		| "confirmed"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	paymentMethod: "card" | "upi" | "netbanking" | "cod";
	shippingAddress: IOrderAddress;
	billingAddress: IOrderAddress;
	couponCode?: string;
	transactionId?: string;
	createdAt: Date;
	updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
	{
		productId: { type: String, required: true },
		title: { type: String, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true, min: 1 },
		image: { type: String, required: true },
	},
	{ _id: false },
);

const addressSchema = new Schema<IOrderAddress>(
	{
		fullName: { type: String, required: true },
		phone: { type: String, required: true },
		addressLine1: { type: String, required: true },
		addressLine2: { type: String },
		city: { type: String, required: true },
		state: { type: String, required: true },
		pincode: { type: String, required: true },
		country: { type: String, required: true, default: "India" },
	},
	{ _id: false },
);

const orderSchema = new Schema<IOrder>(
	{
		_id: { type: String, default: () => generateId() },
		userId: { type: String, required: true, index: true },
		items: [orderItemSchema],
		subtotal: { type: Number, required: true, min: 0 },
		discount: { type: Number, default: 0, min: 0 },
		total: { type: Number, required: true, min: 0 },
		status: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
			index: true,
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed", "refunded"],
			default: "pending",
			index: true,
		},
		paymentMethod: {
			type: String,
			enum: ["card", "upi", "netbanking", "cod"],
			required: true,
		},
		shippingAddress: { type: addressSchema, required: true },
		billingAddress: { type: addressSchema, required: true },
		couponCode: { type: String },
		transactionId: { type: String },
	},
	{ timestamps: true },
);

export const Order = (mongoose.models.Order ||
	mongoose.model<IOrder>("Order", orderSchema)) as mongoose.Model<IOrder>;
