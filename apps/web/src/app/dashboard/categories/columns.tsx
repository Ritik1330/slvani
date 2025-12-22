"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, GripVertical, Trash2 } from "lucide-react";
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
import type { Category } from "@/types";

export const createColumns = (
	onDelete: (id: string) => void,
): ColumnDef<Category>[] => [
	{
		id: "drag",
		header: "",
		cell: () => {
			return (
				<div className="cursor-grab active:cursor-grabbing">
					<GripVertical className="h-4 w-4 text-gray-400" />
				</div>
			);
		},
	},
	{
		id: "order",
		header: "Order",
		cell: ({ row }) => row.original.order,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className="max-w-[500px] truncate font-medium">
				{row.getValue("name")}
			</span>
		),
	},
	{
		accessorKey: "slug",
		header: "Slug",
		cell: ({ row }) => (
			<code className="rounded bg-muted px-2 py-1 text-sm">
				{row.getValue("slug")}
			</code>
		),
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => (
			<div className="max-w-[300px] truncate">
				{row.getValue("description") || "-"}
			</div>
		),
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
			const category = row.original;
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
							<Link href={`/dashboard/categories/${category._id}/edit`}>
								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
							</Link>
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
						</DropdownMenuContent>
					</DropdownMenu>

					<AlertDialog
						open={showDeleteDialog}
						onOpenChange={setShowDeleteDialog}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									category "{category.name}" and remove it from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onDelete(category._id);
										setShowDeleteDialog(false);
									}}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			);
		},
	},
];
