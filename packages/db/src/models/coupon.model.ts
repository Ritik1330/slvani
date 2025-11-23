import mongoose, { Document, Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface ICoupon {
	_id: string;
	code: string;
	description?: string;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minPurchase: number;
	maxDiscount?: number;
	startDate: Date;
	expiryDate?: Date;
	usageLimit?: number;
	usedCount: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	isValid(): boolean; // Helper method
}

const couponSchema = new Schema<ICoupon>(
	{
		_id: { type: String, default: () => generateId() },
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
			index: true,
		},
		description: { type: String },
		discountType: {
			type: String,
			enum: ["percentage", "fixed"],
			required: true,
		},
		discountValue: { type: Number, required: true, min: 0 },
		minPurchase: { type: Number, default: 0, min: 0 },
		maxDiscount: { type: Number, min: 0 }, // For percentage based discounts
		startDate: { type: Date, default: Date.now },
		expiryDate: { type: Date },
		usageLimit: { type: Number, min: 1 }, // Total times coupon can be used
		usedCount: { type: Number, default: 0, min: 0 },
		isActive: { type: Boolean, default: true, index: true },
	},
	{ timestamps: true },
);

// Validation: Expiry date must be after start date
couponSchema.pre("save", function (next) {
	if (this.expiryDate && this.startDate && this.expiryDate < this.startDate) {
		next(new Error("Expiry date must be after start date"));
	} else {
		next();
	}
});

// Instance method to check validity
couponSchema.methods.isValid = function () {
	const now = new Date();
	return (
		this.isActive &&
		(!this.expiryDate || this.expiryDate > now) &&
		(!this.usageLimit || this.usedCount < this.usageLimit) &&
		this.startDate <= now
	);
};

export const Coupon = (mongoose.models.Coupon ||
	mongoose.model<ICoupon>("Coupon", couponSchema)) as mongoose.Model<ICoupon>;
