"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
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
import type { Coupon } from "@/types";

export const createColumns = (
	onDelete: (id: string) => void,
): ColumnDef<Coupon>[] => [
	{
		accessorKey: "code",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Code
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<code className="rounded bg-muted px-2 py-1 font-bold text-sm">
				{row.getValue("code")}
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
		id: "discount",
		header: "Discount",
		cell: ({ row }) => {
			const coupon = row.original;
			return (
				<div className="font-medium">
					{coupon.discountType === "percentage"
						? `${coupon.discountValue}%`
						: `₹${coupon.discountValue}`}
					{coupon.maxDiscount && (
						<span className="text-muted-foreground text-xs">
							{" "}
							(max ₹{coupon.maxDiscount})
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "minPurchase",
		header: "Min Purchase",
		cell: ({ row }) => `₹${row.getValue("minPurchase")}`,
	},
	{
		id: "validity",
		header: "Validity",
		cell: ({ row }) => {
			const coupon = row.original;
			return (
				<div className="text-sm">
					<div>{format(new Date(coupon.startDate), "PP")}</div>
					{coupon.expiryDate && (
						<div className="text-muted-foreground">
							to {format(new Date(coupon.expiryDate), "PP")}
						</div>
					)}
				</div>
			);
		},
	},
	{
		id: "usage",
		header: "Usage",
		cell: ({ row }) => {
			const coupon = row.original;
			return (
				<div className="text-sm">
					{coupon.usedCount}
					{coupon.usageLimit && ` / ${coupon.usageLimit}`}
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
			const coupon = row.original;
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
							<Link href={`/dashboard/coupons/${coupon._id}/edit`}>
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
									coupon "{coupon.code}" and remove it from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onDelete(coupon._id);
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
