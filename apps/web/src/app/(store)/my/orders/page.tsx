"use client";

import { Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserOrdersQuery } from "@/hooks/use-orders";

const statusColors = {
	pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	confirmed: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
	processing: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
	shipped: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
	delivered: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function MyOrdersPage() {
	const { data: orders, isLoading } = useUserOrdersQuery();

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
				<p className="mt-4 text-muted-foreground">Loading orders...</p>
			</div>
		);
	}

	if (!orders || orders.length === 0) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
				<h1 className="mb-4 font-bold font-serif text-3xl">No orders yet</h1>
				<p className="mb-8 text-muted-foreground">
					Start shopping to see your orders here.
				</p>
				<Button asChild>
					<Link href="/collections">Start Shopping</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="mb-8 font-bold font-serif text-3xl md:text-4xl">
				My Orders
			</h1>

			<div className="space-y-4">
				{orders.map((order) => (
					<Card key={order._id}>
						<CardHeader className="border-b bg-secondary/10 p-4">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm">
										Order ID: <span className="font-mono">{order._id}</span>
									</p>
									<p className="text-muted-foreground text-sm">
										Placed on{" "}
										{new Date(order.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className={statusColors[order.status]}
									>
										{order.status.charAt(0).toUpperCase() +
											order.status.slice(1)}
									</Badge>
									<p className="font-semibold">
										₹{order.total.toLocaleString()}
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<div className="space-y-4">
								{order.items.map((item) => (
									<div key={item.productId} className="flex gap-4">
										<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary/20">
											<Image
												src={item.image}
												alt={item.title}
												fill
												className="object-cover"
											/>
										</div>
										<div className="flex-1">
											<p className="font-medium">{item.title}</p>
											<p className="text-muted-foreground text-sm">
												Qty: {item.quantity} × ₹{item.price.toLocaleString()}
											</p>
										</div>
										<p className="font-medium">
											₹{(item.price * item.quantity).toLocaleString()}
										</p>
									</div>
								))}
							</div>

							<div className="mt-4 flex justify-between border-t pt-4">
								<div className="text-sm">
									<p className="text-muted-foreground">Delivery Address</p>
									<p className="font-medium">
										{order.shippingAddress.fullName}
									</p>
									<p className="text-muted-foreground">
										{order.shippingAddress.addressLine1}
										{order.shippingAddress.addressLine2 &&
											`, ${order.shippingAddress.addressLine2}`}
									</p>
									<p className="text-muted-foreground">
										{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
										- {order.shippingAddress.pincode}
									</p>
								</div>
								<div className="text-right">
									<p className="text-muted-foreground text-sm">
										Payment Method
									</p>
									<p className="font-medium uppercase">{order.paymentMethod}</p>
									<p className="mt-2 text-muted-foreground text-sm">
										Payment Status
									</p>
									<Badge
										variant="outline"
										className={
											order.paymentStatus === "paid"
												? "bg-green-500/10 text-green-500"
												: "bg-yellow-500/10 text-yellow-500"
										}
									>
										{order.paymentStatus.charAt(0).toUpperCase() +
											order.paymentStatus.slice(1)}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
