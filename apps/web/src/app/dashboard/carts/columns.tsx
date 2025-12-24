"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Cart } from "@/types";

export const columns: ColumnDef<Cart>[] = [
	{
		accessorKey: "userId",
		header: "User ID",
		cell: ({ row }) => {
			const userId = row.getValue("userId") as string;
			return <div className="font-mono text-sm">{userId}</div>;
		},
	},
	{
		accessorKey: "items",
		header: "Items",
		cell: ({ row }) => {
			const items = row.getValue("items") as Cart["items"];
			const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
			return (
				<div className="text-sm">
					{totalItems} {totalItems === 1 ? "item" : "items"}
				</div>
			);
		},
	},
	{
		id: "total",
		header: "Cart Total",
		cell: ({ row }) => {
			const items = row.original.items;
			const total = items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0,
			);
			const formatted = new Intl.NumberFormat("en-IN", {
				style: "currency",
				currency: "INR",
			}).format(total);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		id: "products",
		header: "Products",
		cell: ({ row }) => {
			const items = row.original.items;
			return (
				<div className="max-w-[300px] space-y-1">
					{items.slice(0, 2).map((item) => (
						<div key={item.productId} className="truncate text-sm">
							{item.title} (x{item.quantity})
						</div>
					))}
					{items.length > 2 && (
						<div className="text-muted-foreground text-xs">
							+{items.length - 2} more
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "updatedAt",
		header: "Last Updated",
		cell: ({ row }) => {
			const date = row.getValue("updatedAt") as string;
			return (
				<div className="text-sm">
					{format(new Date(date), "MMM dd, yyyy HH:mm")}
				</div>
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
	{
		id: "actions",
		cell: ({ row }) => {
			const cart = row.original;

			const copyToClipboard = (text: string, label: string) => {
				navigator.clipboard.writeText(text);
				toast.success(`${label} copied to clipboard!`);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Copy IDs</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => copyToClipboard(cart._id, "Cart ID")}
						>
							<Copy className="mr-2 h-4 w-4" />
							Copy Cart ID
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => copyToClipboard(cart.userId, "User ID")}
						>
							<Copy className="mr-2 h-4 w-4" />
							Copy User ID
						</DropdownMenuItem>
						{cart.items.length > 0 && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuLabel>Product IDs</DropdownMenuLabel>
								{cart.items.map((item) => (
									<DropdownMenuItem
										key={item.productId}
										onClick={() =>
											copyToClipboard(
												item.productId,
												`Product ID (${item.title})`,
											)
										}
									>
										<Copy className="mr-2 h-4 w-4" />
										{item.title.substring(0, 20)}
										{item.title.length > 20 ? "..." : ""}
									</DropdownMenuItem>
								))}
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
