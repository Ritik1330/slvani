"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, State } from "country-state-city";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateAddress } from "@/hooks/use-addresses";

const addressSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	addressLine1: z.string().min(1, "Address is required"),
	addressLine2: z.string().optional().or(z.literal("")),
	state: z.string().min(1, "State is required"),
	city: z.string().min(1, "City is required"),
	pincode: z
		.string()
		.min(6, "Pincode must be 6 digits")
		.max(6, "Pincode must be 6 digits"),
	country: z.string(),
	isDefault: z.boolean(),
});

interface AddAddressDialogProps {
	trigger?: React.ReactNode;
	onSuccess?: (address: { _id: string }) => void;
}

export default function AddAddressDialog({
	trigger,
	onSuccess,
}: AddAddressDialogProps) {
	const createAddress = useCreateAddress();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedStateCode, setSelectedStateCode] = useState("");

	const form = useForm<z.infer<typeof addressSchema>>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			fullName: "",
			phone: "",
			addressLine1: "",
			addressLine2: "",
			state: "",
			city: "",
			pincode: "",
			country: "India",
			isDefault: false,
		},
	});

	// Get all Indian states
	const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);

	// Get cities based on selected state
	const cities = useMemo(() => {
		if (!selectedStateCode) return [];
		return City.getCitiesOfState("IN", selectedStateCode);
	}, [selectedStateCode]);

	const handleStateChange = (stateCode: string) => {
		const state = indianStates.find((s) => s.isoCode === stateCode);
		setSelectedStateCode(stateCode);
		form.setValue("state", state?.name || "");
		form.setValue("city", ""); // Reset city when state changes
	};

	const onSubmit = (data: z.infer<typeof addressSchema>) => {
		createAddress.mutate(data, {
			onSuccess: (addr) => {
				setIsOpen(false);
				form.reset();
				setSelectedStateCode("");
				onSuccess?.(addr);
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add New Address
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Address</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="fullName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="fullName">Full Name</FieldLabel>
									<Input
										{...field}
										id="fullName"
										placeholder="Enter full name"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error?.message && (
										<FieldError
											errors={[{ message: fieldState.error.message }]}
										/>
									)}
								</Field>
							)}
						/>

						<Controller
							name="phone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="phone">Phone Number</FieldLabel>
									<Input
										{...field}
										id="phone"
										placeholder="Enter phone number"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error?.message && (
										<FieldError
											errors={[{ message: fieldState.error.message }]}
										/>
									)}
								</Field>
							)}
						/>

						<Controller
							name="addressLine1"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="addressLine1">Address Line 1</FieldLabel>
									<Input
										{...field}
										id="addressLine1"
										placeholder="House no., Building, Street"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error?.message && (
										<FieldError
											errors={[{ message: fieldState.error.message }]}
										/>
									)}
								</Field>
							)}
						/>

						<Controller
							name="addressLine2"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="addressLine2">
										Address Line 2 (Optional)
									</FieldLabel>
									<Input
										{...field}
										id="addressLine2"
										placeholder="Area, Landmark"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error?.message && (
										<FieldError
											errors={[{ message: fieldState.error.message }]}
										/>
									)}
								</Field>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="state"
								control={form.control}
								render={({ fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="state">State</FieldLabel>
										<Select
											value={selectedStateCode}
											onValueChange={handleStateChange}
										>
											<SelectTrigger id="state">
												<SelectValue placeholder="Select state" />
											</SelectTrigger>
											<SelectContent className="max-h-60">
												{indianStates.map((state) => (
													<SelectItem key={state.isoCode} value={state.isoCode}>
														{state.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error?.message && (
											<FieldError
												errors={[{ message: fieldState.error.message }]}
											/>
										)}
									</Field>
								)}
							/>

							<Controller
								name="city"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="city">City</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={!selectedStateCode}
										>
											<SelectTrigger id="city">
												<SelectValue placeholder="Select city" />
											</SelectTrigger>
											<SelectContent className="max-h-60">
												{cities.map((city) => (
													<SelectItem key={city.name} value={city.name}>
														{city.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error?.message && (
											<FieldError
												errors={[{ message: fieldState.error.message }]}
											/>
										)}
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="pincode"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="pincode">Pincode</FieldLabel>
										<Input
											{...field}
											id="pincode"
											placeholder="6 digit pincode"
											maxLength={6}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.error?.message && (
											<FieldError
												errors={[{ message: fieldState.error.message }]}
											/>
										)}
									</Field>
								)}
							/>

							<Field>
								<FieldLabel htmlFor="country">Country</FieldLabel>
								<Input
									id="country"
									value="India"
									disabled
									className="bg-muted"
								/>
							</Field>
						</div>

						<Controller
							name="isDefault"
							control={form.control}
							render={({ field }) => (
								<Field orientation="horizontal">
									<div className="space-y-0.5">
										<FieldLabel htmlFor="isDefault">Default Address</FieldLabel>
										<FieldDescription>
											Set this as your default delivery address
										</FieldDescription>
									</div>
									<Checkbox
										id="isDefault"
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</Field>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={createAddress.isPending}
						>
							{createAddress.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Adding...
								</>
							) : (
								"Add Address"
							)}
						</Button>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
