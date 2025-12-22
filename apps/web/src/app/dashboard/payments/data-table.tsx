"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
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
	pageSize: number;
	pageIndex: number;
	onPageSizeChange: (size: number) => void;
	onPageIndexChange: (index: number) => void;
	onStatusFilterChange: (
		status: "pending" | "success" | "failed" | "refunded" | undefined,
	) => void;
	onMethodFilterChange: (
		method: "card" | "upi" | "netbanking" | "cod" | undefined,
	) => void;
	onOrderIdFilterChange: (orderId: string) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageSize: externalPageSize,
	pageIndex: externalPageIndex,
	onPageSizeChange,
	onPageIndexChange,
	onStatusFilterChange,
	onMethodFilterChange,
	onOrderIdFilterChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [methodFilter, setMethodFilter] = React.useState<string>("all");
	const [orderIdFilter, setOrderIdFilter] = React.useState("");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		manualPagination: true,
		pageCount: -1,
		state: {
			sorting,
			pagination: {
				pageIndex: externalPageIndex,
				pageSize: externalPageSize,
			},
		},
	});

	// Handle order ID filter change with debounce
	React.useEffect(() => {
		const timer = setTimeout(() => {
			onOrderIdFilterChange(orderIdFilter);
			onPageIndexChange(0); // Reset to first page
		}, 500);

		return () => clearTimeout(timer);
	}, [orderIdFilter, onOrderIdFilterChange, onPageIndexChange]);

	// Handle status filter change
	React.useEffect(() => {
		if (statusFilter === "all") {
			onStatusFilterChange(undefined);
		} else {
			onStatusFilterChange(
				statusFilter as "pending" | "success" | "failed" | "refunded",
			);
		}
		onPageIndexChange(0); // Reset to first page
	}, [statusFilter, onStatusFilterChange, onPageIndexChange]);

	// Handle method filter change
	React.useEffect(() => {
		if (methodFilter === "all") {
			onMethodFilterChange(undefined);
		} else {
			onMethodFilterChange(
				methodFilter as "card" | "upi" | "netbanking" | "cod",
			);
		}
		onPageIndexChange(0); // Reset to first page
	}, [methodFilter, onMethodFilterChange, onPageIndexChange]);

	return (
		<div>
			<div className="flex items-center gap-4 py-4">
				<Input
					placeholder="Search by Order ID..."
					value={orderIdFilter}
					onChange={(event) => setOrderIdFilter(event.target.value)}
					className="max-w-sm"
				/>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="success">Success</SelectItem>
						<SelectItem value="failed">Failed</SelectItem>
						<SelectItem value="refunded">Refunded</SelectItem>
					</SelectContent>
				</Select>
				<Select value={methodFilter} onValueChange={setMethodFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by Method" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Methods</SelectItem>
						<SelectItem value="card">Card</SelectItem>
						<SelectItem value="upi">UPI</SelectItem>
						<SelectItem value="netbanking">Net Banking</SelectItem>
						<SelectItem value="cod">Cash on Delivery</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={String(externalPageSize)}
					onValueChange={(value) => {
						onPageSizeChange(Number(value));
						onPageIndexChange(0); // Reset to first page
					}}
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
					Showing {externalPageIndex * externalPageSize + 1} to{" "}
					{externalPageIndex * externalPageSize + data.length} results
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageIndexChange(externalPageIndex - 1)}
						disabled={externalPageIndex === 0}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageIndexChange(externalPageIndex + 1)}
						disabled={data.length < externalPageSize}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
