"use client";

import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartSheet from "@/components/store/cart-sheet";
import { useCartSummary } from "@/hooks/use-cart";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types";
import MobileMenuSheet from "./mobile-menu-sheet";
import UserMenu from "./user-menu";

export default function BottomNav() {
	const { cartCount } = useCartSummary();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		apiClient.getCategories({ isActive: true }).then(setCategories);
	}, []);

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 pb-safe md:hidden">
			{/* Home */}
			<Link
				href="/"
				className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
			>
				<Home className="h-5 w-5" />
				<span className="font-medium text-[10px]">Home</span>
			</Link>

			{/* Categories */}
			<MobileMenuSheet
				categories={categories}
				customTrigger={
					<button
						type="button"
						className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
					>
						<LayoutGrid className="h-5 w-5" />
						<span className="font-medium text-[10px]">Shop</span>
					</button>
				}
			/>

			{/* Cart */}
			<CartSheet
				customTrigger={
					<button
						type="button"
						className="relative flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
					>
						<div className="relative">
							<ShoppingBag className="h-5 w-5" />
							{cartCount > 0 && (
								<span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
									{cartCount}
								</span>
							)}
						</div>
						<span className="font-medium text-[10px]">Cart</span>
					</button>
				}
			/>

			{/* Profile */}
			<UserMenu
				customTrigger={
					<div className="flex cursor-pointer flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
						<User className="h-5 w-5" />
						<span className="font-medium text-[10px]">Account</span>
					</div>
				}
			/>
		</div>
	);
}
