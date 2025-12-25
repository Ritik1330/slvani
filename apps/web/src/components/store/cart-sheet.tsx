"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	useCartQuery,
	useCartSummary,
	useRemoveFromCart,
	useUpdateCart,
} from "@/hooks/use-cart";

export default function CartSheet({
	customTrigger,
}: {
	customTrigger?: React.ReactNode;
}) {
	const { data: cart, isLoading } = useCartQuery();
	const { cartCount, cartTotal } = useCartSummary();
	const removeFromCart = useRemoveFromCart();
	const updateCart = useUpdateCart();
	const [isOpen, setIsOpen] = useState(false);

	const items = cart?.items || [];

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{customTrigger || (
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingBag className="h-5 w-5" />
						{cartCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
								{cartCount}
							</span>
						)}
					</Button>
				)}
			</SheetTrigger>
			<SheetContent className="flex w-full flex-col px-4 sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto py-6">
					{isLoading ? (
						<div className="flex h-full items-center justify-center">
							<p className="text-muted-foreground">Loading cart...</p>
						</div>
					) : items.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
							<ShoppingBag className="h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground">Your cart is empty</p>
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								Continue Shopping
							</Button>
						</div>
					) : (
						<div className="space-y-6">
							{items.map((item) => (
								<div key={item.productId} className="flex gap-4">
									<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-secondary/20">
										{item.coverImage ? (
											<Image
												src={item.coverImage}
												alt={item.title}
												fill
												className="object-cover object-center"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center bg-secondary/20">
												<ShoppingBag className="h-8 w-8 text-muted-foreground" />
											</div>
										)}
									</div>

									<div className="flex flex-1 flex-col">
										<div>
											<div className="flex justify-between font-medium text-base">
												<h3 className="line-clamp-1">
													<Link
														href={`/product/${item.productId}`}
														onClick={() => setIsOpen(false)}
													>
														{item.title}
													</Link>
												</h3>
												<p className="ml-4">
													₹{(item.price * item.quantity).toLocaleString()}
												</p>
											</div>
											<p className="mt-1 text-muted-foreground text-sm capitalize">
												{item.category}
											</p>
										</div>
										<div className="flex flex-1 items-end justify-between text-sm">
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
												<span className="w-8 text-center">{item.quantity}</span>
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
							))}
						</div>
					)}
				</div>

				{items.length > 0 && (
					<SheetFooter className="border-t pt-6">
						<div className="w-full space-y-4">
							<div className="flex justify-between font-medium text-base">
								<p>Subtotal</p>
								<p>₹{cartTotal.toLocaleString()}</p>
							</div>
							<p className="text-muted-foreground text-xs">
								Shipping and taxes calculated at checkout.
							</p>
							<Button className="w-full" size="lg" asChild>
								<Link href="/checkout" onClick={() => setIsOpen(false)}>
									Checkout
								</Link>
							</Button>
						</div>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
