"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { Product } from "@/types";

export const createColumns = (
	onDelete?: (id: string) => void,
): ColumnDef<Product>[] => [
	{
		id: "image",
		header: "Image",
		cell: ({ row }) => {
			const coverImage = row.original.coverImage;
			const imageUrl =
				typeof coverImage === "string" ? coverImage : coverImage?.url;

			return (
				<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
					{imageUrl && (
						<Image
							src={imageUrl}
							alt={row.original.title}
							fill
							className="object-cover"
						/>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="max-w-[250px]">
				<p className="truncate font-medium">{row.getValue("title")}</p>
			</div>
		),
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("en-IN", {
				style: "currency",
				currency: "INR",
			}).format(price);
			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "gender",
		header: "Gender",
		cell: ({ row }) => {
			const gender = row.getValue("gender") as string;
			return (
				<Badge variant="secondary" className="capitalize">
					{gender}
				</Badge>
			);
		},
	},
	{
		id: "rating",
		header: "Rating",
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="text-sm">
					⭐ {product.rating.rate.toFixed(1)} ({product.rating.count})
				</div>
			);
		},
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => {
			return (
				<Badge variant={row.original.isActive ? "default" : "secondary"}>
					{row.original.isActive ? "Active" : "Inactive"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const product = row.original;
			const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<span className="text-lg">⋮</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<Link href={`/dashboard/products/${product._id}/edit`}>
								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
							</Link>
							{onDelete && (
								<DropdownMenuItem
									className="text-destructive"
									onSelect={(e) => {
										e.preventDefault();
										setShowDeleteDialog(true);
									}}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{onDelete && (
						<AlertDialog
							open={showDeleteDialog}
							onOpenChange={setShowDeleteDialog}
						>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the product "{product.title}" and remove it from our
										servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											onDelete(product._id);
											setShowDeleteDialog(false);
										}}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</>
			);
		},
	},
];
