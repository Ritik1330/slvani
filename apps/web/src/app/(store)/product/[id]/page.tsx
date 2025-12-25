import { notFound } from "next/navigation";
import ProductGallery from "@/components/store/product-gallery";
import ProductInfo from "@/components/store/product-info";
import { apiClient } from "@/lib/api-client";

import type { Product } from "@/types";

export default async function ProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let product: Product;

	try {
		product = await apiClient.getProduct(id);
	} catch (error) {
		console.error("Failed to fetch product:", error);
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
				<ProductGallery product={product} />
				<ProductInfo product={product} />
			</div>
		</div>
	);
}
