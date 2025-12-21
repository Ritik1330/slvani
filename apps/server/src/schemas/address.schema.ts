import { z } from "zod";

// Schema for creating an address
export const createAddressBodySchema = z.object({
	fullName: z.string().min(1, "Full name is required").trim(),
	phoneNumber: z.string().min(10, "Valid phone number is required"),
	addressLine1: z.string().min(1, "Address line 1 is required").trim(),
	addressLine2: z.string().trim().optional(),
	city: z.string().min(1, "City is required").trim(),
	state: z.string().min(1, "State is required").trim(),
	postalCode: z.string().min(1, "Postal code is required"),
	country: z.string().min(1, "Country is required").trim(),
	isDefault: z.boolean().default(false),
});

// Schema for updating an address
export const updateAddressBodySchema = z.object({
	fullName: z.string().min(1, "Full name is required").trim().optional(),
	phoneNumber: z.string().min(10, "Valid phone number is required").optional(),
	addressLine1: z
		.string()
		.min(1, "Address line 1 is required")
		.trim()
		.optional(),
	addressLine2: z.string().trim().optional(),
	city: z.string().min(1, "City is required").trim().optional(),
	state: z.string().min(1, "State is required").trim().optional(),
	postalCode: z.string().min(1, "Postal code is required").optional(),
	country: z.string().min(1, "Country is required").trim().optional(),
	isDefault: z.boolean().optional(),
});

// Schema for address ID parameter
export const getAddressParamsSchema = z.object({
	id: z.string().min(1, "Address ID is required"),
});
