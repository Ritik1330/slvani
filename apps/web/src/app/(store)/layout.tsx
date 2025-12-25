import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-screen grid-rows-[auto_1fr_auto] pb-16 md:pb-0">
			<Header />
			<main>{children}</main>
			<Footer />
			<BottomNav />
		</div>
	);
}
