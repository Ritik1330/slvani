"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAddToCart } from "@/hooks/use-cart";

interface ProductCardProps {
	id: string;
	title: string;
	price: number;
	coverImage: string;
	category: string;
}

export default function ProductCard({
	id,
	title,
	price,
	coverImage,
	category,
}: ProductCardProps) {
	const addToCart = useAddToCart();

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent navigation to product page
		addToCart.mutate({ productId: id, quantity: 1 });
	};

	return (
		<Card className="group overflow-hidden border-none bg-transparent shadow-none">
			<CardContent className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-secondary/20 p-0">
				<Link href={`/product/${id}`}>
					<Image
						src={coverImage}
						alt={title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</Link>
				<div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<Button
						size="icon"
						className="rounded-full shadow-lg"
						onClick={handleAddToCart}
						disabled={addToCart.isPending}
					>
						<ShoppingBag className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col items-start gap-1 p-0">
				<p className="text-muted-foreground text-xs uppercase tracking-wider">
					{category}
				</p>
				<Link href={`/product/${id}`} className="font-medium hover:underline">
					{title}
				</Link>
				<p className="font-semibold text-sm">₹{price.toLocaleString()}</p>
			</CardFooter>
		</Card>
	);
}
