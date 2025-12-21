import ProductGrid from "@/components/store/product-grid";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types";

export default async function CollectionsPage() {
	let products: Product[] = [];

	try {
		const productsResponse = await apiClient.getProducts({
			limit: 100,
			page: 1,
		});
		products = productsResponse.data;
	} catch (error) {
		console.error("Failed to fetch products:", error);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex flex-col items-center text-center">
				<h1 className="mb-4 font-bold font-serif text-4xl">All Collections</h1>
				<p className="max-w-2xl text-muted-foreground">
					Explore our complete range of handcrafted jewelry, from timeless
					classics to modern statements.
				</p>
			</div>
			{products.length > 0 ? (
				<ProductGrid products={products} />
			) : (
				<div className="py-12 text-center text-muted-foreground">
					<p>No products available at the moment.</p>
					<p className="mt-2 text-sm">Please check back later.</p>
				</div>
			)}
		</div>
	);
}
