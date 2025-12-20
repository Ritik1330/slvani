import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
