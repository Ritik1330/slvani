import { notFound } from "next/navigation";
import ProductGallery from "@/components/store/product-gallery";
import ProductInfo from "@/components/store/product-info";
import { products } from "@/lib/data";

export default async function ProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const product = products.find((p) => p.id === id);

	if (!product) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
				<ProductGallery image={product.image} title={product.title} />
				<ProductInfo product={product} />
			</div>
		</div>
	);
}
