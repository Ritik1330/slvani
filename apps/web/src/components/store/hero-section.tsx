import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative h-[80vh] w-full overflow-hidden bg-neutral-100">
			{/* Background Image Placeholder - In a real app, use next/image */}
			<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop')] bg-center bg-cover" />

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/30" />

			{/* Content */}
			<div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
				<h1 className="fade-in slide-in-from-bottom-4 mb-6 animate-in font-bold font-serif text-5xl duration-1000 md:text-7xl">
					Timeless Elegance
				</h1>
				<p className="fade-in slide-in-from-bottom-4 mb-8 max-w-2xl animate-in text-lg text-white/90 delay-200 duration-1000 md:text-xl">
					Discover our exclusive collection of handcrafted jewelry, designed to
					illuminate your unique beauty.
				</p>
				<div className="fade-in slide-in-from-bottom-4 flex animate-in gap-4 delay-300 duration-1000">
					<Button
						size="lg"
						className="bg-white text-black hover:bg-white/90"
						asChild
					>
						<Link href="/collections">Shop Collection</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-white bg-transparent text-white hover:bg-white hover:text-black"
						asChild
					>
						<Link href="/about">Our Story</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
