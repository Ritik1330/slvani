"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
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
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [verifiedFilter, setVerifiedFilter] = React.useState<string>("all");
	const [pageSize, setPageSize] = React.useState(10);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			pagination: {
				pageIndex: 0,
				pageSize,
			},
		},
	});

	// Apply verified filter
	React.useEffect(() => {
		if (verifiedFilter === "all") {
			table.getColumn("isVerifiedPurchase")?.setFilterValue(undefined);
		} else if (verifiedFilter === "verified") {
			table.getColumn("isVerifiedPurchase")?.setFilterValue(true);
		} else {
			table.getColumn("isVerifiedPurchase")?.setFilterValue(false);
		}
	}, [verifiedFilter, table]);

	// Update page size
	React.useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	return (
		<div>
			<div className="flex items-center gap-4 py-4">
				<Input
					placeholder="Search by Product ID..."
					value={
						(table.getColumn("productId")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("productId")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by Verified" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Reviews</SelectItem>
						<SelectItem value="verified">Verified Only</SelectItem>
						<SelectItem value="unverified">Unverified Only</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={String(pageSize)}
					onValueChange={(value) => setPageSize(Number(value))}
				>
					<SelectTrigger className="w-[130px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="50">50 per page</SelectItem>
						<SelectItem value="100">100 per page</SelectItem>
						<SelectItem value="500">500 per page</SelectItem>
					</SelectContent>
				</Select>
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
			<div className="flex items-center justify-between py-4">
				<div className="text-muted-foreground text-sm">
					Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
					{Math.min(
						(table.getState().pagination.pageIndex + 1) * pageSize,
						table.getFilteredRowModel().rows.length,
					)}{" "}
					of {table.getFilteredRowModel().rows.length} results
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
