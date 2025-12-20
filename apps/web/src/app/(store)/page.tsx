import Link from "next/link";
import HeroSection from "@/components/store/hero-section";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";

export default function Home() {
	const featuredProducts = [
		{
			id: "1",
			title: "Ethereal Gold Necklace",
			price: 1250,
			image:
				"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
			category: "Necklaces",
		},
		{
			id: "2",
			title: "Diamond Solitaire Ring",
			price: 3400,
			image:
				"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
			category: "Rings",
		},
		{
			id: "3",
			title: "Pearl Drop Earrings",
			price: 890,
			image:
				"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
			category: "Earrings",
		},
		{
			id: "4",
			title: "Gold Cuff Bracelet",
			price: 1500,
			image:
				"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
			category: "Bracelets",
		},
	];

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
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{featuredProducts.map((product) => (
						<ProductCard key={product.id} {...product} />
					))}
				</div>
				<div className="mt-12 flex justify-center">
					<Button variant="outline" size="lg" asChild>
						<Link href="/collections">View All Products</Link>
					</Button>
				</div>
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
					Join the Luxe Family
				</h2>
				<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
					Sign up for our newsletter to receive exclusive offers, early access
					to new collections, and style tips.
				</p>
			</section>
		</div>
	);
}
