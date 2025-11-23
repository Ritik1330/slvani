import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils/generate-id";

export interface ICategory {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	parentCategory?: string | ICategory; // Changed ObjectId to string
	coverImage?: string;
	order: number;
	isActive: boolean;
	subcategories?: ICategory[];
	createdAt: Date;
	updatedAt: Date;
}

// Category Schema with Self-Reference (Parent-Child)
const categorySchema = new Schema<ICategory>(
	{
		_id: { type: String, default: () => generateId() },
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true, // Explicitly index slug
		},
		description: {
			type: String,
			trim: true,
		},
		// Self-Reference: if parentCategory exists, this is a subcategory
		parentCategory: {
			type: String, // Changed ObjectId to String
			ref: "Category",
			default: null,
			index: true, // Index parentCategory for faster lookups
		},
		// Image/Icon for category
		coverImage: {
			type: String,
			default: null,
		},
		// Order for display
		order: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true, // Index isActive for filtering
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual for getting all subcategories
categorySchema.virtual("subcategories", {
	ref: "Category",
	localField: "_id",
	foreignField: "parentCategory",
});

export const Category = (mongoose.models.Category ||
	mongoose.model<ICategory>("Category", categorySchema)) as mongoose.Model<ICategory>;
