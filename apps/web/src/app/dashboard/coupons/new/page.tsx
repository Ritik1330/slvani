"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCoupon } from "@/hooks/use-coupons";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	code: z
		.string()
		.min(3, "Code must be at least 3 characters.")
		.max(20, "Code must be at most 20 characters.")
		.regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only."),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters.")
		.max(200, "Description must be at most 200 characters.")
		.optional()
		.or(z.literal("")),
	discountType: z.enum(["percentage", "fixed"]),
	discountValue: z.number().min(1, "Discount value must be at least 1."),
	minPurchase: z.number().min(0, "Minimum purchase must be 0 or greater."),
	maxDiscount: z
		.number()
		.min(1, "Max discount must be at least 1.")
		.optional()
		.or(z.literal(0)),
	startDate: z.date(),
	expiryDate: z.date().optional(),
	usageLimit: z
		.number()
		.min(1, "Usage limit must be at least 1.")
		.optional()
		.or(z.literal(0)),
	isActive: z.boolean(),
});

export default function NewCouponPage() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
			description: "",
			discountType: "percentage",
			discountValue: 10,
			minPurchase: 0,
			maxDiscount: 0,
			startDate: new Date(),
			expiryDate: undefined,
			usageLimit: 0,
			isActive: true,
		},
	});

	const createMutation = useCreateCoupon();

	function onSubmit(data: z.infer<typeof formSchema>) {
		createMutation.mutate(
			{
				code: data.code,
				description: data.description || undefined,
				discountType: data.discountType,
				discountValue: data.discountValue,
				minPurchase: data.minPurchase,
				maxDiscount: data.maxDiscount || undefined,
				startDate: data.startDate.toISOString(),
				expiryDate: data.expiryDate?.toISOString(),
				usageLimit: data.usageLimit || undefined,
				isActive: data.isActive,
			},
			{
				onSuccess: () => {
					router.push("/dashboard/coupons");
				},
			},
		);
	}

	const discountType = form.watch("discountType");

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div>
				<h2 className="font-bold text-xl tracking-tight md:text-2xl">
					Create Coupon
				</h2>
				<p className="text-muted-foreground text-sm">
					Add a new discount coupon for customers
				</p>
			</div>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Coupon Details</CardTitle>
					<CardDescription>
						Fill in the information below to create a new coupon.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="coupon-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="code"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="coupon-code">Coupon Code</FieldLabel>
										<Input
											{...field}
											id="coupon-code"
											aria-invalid={fieldState.invalid}
											placeholder="SAVE20"
											autoComplete="off"
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
										/>
										<FieldDescription>
											Uppercase letters and numbers only (e.g., SAVE20,
											WELCOME10)
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="description"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="coupon-description">
											Description
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												{...field}
												id="coupon-description"
												placeholder="A brief description of this coupon..."
												rows={3}
												className="min-h-20 resize-none"
												aria-invalid={fieldState.invalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.value?.length || 0}/200 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<div className="grid gap-4 md:grid-cols-2">
								<Controller
									name="discountType"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="discount-type">
												Discount Type
											</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger id="discount-type">
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="percentage">Percentage</SelectItem>
													<SelectItem value="fixed">Fixed Amount</SelectItem>
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="discountValue"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="discount-value">
												Discount Value
											</FieldLabel>
											<Input
												{...field}
												id="discount-value"
												type="number"
												aria-invalid={fieldState.invalid}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											<FieldDescription>
												{discountType === "percentage"
													? "Percentage off (e.g., 20 for 20%)"
													: "Fixed amount off (e.g., 100 for ₹100)"}
											</FieldDescription>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<Controller
									name="minPurchase"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="min-purchase">
												Minimum Purchase (₹)
											</FieldLabel>
											<Input
												{...field}
												id="min-purchase"
												type="number"
												aria-invalid={fieldState.invalid}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											<FieldDescription>
												Minimum cart value required
											</FieldDescription>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								{discountType === "percentage" && (
									<Controller
										name="maxDiscount"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="max-discount">
													Max Discount (₹)
												</FieldLabel>
												<Input
													{...field}
													id="max-discount"
													type="number"
													aria-invalid={fieldState.invalid}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
												<FieldDescription>
													Maximum discount amount (optional)
												</FieldDescription>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
								)}
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<Controller
									name="startDate"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="start-date">Start Date</FieldLabel>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className={cn(
															"w-full justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														captionLayout="dropdown"
														fromYear={new Date().getFullYear()}
														toYear={new Date().getFullYear() + 10}
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
													/>
												</PopoverContent>
											</Popover>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="expiryDate"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="expiry-date">
												Expiry Date (Optional)
											</FieldLabel>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className={cn(
															"w-full justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														captionLayout="dropdown"
														fromYear={new Date().getFullYear()}
														toYear={new Date().getFullYear() + 10}
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
													/>
												</PopoverContent>
											</Popover>
											<FieldDescription>
												Leave empty for no expiry
											</FieldDescription>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<Controller
								name="usageLimit"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="usage-limit">
											Usage Limit (Optional)
										</FieldLabel>
										<Input
											{...field}
											id="usage-limit"
											type="number"
											aria-invalid={fieldState.invalid}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
										<FieldDescription>
											Total number of times this coupon can be used (0 for
											unlimited)
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Field orientation="horizontal">
										<div className="space-y-0.5">
											<FieldLabel htmlFor="coupon-active">
												Active Status
											</FieldLabel>
											<FieldDescription>
												Inactive coupons cannot be used by customers.
											</FieldDescription>
										</div>
										<Switch
											id="coupon-active"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/dashboard/coupons")}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							form="coupon-form"
							disabled={createMutation.isPending}
						>
							{createMutation.isPending ? "Creating..." : "Create Coupon"}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
