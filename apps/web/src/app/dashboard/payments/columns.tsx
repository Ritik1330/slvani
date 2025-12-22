"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/types";

const statusColors = {
	pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	success: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
	refunded: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
};

const methodLabels = {
	card: "Card",
	upi: "UPI",
	netbanking: "Net Banking",
	cod: "Cash on Delivery",
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "transactionId",
		header: "Transaction ID",
		cell: ({ row }) => {
			const txId = row.getValue("transactionId") as string;
			return <div className="font-mono text-sm">{txId || "N/A"}</div>;
		},
	},
	{
		accessorKey: "orderId",
		header: "Order ID",
		cell: ({ row }) => {
			const orderId = row.getValue("orderId") as string;
			return <div className="font-mono text-sm">{orderId}</div>;
		},
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = row.getValue("amount") as number;
			return <div className="font-medium">₹{amount.toFixed(2)}</div>;
		},
	},
	{
		accessorKey: "method",
		header: "Method",
		cell: ({ row }) => {
			const method = row.getValue("method") as keyof typeof methodLabels;
			return <div className="text-sm">{methodLabels[method]}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as keyof typeof statusColors;
			return (
				<Badge className={statusColors[status]}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as string;
			return (
				<div className="text-sm">
					{format(new Date(date), "MMM dd, yyyy HH:mm")}
				</div>
			);
		},
	},
];
