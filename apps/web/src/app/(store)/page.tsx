import Link from "next/link";
import HeroSection from "@/components/store/hero-section";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types";

export default async function Home() {
	let products: Product[] = [];

	try {
		const productsResponse = await apiClient.getProducts({
			limit: 4,
			page: 1,
			isActive: true,
		});
		products = productsResponse.data;
	} catch (error) {
		console.error("Failed to fetch products:", error);
	}

	return (
		<div className="flex flex-col gap-16 pb-16">
			<HeroSection />

			{/* Featured Collection */}
			<section className="container mx-auto px-4">
				<div className="mb-12 flex flex-col items-center text-center">
					<h2 className="mb-4 font-bold font-serif text-3xl md:text-4xl">
						Featured Collection
					</h2>
					<p className="max-w-2xl text-muted-foreground">
						Handpicked favorites that embody luxury and sophistication.
					</p>
				</div>

				{products.length > 0 ? (
					<>
						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
							{products.map((product) => (
								<ProductCard
									key={product._id}
									id={product._id}
									title={product.title}
									price={product.price}
									coverImage={
										typeof product.coverImage === "string"
											? product.coverImage
											: product.coverImage?.url || ""
									}
									category={
										typeof product.category === "string"
											? product.category
											: product.category.name
									}
								/>
							))}
						</div>
						<div className="mt-12 flex justify-center">
							<Button variant="outline" size="lg" asChild>
								<Link href="/collections">View All Products</Link>
							</Button>
						</div>
					</>
				) : (
					<div className="py-12 text-center text-muted-foreground">
						<p>No products available at the moment.</p>
						<p className="mt-2 text-sm">Please check back later.</p>
					</div>
				)}
			</section>

			{/* Brand Story / Banner */}
			<section className="bg-primary/5 py-20">
				<div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
					<div className="order-2 md:order-1">
						<img
							src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1982&auto=format&fit=crop"
							alt="Craftsmanship"
							className="rounded-lg shadow-xl"
						/>
					</div>
					<div className="order-1 space-y-6 md:order-2">
						<h2 className="font-bold font-serif text-3xl md:text-4xl">
							The Art of Jewelry Making
						</h2>
						<p className="text-lg text-muted-foreground">
							Every piece in our collection is a testament to the skill and
							passion of our master artisans. We believe that jewelry is more
							than just an accessory; it's a form of expression, a memory, and a
							legacy to be passed down.
						</p>
						<Button asChild>
							<Link href="/about">Read Our Story</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Newsletter / CTA */}
			<section className="container mx-auto px-4 py-12 text-center">
				<h2 className="mb-6 font-bold font-serif text-3xl">
					Join the Slvani Family
				</h2>
				<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
					Sign up for our newsletter to receive exclusive offers, early access
					to new collections, and style tips.
				</p>
			</section>
		</div>
	);
}
