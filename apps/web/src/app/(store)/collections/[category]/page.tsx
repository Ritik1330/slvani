import ProductGrid from "@/components/store/product-grid";
import { products } from "@/lib/data";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;

	// Filter products by category (case-insensitive)
	const categoryProducts = products.filter(
		(p) => p.category.toLowerCase() === category.toLowerCase(),
	);

	if (categoryProducts.length === 0) {
		// Optional: You might want to show an empty state instead of 404
		// But for now, if the category doesn't exist in our data, we can show empty or 404.
		// Let's show the grid (which handles empty state) but with a proper title.
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex flex-col items-center text-center">
				<h1 className="mb-4 font-bold font-serif text-4xl capitalize">
					{category}
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					Discover our exquisite collection of {category}.
				</p>
			</div>
			<ProductGrid products={categoryProducts} />
		</div>
	);
}
