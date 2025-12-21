import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
	return (
		<footer className="border-t bg-secondary/30">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<h3 className="font-bold font-serif text-xl">SLVANI</h3>
						<p className="text-muted-foreground text-sm">
							Crafting timeless elegance for the modern soul.
						</p>
						<div className="flex gap-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Instagram className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Facebook className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Twitter className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* Shop */}
					<div>
						<h4 className="mb-4 font-medium">Shop</h4>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li>
								<Link
									href="/collections/necklaces"
									className="hover:text-primary"
								>
									Necklaces
								</Link>
							</li>
							<li>
								<Link
									href="/collections/earrings"
									className="hover:text-primary"
								>
									Earrings
								</Link>
							</li>
							<li>
								<Link href="/collections/rings" className="hover:text-primary">
									Rings
								</Link>
							</li>
							<li>
								<Link
									href="/collections/bracelets"
									className="hover:text-primary"
								>
									Bracelets
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="mb-4 font-medium">Support</h4>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li>
								<Link href="/contact" className="hover:text-primary">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href="/faq" className="hover:text-primary">
									FAQs
								</Link>
							</li>
							<li>
								<Link href="/shipping" className="hover:text-primary">
									Shipping & Returns
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h4 className="mb-4 font-medium">Newsletter</h4>
						<p className="mb-4 text-muted-foreground text-sm">
							Subscribe to receive updates, access to exclusive deals, and more.
						</p>
						<div className="flex gap-2">
							<Input placeholder="Enter your email" className="bg-background" />
							<Button>Subscribe</Button>
						</div>
					</div>
				</div>
				<div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
					© {new Date().getFullYear()} Slvani. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
