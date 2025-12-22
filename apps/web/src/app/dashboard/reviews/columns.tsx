"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Star, Trash2 } from "lucide-react";
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

export type Review = {
	_id: string;
	userId: string;
	productId: string;
	rating: number;
	comment?: string;
	images?: string[];
	isVerifiedPurchase: boolean;
	likes: number;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<Review>[] = [
	{
		accessorKey: "_id",
		header: "Review ID",
		cell: ({ row }) => {
			const id = row.getValue("_id") as string;
			return <div className="font-mono text-xs">{id.substring(0, 8)}...</div>;
		},
	},
	{
		accessorKey: "productId",
		header: "Product ID",
		cell: ({ row }) => {
			const id = row.getValue("productId") as string;
			return <div className="font-mono text-xs">{id}</div>;
		},
	},
	{
		accessorKey: "userId",
		header: "User ID",
		cell: ({ row }) => {
			const id = row.getValue("userId") as string;
			return <div className="font-mono text-xs">{id.substring(0, 12)}...</div>;
		},
	},
	{
		accessorKey: "rating",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Rating
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const rating = row.getValue("rating") as number;
			return (
				<div className="flex items-center gap-1">
					<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
					<span className="font-medium">{rating.toFixed(1)}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "comment",
		header: "Comment",
		cell: ({ row }) => {
			const comment = row.getValue("comment") as string | undefined;
			return (
				<div className="max-w-md truncate text-sm">
					{comment || <span className="text-muted-foreground">No comment</span>}
				</div>
			);
		},
	},
	{
		accessorKey: "isVerifiedPurchase",
		header: "Verified",
		cell: ({ row }) => {
			const isVerified = row.getValue("isVerifiedPurchase") as boolean;
			return isVerified ? (
				<Badge variant="outline" className="bg-green-500/10 text-green-500">
					Verified
				</Badge>
			) : (
				<Badge variant="outline" className="bg-gray-500/10 text-gray-500">
					Unverified
				</Badge>
			);
		},
	},
	{
		accessorKey: "likes",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Likes
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const likes = row.getValue("likes") as number;
			return <div className="text-sm">{likes}</div>;
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
			const review = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Trash2 className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-red-600"
							onClick={() => {
								// Delete will be handled in the page component
								const event = new CustomEvent("deleteReview", {
									detail: review._id,
								});
								window.dispatchEvent(event);
							}}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete Review
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
