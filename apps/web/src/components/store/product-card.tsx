import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
	id: string;
	title: string;
	price: number;
	image: string;
	category: string;
}

export default function ProductCard({
	id,
	title,
	price,
	image,
	category,
}: ProductCardProps) {
	return (
		<Card className="group overflow-hidden border-none bg-transparent shadow-none">
			<CardContent className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-secondary/20 p-0">
				<img
					src={image}
					alt={title}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<Button size="icon" className="rounded-full shadow-lg">
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
				<p className="font-semibold text-sm">₹{price.toFixed(2)}</p>
			</CardFooter>
		</Card>
	);
}
