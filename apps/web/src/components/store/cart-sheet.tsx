"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartSheet() {
	const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<ShoppingBag className="h-5 w-5" />
					{cartCount > 0 && (
						<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
							{cartCount}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto py-6">
					{items.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
							<ShoppingBag className="h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground">Your cart is empty</p>
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								Continue Shopping
							</Button>
						</div>
					) : (
						<div className="space-y-6">
							{items.map((item) => (
								<div key={item.id} className="flex gap-4">
									<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-secondary/20">
										<img
											src={item.image}
											alt={item.title}
											className="h-full w-full object-cover object-center"
										/>
									</div>

									<div className="flex flex-1 flex-col">
										<div>
											<div className="flex justify-between text-base font-medium">
												<h3 className="line-clamp-1">
													<Link
														href={`/product/${item.id}`}
														onClick={() => setIsOpen(false)}
													>
														{item.title}
													</Link>
												</h3>
												<p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
											</div>
											<p className="mt-1 text-sm text-muted-foreground capitalize">
												{item.category}
											</p>
										</div>
										<div className="flex flex-1 items-end justify-between text-sm">
											<div className="flex items-center border rounded-md">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 rounded-none"
													onClick={() => updateQuantity(item.id, item.quantity - 1)}
												>
													<Minus className="h-3 w-3" />
												</Button>
												<span className="w-8 text-center">{item.quantity}</span>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 rounded-none"
													onClick={() => updateQuantity(item.id, item.quantity + 1)}
												>
													<Plus className="h-3 w-3" />
												</Button>
											</div>

											<Button
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() => removeItem(item.id)}
											>
												<Trash2 className="h-4 w-4 mr-1" />
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
							<div className="flex justify-between text-base font-medium">
								<p>Subtotal</p>
								<p>₹{cartTotal.toFixed(2)}</p>
							</div>
							<p className="text-xs text-muted-foreground">
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
