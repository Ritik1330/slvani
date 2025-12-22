"use client";

import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey: string;
	isLoading?: boolean;
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
	};
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	statusFilter?: boolean;
	onStatusChange: (status: boolean | undefined) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	isLoading,
	pagination,
	onPageChange,
	onLimitChange,
	statusFilter,
	onStatusChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<Input
						placeholder="Search by code..."
						value={
							(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(searchKey)?.setFilterValue(event.target.value)
						}
						className="w-full sm:max-w-sm"
					/>
					<Select
						value={statusFilter === undefined ? "all" : statusFilter.toString()}
						onValueChange={(value) => {
							if (value === "all") {
								onStatusChange(undefined);
							} else {
								onStatusChange(value === "true");
							}
						}}
					>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Coupons</SelectItem>
							<SelectItem value="true">Active</SelectItem>
							<SelectItem value="false">Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center space-x-2">
					<p className="text-muted-foreground text-sm">Rows per page</p>
					<Select
						value={pagination.itemsPerPage.toString()}
						onValueChange={(value) => onLimitChange(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pagination.itemsPerPage} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((size) => (
								<SelectItem key={size} value={size.toString()}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-muted-foreground text-sm">
					Showing {data.length} of {pagination.totalItems} results
				</div>
				<div className="flex items-center justify-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(pagination.currentPage - 1)}
						disabled={pagination.currentPage <= 1}
					>
						Previous
					</Button>
					<div className="flex items-center justify-center font-medium text-sm">
						Page {pagination.currentPage} of {pagination.totalPages}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(pagination.currentPage + 1)}
						disabled={pagination.currentPage >= pagination.totalPages}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
