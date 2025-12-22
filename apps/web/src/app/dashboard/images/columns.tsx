"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Copy, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

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

interface ImageData {
	_id: string;
	title: string;
	url: string;
	usedFor: string;
	createdAt: string;
}

export const createColumns = (
	onDelete?: (id: string) => void,
): ColumnDef<ImageData>[] => [
	{
		id: "preview",
		header: "Preview",
		cell: ({ row }) => (
			<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
				<Image
					src={row.original.url}
					alt={row.original.title}
					fill
					className="object-cover"
				/>
			</div>
		),
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
			<div className="max-w-[200px]">
				<p className="truncate font-medium">{row.getValue("title")}</p>
			</div>
		),
	},
	{
		accessorKey: "url",
		header: "URL",
		cell: ({ row }) => {
			const url = row.getValue("url") as string;
			const [copied, setCopied] = React.useState(false);

			const handleCopy = () => {
				navigator.clipboard.writeText(url);
				setCopied(true);
				toast.success("URL copied to clipboard");
				setTimeout(() => setCopied(false), 2000);
			};

			return (
				<div className="flex items-center gap-2">
					<code className="max-w-[300px] truncate rounded bg-muted px-2 py-1 font-mono text-xs">
						{url}
					</code>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopy}
						className="h-8 w-8 p-0"
					>
						<Copy className={`h-3 w-3 ${copied ? "text-green-500" : ""}`} />
					</Button>
					<a href={url} target="_blank" rel="noopener noreferrer">
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<ExternalLink className="h-3 w-3" />
						</Button>
					</a>
				</div>
			);
		},
	},
	{
		accessorKey: "usedFor",
		header: "Used For",
		cell: ({ row }) => {
			const usedFor = row.getValue("usedFor") as string;
			return (
				<Badge variant="secondary" className="capitalize">
					{usedFor}
				</Badge>
			);
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
					Created
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-sm">
					{format(new Date(row.getValue("createdAt")), "PP")}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const image = row.original;
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
							<DropdownMenuItem
								onClick={() => {
									navigator.clipboard.writeText(image.url);
									toast.success("URL copied");
								}}
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy URL
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									navigator.clipboard.writeText(image._id);
									toast.success("ID copied");
								}}
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy ID
							</DropdownMenuItem>
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
										the image "{image.title}" from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											onDelete(image._id);
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
