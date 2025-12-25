"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/types";
import { ModeToggle } from "./mode-toggle";

interface MobileMenuSheetProps {
	categories: Category[];
	customTrigger?: React.ReactNode;
}

export default function MobileMenuSheet({
	categories,
	customTrigger,
}: MobileMenuSheetProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{customTrigger || (
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>
				)}
			</SheetTrigger>
			<SheetContent
				side="left"
				className="flex w-[280px] flex-col gap-0 sm:w-[350px]"
			>
				<SheetHeader className="px-1 py-1">
					<SheetTitle className="sr-only">Mobile Menu</SheetTitle>
					<Link
						href="/"
						className="flex items-center gap-2"
						onClick={() => setIsOpen(false)}
					>
						<Image
							src="/logo.png"
							alt="SLVANI"
							width={120}
							height={40}
							className="h-8 w-auto object-contain"
						/>
					</Link>
				</SheetHeader>

				<Separator className="my-0" />

				<div className="flex-1 overflow-y-auto px-1 pt-2">
					<h3 className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Categories
					</h3>
					<nav className="flex flex-col space-y-1">
						{categories.length > 0 ? (
							categories.map((category) => (
								<Link
									key={category._id}
									href={`/collections?category=${category.slug}`}
									className="group flex items-center justify-between rounded-md p-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
									onClick={() => setIsOpen(false)}
								>
									<span className="capitalize">{category.name}</span>
								</Link>
							))
						) : (
							<p className="p-2 text-muted-foreground text-sm">
								No categories available
							</p>
						)}
					</nav>
				</div>

				<Separator className="my-4" />

				<SheetFooter className="px-1 text-left sm:justify-start">
					<div className="flex w-full flex-col gap-4">
						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">Theme</span>
							<ModeToggle />
						</div>
						<p className="text-muted-foreground text-xs">
							© 2024 Slvani. All rights reserved.
						</p>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
