import ProductCard from "@/components/store/product-card";
import type { Product } from "@/lib/data";

interface ProductGridProps {
	products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
	if (products.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">
					No products found in this collection.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} {...product} />
			))}
		</div>
	);
}
