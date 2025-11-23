import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IPayment {
	_id: string;
	orderId: string;
	userId: string;
	amount: number;
	method: "card" | "upi" | "netbanking" | "cod";
	status: "pending" | "success" | "failed" | "refunded";
	transactionId?: string;
	gatewayResponse?: Record<string, any>;
	failureReason?: string;
	refundId?: string;
	refundAmount?: number;
	createdAt: Date;
	updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
	{
		_id: { type: String, default: () => generateId() },
		orderId: { type: String, required: true, ref: "Order", index: true },
		userId: { type: String, required: true, index: true },
		amount: { type: Number, required: true, min: 0 },
		method: {
			type: String,
			enum: ["card", "upi", "netbanking", "cod"],
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "success", "failed", "refunded"],
			default: "pending",
			index: true,
		},
		transactionId: { type: String, unique: true, sparse: true },
		gatewayResponse: { type: Schema.Types.Mixed },
		failureReason: { type: String },
		refundId: { type: String },
		refundAmount: { type: Number, min: 0 },
	},
	{ timestamps: true },
);

export const Payment = (mongoose.models.Payment ||
	mongoose.model<IPayment>("Payment", paymentSchema)) as mongoose.Model<IPayment>;
