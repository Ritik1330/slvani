"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";

interface ProductInfoProps {
	product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
	const { addItem } = useCart();

	const handleAddToCart = () => {
		addItem(product);
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
					{product.title}
				</h1>
				<p className="mt-2 text-xl font-medium text-primary">
					₹{product.price.toFixed(2)}
				</p>
			</div>

			<div className="prose prose-neutral dark:prose-invert">
				<p>{product.description}</p>
			</div>

			<div className="flex flex-col gap-4 pt-6 border-t">
				<Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
					<ShoppingBag className="mr-2 h-5 w-5" />
					Add to Cart
				</Button>
				<p className="text-xs text-muted-foreground text-center md:text-left">
					Free shipping on all orders over $500.
				</p>
			</div>
		</div>
	);
}
