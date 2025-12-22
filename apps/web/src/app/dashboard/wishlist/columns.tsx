"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Wishlist } from "@/types";

export const columns: ColumnDef<Wishlist>[] = [
	{
		accessorKey: "userId",
		header: "User ID",
		cell: ({ row }) => {
			const userId = row.getValue("userId") as string;
			return <div className="font-mono text-sm">{userId}</div>;
		},
	},
	{
		accessorKey: "productIds",
		header: "Products",
		cell: ({ row }) => {
			const productIds = row.getValue("productIds") as string[];
			return (
				<div className="text-sm">
					{productIds.length} {productIds.length === 1 ? "product" : "products"}
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
];
