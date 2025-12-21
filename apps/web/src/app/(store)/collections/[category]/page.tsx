import { notFound } from "next/navigation";
import ProductGrid from "@/components/store/product-grid";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;

	let products: Product[] = [];
	let categoryName = category;

	try {
		const categories = await apiClient.getCategories({ isActive: true });
		const categoryData = categories.find(
			(cat) => cat.slug.toLowerCase() === category.toLowerCase(),
		);

		if (!categoryData) {
			notFound();
		}

		categoryName = categoryData.name;

		const productsResponse = await apiClient.getProducts({
			category: categoryData._id,
			limit: 100,
			page: 1,
		});

		products = productsResponse.data;
	} catch (error) {
		console.error("Failed to fetch category products:", error);
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex flex-col items-center text-center">
				<h1 className="mb-4 font-bold font-serif text-4xl capitalize">
					{categoryName}
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					Discover our exquisite collection of {categoryName}.
				</p>
			</div>
			{products.length > 0 ? (
				<ProductGrid products={products} />
			) : (
				<div className="py-12 text-center text-muted-foreground">
					<p>No products available in this category.</p>
					<p className="mt-2 text-sm">Please check back later.</p>
				</div>
			)}
		</div>
	);
}
