"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
	const { items, cartTotal, clearCart } = useCart();
	const [isProcessing, setIsProcessing] = useState(false);
	const router = useRouter();

	const handleCheckout = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsProcessing(false);
		clearCart();
		toast.success("Order placed successfully!");
		router.push("/");
	};

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
				<p className="text-muted-foreground mb-8">
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
			<h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">Checkout</h1>

			<div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
				{/* Checkout Form */}
				<div>
					<div className="bg-card border rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
						<form onSubmit={handleCheckout} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input id="firstName" required placeholder="John" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" required placeholder="Doe" />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" required placeholder="john@example.com" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">Address</Label>
								<Input id="address" required placeholder="123 Main St" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="city">City</Label>
									<Input id="city" required placeholder="New York" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="zip">ZIP Code</Label>
									<Input id="zip" required placeholder="10001" />
								</div>
							</div>

							<div className="pt-4">
								<Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
									{isProcessing ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Processing...
										</>
									) : (
										`Pay ₹${cartTotal.toFixed(2)}`
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>

				{/* Order Summary */}
				<div>
					<div className="bg-secondary/10 border rounded-lg p-6 sticky top-24">
						<h2 className="text-xl font-semibold mb-6">Order Summary</h2>
						<div className="space-y-4 mb-6">
							{items.map((item) => (
								<div key={item.id} className="flex gap-4">
									<div className="h-16 w-16 rounded-md border bg-secondary/20 overflow-hidden flex-shrink-0">
										<img
											src={item.image}
											alt={item.title}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
										<p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
									</div>
									<p className="font-medium text-sm">
										₹{(item.price * item.quantity).toFixed(2)}
									</p>
								</div>
							))}
						</div>

						<div className="border-t pt-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>₹{cartTotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>Free</span>
							</div>
							<div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
								<span>Total</span>
								<span>₹{cartTotal.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
