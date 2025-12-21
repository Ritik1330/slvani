"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import type { Product } from "@/types";

interface ProductInfoProps {
	product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
	const addToCart = useAddToCart();
	const router = useRouter();

	const handleAddToCart = () => {
		addToCart.mutate({ productId: product._id, quantity: 1 });
	};

	const handleBuyNow = () => {
		addToCart.mutate(
			{ productId: product._id, quantity: 1 },
			{
				onSuccess: () => {
					router.push("/checkout");
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-bold font-serif text-3xl text-foreground md:text-4xl">
					{product.title}
				</h1>
				<p className="mt-2 font-medium text-primary text-xl">
					₹{product.price.toLocaleString()}
				</p>
			</div>

			<div className="prose prose-neutral dark:prose-invert">
				<p>{product.description}</p>
			</div>

			<div className="flex flex-col gap-4 border-t pt-6">
				<div className="flex w-full gap-4 md:w-auto">
					<Button
						size="lg"
						className="flex-1 md:flex-none"
						onClick={handleAddToCart}
						disabled={addToCart.isPending}
					>
						<ShoppingBag className="mr-2 h-5 w-5" />
						Add to Cart
					</Button>
					<Button
						size="lg"
						variant="secondary"
						className="flex-1 md:flex-none"
						onClick={handleBuyNow}
						disabled={addToCart.isPending}
					>
						Buy Now
					</Button>
				</div>
				<p className="text-center text-muted-foreground text-xs md:text-left">
					Free shipping on all orders over ₹500.
				</p>
			</div>
		</div>
	);
}
