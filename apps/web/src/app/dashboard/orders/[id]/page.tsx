"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrderQuery, useUpdateOrderStatus } from "@/hooks/use-orders";

const statusColors = {
	pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	confirmed: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
	processing: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
	shipped: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
	delivered: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const paymentStatusColors = {
	pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	paid: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
	refunded: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

export default function OrderDetailPage() {
	const router = useRouter();
	const params = useParams();
	const orderId = params.id as string;

	const { data: order, isLoading } = useOrderQuery(orderId);
	const updateStatusMutation = useUpdateOrderStatus();

	const [selectedStatus, setSelectedStatus] = React.useState<string>("");

	React.useEffect(() => {
		if (order) {
			setSelectedStatus(order.status);
		}
	}, [order]);

	const handleStatusUpdate = () => {
		if (selectedStatus && selectedStatus !== order?.status) {
			updateStatusMutation.mutate({
				id: orderId,
				status: selectedStatus as
					| "pending"
					| "confirmed"
					| "processing"
					| "shipped"
					| "delivered"
					| "cancelled",
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div>Loading...</div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div>Order not found</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Order Details
					</h2>
					<p className="text-muted-foreground text-sm">Order ID: {order._id}</p>
				</div>
				<Button
					variant="outline"
					onClick={() => router.push("/dashboard/orders")}
				>
					Back to Orders
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{/* Order Status Card */}
				<Card>
					<CardHeader>
						<CardTitle>Order Status</CardTitle>
						<CardDescription>Update the order status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="current-status" className="font-medium text-sm">
								Current Status
							</label>
							<div id="current-status">
								<Badge variant="outline" className={statusColors[order.status]}>
									{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
								</Badge>
							</div>
						</div>
						<div className="space-y-2">
							<label htmlFor="update-status" className="font-medium text-sm">
								Update Status
							</label>
							<Select value={selectedStatus} onValueChange={setSelectedStatus}>
								<SelectTrigger id="update-status">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="confirmed">Confirmed</SelectItem>
									<SelectItem value="processing">Processing</SelectItem>
									<SelectItem value="shipped">Shipped</SelectItem>
									<SelectItem value="delivered">Delivered</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							onClick={handleStatusUpdate}
							disabled={
								updateStatusMutation.isPending ||
								selectedStatus === order.status
							}
							className="w-full"
						>
							{updateStatusMutation.isPending ? "Updating..." : "Update Status"}
						</Button>
					</CardContent>
				</Card>

				{/* Payment Info Card */}
				<Card>
					<CardHeader>
						<CardTitle>Payment Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-muted-foreground text-sm">Payment Status</p>
							<Badge
								variant="outline"
								className={paymentStatusColors[order.paymentStatus]}
							>
								{order.paymentStatus.charAt(0).toUpperCase() +
									order.paymentStatus.slice(1)}
							</Badge>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">Payment Method</p>
							<p className="font-medium uppercase">{order.paymentMethod}</p>
						</div>
						{order.transactionId && (
							<div>
								<p className="text-muted-foreground text-sm">Transaction ID</p>
								<p className="font-mono text-sm">{order.transactionId}</p>
							</div>
						)}
						{order.couponCode && (
							<div>
								<p className="text-muted-foreground text-sm">Coupon Code</p>
								<p className="font-medium">{order.couponCode}</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Order Summary Card */}
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Discount</span>
							<span className="font-medium text-green-600">
								-₹{order.discount.toFixed(2)}
							</span>
						</div>
						<Separator />
						<div className="flex justify-between">
							<span className="font-semibold">Total</span>
							<span className="font-bold text-lg">
								₹{order.total.toFixed(2)}
							</span>
						</div>
						<div className="pt-2">
							<p className="text-muted-foreground text-xs">
								Order placed on{" "}
								{new Date(order.createdAt).toLocaleDateString("en-IN", {
									day: "2-digit",
									month: "long",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Order Items */}
			<Card>
				<CardHeader>
					<CardTitle>Order Items</CardTitle>
					<CardDescription>
						{order.items.length} {order.items.length === 1 ? "item" : "items"}{" "}
						in this order
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{order.items.map((item) => (
							<div key={item.productId} className="flex items-center gap-4">
								<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
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
										Quantity: {item.quantity}
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">₹{item.price.toFixed(2)}</p>
									<p className="text-muted-foreground text-sm">
										Total: ₹{(item.price * item.quantity).toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Addresses */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Shipping Address */}
				<Card>
					<CardHeader>
						<CardTitle>Shipping Address</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1 text-sm">
							<p className="font-medium">{order.shippingAddress.fullName}</p>
							<p>{order.shippingAddress.phone}</p>
							<p>{order.shippingAddress.addressLine1}</p>
							{order.shippingAddress.addressLine2 && (
								<p>{order.shippingAddress.addressLine2}</p>
							)}
							<p>
								{order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
								{order.shippingAddress.pincode}
							</p>
							<p>{order.shippingAddress.country}</p>
						</div>
					</CardContent>
				</Card>

				{/* Billing Address */}
				<Card>
					<CardHeader>
						<CardTitle>Billing Address</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1 text-sm">
							<p className="font-medium">{order.billingAddress.fullName}</p>
							<p>{order.billingAddress.phone}</p>
							<p>{order.billingAddress.addressLine1}</p>
							{order.billingAddress.addressLine2 && (
								<p>{order.billingAddress.addressLine2}</p>
							)}
							<p>
								{order.billingAddress.city}, {order.billingAddress.state} -{" "}
								{order.billingAddress.pincode}
							</p>
							<p>{order.billingAddress.country}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
