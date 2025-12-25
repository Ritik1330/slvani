"use client";

import { Check, Loader2, MapPin, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddAddressDialog from "@/components/store/add-address-dialog";
import EditAddressDialog from "@/components/store/edit-address-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddressesQuery } from "@/hooks/use-addresses";
import { useCartQuery, useCartSummary, useClearCart } from "@/hooks/use-cart";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

declare global {
	interface Window {
		Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
	}
}

interface RazorpayOptions {
	key: string;
	amount: number;
	currency: string;
	name: string;
	description: string;
	order_id: string;
	handler: (response: RazorpayResponse) => void;
	prefill: { name: string; contact: string };
	theme: { color: string };
}

interface RazorpayInstance {
	open: () => void;
}

interface RazorpayResponse {
	razorpay_order_id: string;
	razorpay_payment_id: string;
	razorpay_signature: string;
}

export default function CheckoutPage() {
	const router = useRouter();
	const { data: cart, isLoading: cartLoading } = useCartQuery();
	const { cartTotal } = useCartSummary();
	const { data: addresses, isLoading: addressesLoading } = useAddressesQuery();
	const clearCart = useClearCart();

	const [selectedAddressId, setSelectedAddressId] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);

	const items = cart?.items || [];
	const isLoading = cartLoading || addressesLoading;

	useEffect(() => {
		if (addresses && addresses.length > 0 && !selectedAddressId) {
			const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
			setSelectedAddressId(defaultAddr._id);
		}
	}, [addresses, selectedAddressId]);

	const loadRazorpayScript = (): Promise<boolean> => {
		return new Promise((resolve) => {
			if (window.Razorpay) {
				resolve(true);
				return;
			}
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	const handleCheckout = async () => {
		if (!selectedAddressId) {
			toast.error("Please select a delivery address");
			return;
		}

		const selectedAddress = addresses?.find((a) => a._id === selectedAddressId);
		if (!selectedAddress) {
			toast.error("Invalid address selected");
			return;
		}

		setIsProcessing(true);

		try {
			const scriptLoaded = await loadRazorpayScript();
			if (!scriptLoaded) {
				throw new Error("Failed to load payment gateway");
			}

			const orderData = {
				items: items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					price: item.price,
					title: item.title,
					image: item.coverImage,
				})),
				subtotal: cartTotal,
				discount: 0,
				total: cartTotal,
				paymentMethod: "card" as const,
				shippingAddress: {
					fullName: selectedAddress.fullName,
					phone: selectedAddress.phone,
					addressLine1: selectedAddress.addressLine1,
					addressLine2: selectedAddress.addressLine2,
					city: selectedAddress.city,
					state: selectedAddress.state,
					pincode: selectedAddress.pincode,
					country: selectedAddress.country,
				},
				billingAddress: {
					fullName: selectedAddress.fullName,
					phone: selectedAddress.phone,
					addressLine1: selectedAddress.addressLine1,
					addressLine2: selectedAddress.addressLine2,
					city: selectedAddress.city,
					state: selectedAddress.state,
					pincode: selectedAddress.pincode,
					country: selectedAddress.country,
				},
			};

			const order = await apiClient.createOrder(orderData);
			const razorpayOrder = await apiClient.createRazorpayOrder(cartTotal);

			const options: RazorpayOptions = {
				key: razorpayOrder.keyId,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				name: "SLVANI",
				description: "Order Payment",
				order_id: razorpayOrder.orderId,
				handler: async (response: RazorpayResponse) => {
					try {
						await apiClient.verifyPayment({
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							orderId: order._id,
						});
						clearCart.mutate();
						toast.success("Payment successful! Order placed.");
						router.push("/");
					} catch {
						toast.error("Payment verification failed");
					}
				},
				prefill: {
					name: selectedAddress.fullName,
					contact: selectedAddress.phone,
				},
				theme: { color: "#000000" },
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Failed to process checkout");
		} finally {
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
				<p className="mt-4 text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<h1 className="mb-4 font-bold font-serif text-3xl">
					Your cart is empty
				</h1>
				<p className="mb-8 text-muted-foreground">
					Add some items to your cart to proceed with checkout.
				</p>
				<Button asChild>
					<Link href="/collections">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="mb-8 text-center font-bold font-serif text-3xl md:text-4xl">
				Checkout
			</h1>

			<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
				<div className="space-y-6">
					<div className="rounded-lg border bg-card p-6 shadow-sm">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Delivery Address</h2>
							<AddAddressDialog
								trigger={
									<Button variant="outline" size="sm">
										<Plus className="mr-2 h-4 w-4" />
										Add New
									</Button>
								}
								onSuccess={(addr) => setSelectedAddressId(addr._id)}
							/>
						</div>

						{addresses && addresses.length > 0 ? (
							<RadioGroup
								value={selectedAddressId}
								onValueChange={setSelectedAddressId}
								className="space-y-3"
							>
								{addresses.map((address) => (
									<div key={address._id} className="relative">
										<label
											htmlFor={address._id}
											className={cn(
												"flex cursor-pointer items-start gap-3 rounded-lg border p-4 pr-12 transition-colors hover:bg-secondary/50",
												selectedAddressId === address._id &&
													"border-primary bg-primary/5",
											)}
										>
											<RadioGroupItem
												value={address._id}
												id={address._id}
												className="mt-1"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{address.fullName}
													</span>
													{address.isDefault && (
														<span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs">
															Default
														</span>
													)}
												</div>
												<p className="mt-1 text-muted-foreground text-sm">
													{address.phone}
												</p>
												<p className="mt-1 text-sm">
													{address.addressLine1}
													{address.addressLine2 && `, ${address.addressLine2}`}
												</p>
												<p className="text-sm">
													{address.city}, {address.state} - {address.pincode}
												</p>
											</div>
										</label>
										<div className="absolute top-2 right-2 flex items-center gap-1">
											{selectedAddressId === address._id && (
												<Check className="h-5 w-5 text-primary" />
											)}
											<EditAddressDialog
												address={address}
												trigger={
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<Pencil className="h-4 w-4" />
													</Button>
												}
											/>
										</div>
									</div>
								))}
							</RadioGroup>
						) : (
							<div className="flex flex-col items-center justify-center py-8 text-center">
								<MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
								<p className="text-muted-foreground">No saved addresses</p>
								<p className="mb-4 text-muted-foreground text-sm">
									Add an address to continue
								</p>
								<AddAddressDialog
									onSuccess={(addr) => setSelectedAddressId(addr._id)}
								/>
							</div>
						)}
					</div>
				</div>

				<div>
					<div className="sticky top-24 rounded-lg border bg-secondary/10 p-6">
						<h2 className="mb-6 font-semibold text-xl">Order Summary</h2>
						<div className="mb-6 space-y-4">
							{items.map((item) => (
								<div key={item.productId} className="flex gap-4">
									<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-secondary/20">
										<Image
											src={item.coverImage}
											alt={item.title}
											fill
											className="object-cover"
										/>
									</div>
									<div className="flex-1">
										<h3 className="line-clamp-1 font-medium text-sm">
											{item.title}
										</h3>
										<p className="text-muted-foreground text-xs">
											Qty: {item.quantity}
										</p>
									</div>
									<p className="font-medium text-sm">
										₹{(item.price * item.quantity).toLocaleString()}
									</p>
								</div>
							))}
						</div>

						<div className="space-y-2 border-t pt-4">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>₹{cartTotal.toLocaleString()}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>Free</span>
							</div>
							<div className="mt-2 flex justify-between border-t pt-2 font-bold text-lg">
								<span>Total</span>
								<span>₹{cartTotal.toLocaleString()}</span>
							</div>
						</div>

						<Button
							className="mt-6 w-full"
							size="lg"
							onClick={handleCheckout}
							disabled={isProcessing || !selectedAddressId}
						>
							{isProcessing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								`Pay ₹${cartTotal.toLocaleString()}`
							)}
						</Button>

						<p className="mt-4 text-center text-muted-foreground text-xs">
							Secured by Razorpay
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
