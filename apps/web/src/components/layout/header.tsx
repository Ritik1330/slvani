"use client";
import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import CartSheet from "@/components/store/cart-sheet";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/collections", label: "Collections" },
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
	] as const;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				{/* Mobile Menu Button */}
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
				</Button>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6 text-sm font-medium">
					{links.map(({ to, label }) => (
						<Link
							key={to}
							href={to}
							className="transition-colors hover:text-primary"
						>
							{label}
						</Link>
					))}
				</nav>

				{/* Logo */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<Link href="/" className="font-serif text-2xl font-bold tracking-wide">
						LUXE JEWELRY
					</Link>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" className="hidden sm:flex">
						<Search className="h-5 w-5" />
					</Button>
					<UserMenu />
					<CartSheet />
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
