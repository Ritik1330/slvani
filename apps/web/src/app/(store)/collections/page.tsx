import ProductGrid from "@/components/store/product-grid";
import { products } from "@/lib/data";

export default function CollectionsPage() {
	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex flex-col items-center text-center">
				<h1 className="mb-4 font-bold font-serif text-4xl">All Collections</h1>
				<p className="max-w-2xl text-muted-foreground">
					Explore our complete range of handcrafted jewelry, from timeless
					classics to modern statements.
				</p>
			</div>
			<ProductGrid products={products} />
		</div>
	);
}
