import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface IAddress {
	_id: string;
	userId: string;
	fullName: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	pincode: string;
	country: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
	{
		_id: { type: String, default: () => generateId() },
		userId: { type: String, required: true, index: true },
		fullName: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true },
		addressLine1: { type: String, required: true, trim: true },
		addressLine2: { type: String, trim: true },
		city: { type: String, required: true, trim: true },
		state: { type: String, required: true, trim: true },
		pincode: { type: String, required: true, trim: true },
		country: { type: String, required: true, default: "India" },
		isDefault: { type: Boolean, default: false, index: true },
	},
	{ timestamps: true },
);

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
	if (this.isDefault && mongoose.models.Address) {
		await mongoose.models.Address.updateMany(
			{ userId: this.userId, _id: { $ne: this._id } },
			{ $set: { isDefault: false } },
		);
	}
	next();
});

export const Address = (mongoose.models.Address ||
	mongoose.model<IAddress>("Address", addressSchema)) as mongoose.Model<IAddress>;
