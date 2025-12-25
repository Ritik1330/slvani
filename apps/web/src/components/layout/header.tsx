import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CartSheet from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default async function Header() {
	let categories: Category[] = [];

	try {
		categories = await apiClient.getCategories({ isActive: true });
	} catch (error) {
		console.error("Failed to fetch categories:", error);
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Mobile Menu Sheet - Moved to BottomNav */}
				{/* <MobileMenuSheet categories={categories} /> */}

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-6 font-medium text-sm md:flex">
					{categories.map((category) => (
						<Link
							key={category._id}
							href={`/collections?category=${category.slug}`}
							className="capitalize transition-colors hover:text-primary"
						>
							{category.name}
						</Link>
					))}
				</nav>

				{/* Logo */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<Link href="/">
						<Image
							src="/logo.png"
							alt="SLVANI"
							width={120}
							height={40}
							className="h-8 w-auto object-contain"
							priority
						/>
					</Link>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" className="hidden sm:flex">
						<Search className="h-5 w-5" />
					</Button>
					<div className="hidden md:block">
						<UserMenu />
					</div>
					<div className="hidden md:block">
						<CartSheet />
					</div>
					<div className="hidden md:block">
						<ModeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
