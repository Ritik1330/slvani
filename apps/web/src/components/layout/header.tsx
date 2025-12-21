"use client";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import CartSheet from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/collections", label: "Collections" },
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
	] as const;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Mobile Menu Button */}
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
				</Button>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-6 font-medium text-sm md:flex">
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
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<Link
						href="/"
						className="font-bold font-serif text-2xl tracking-wide"
					>
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
