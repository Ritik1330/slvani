"use client";

import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	useCartQuery,
	useCartSummary,
	useRemoveFromCart,
	useUpdateCart,
} from "@/hooks/use-cart";

export default function MyCartPage() {
	const { data: cart, isLoading } = useCartQuery();
	const { cartCount, cartTotal } = useCartSummary();
	const removeFromCart = useRemoveFromCart();
	const updateCart = useUpdateCart();

	const items = cart?.items || [];

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
				<p className="mt-4 text-muted-foreground">Loading cart...</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
				<h1 className="mb-4 font-bold font-serif text-3xl">
					Your cart is empty
				</h1>
				<p className="mb-8 text-muted-foreground">
					Add some items to your cart to see them here.
				</p>
				<Button asChild>
					<Link href="/collections">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="mb-8 font-bold font-serif text-3xl md:text-4xl">
				Shopping Cart ({cartCount})
			</h1>

			<div className="grid gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<div className="space-y-4">
						{items.map((item) => (
							<Card key={item.productId}>
								<CardContent className="p-4">
									<div className="flex gap-4">
										<Link
											href={`/product/${item.productId}`}
											className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-secondary/20"
										>
											<Image
												src={item.coverImage}
												alt={item.title}
												fill
												className="object-cover"
											/>
										</Link>

										<div className="flex flex-1 flex-col">
											<div className="flex justify-between">
												<div className="flex-1">
													<Link
														href={`/product/${item.productId}`}
														className="font-medium hover:underline"
													>
														{item.title}
													</Link>
													<p className="mt-1 text-muted-foreground text-sm capitalize">
														{item.category}
													</p>
												</div>
												<p className="font-semibold">
													₹{(item.price * item.quantity).toLocaleString()}
												</p>
											</div>

											<div className="mt-auto flex items-center justify-between">
												<div className="flex items-center rounded-md border">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 rounded-none"
														onClick={() =>
															updateCart.mutate({
																productId: item.productId,
																quantity: item.quantity - 1,
															})
														}
														disabled={updateCart.isPending}
													>
														<Minus className="h-3 w-3" />
													</Button>
													<span className="w-12 text-center">
														{item.quantity}
													</span>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 rounded-none"
														onClick={() =>
															updateCart.mutate({
																productId: item.productId,
																quantity: item.quantity + 1,
															})
														}
														disabled={updateCart.isPending}
													>
														<Plus className="h-3 w-3" />
													</Button>
												</div>

												<Button
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive"
													onClick={() => removeFromCart.mutate(item.productId)}
													disabled={removeFromCart.isPending}
												>
													<Trash2 className="mr-1 h-4 w-4" />
													Remove
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="lg:col-span-1">
					<Card className="sticky top-24">
						<CardContent className="p-6">
							<h2 className="mb-4 font-semibold text-xl">Order Summary</h2>

							<div className="space-y-2">
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

							<Button className="mt-6 w-full" size="lg" asChild>
								<Link href="/checkout">Proceed to Checkout</Link>
							</Button>

							<Button variant="outline" className="mt-2 w-full" asChild>
								<Link href="/collections">Continue Shopping</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
