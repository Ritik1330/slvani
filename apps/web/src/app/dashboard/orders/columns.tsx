"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Order = {
	_id: string;
	userId: string;
	items: Array<{
		productId: string;
		title: string;
		price: number;
		quantity: number;
		image: string;
	}>;
	subtotal: number;
	discount: number;
	total: number;
	status:
		| "pending"
		| "confirmed"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	paymentMethod: "card" | "upi" | "netbanking" | "cod";
	shippingAddress: {
		fullName: string;
		phone: string;
		addressLine1: string;
		city: string;
		state: string;
		pincode: string;
	};
	couponCode?: string;
	transactionId?: string;
	createdAt: string;
	updatedAt: string;
};

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

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "_id",
		header: "Order ID",
		cell: ({ row }) => {
			const id = row.getValue("_id") as string;
			return <div className="font-mono text-xs">{id.substring(0, 8)}...</div>;
		},
	},
	{
		accessorKey: "shippingAddress.fullName",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Customer
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div>
					<div className="font-medium">
						{row.original.shippingAddress.fullName}
					</div>
					<div className="text-muted-foreground text-xs">
						{row.original.shippingAddress.phone}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "items",
		header: "Items",
		cell: ({ row }) => {
			const items = row.getValue("items") as Order["items"];
			const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
			return (
				<div className="text-sm">
					{totalItems} {totalItems === 1 ? "item" : "items"}
				</div>
			);
		},
	},
	{
		accessorKey: "total",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Total
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const total = row.getValue("total") as number;
			return <div className="font-medium">₹{total.toFixed(2)}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Order Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as Order["status"];
			return (
				<Badge variant="outline" className={statusColors[status]}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "paymentStatus",
		header: "Payment",
		cell: ({ row }) => {
			const paymentStatus = row.getValue(
				"paymentStatus",
			) as Order["paymentStatus"];
			return (
				<Badge variant="outline" className={paymentStatusColors[paymentStatus]}>
					{paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "paymentMethod",
		header: "Method",
		cell: ({ row }) => {
			const method = row.getValue("paymentMethod") as string;
			return <div className="text-sm uppercase">{method}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return (
				<div className="text-sm">
					{date.toLocaleDateString("en-IN", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const order = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Eye className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href={`/dashboard/orders/${order._id}`}>
							<DropdownMenuItem>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
