import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "../index.css";
import Providers from "@/components/common/providers";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Luxe Jewelry",
	description: "Premium Jewelry Collection",
};



// ... imports

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased font-sans`}
			>
				<Providers>
					<CartProvider>
						{children}
					</CartProvider>
				</Providers>
			</body>
		</html>
	);
}
