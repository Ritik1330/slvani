"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
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

interface DraggableItem {
	_id: string;
	// biome-ignore lint/suspicious/noExplicitAny: Generic data structure
	[key: string]: any;
}

interface DataTableProps<TData extends DraggableItem, TValue> {
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
	onReorder?: (updates: { id: string; displayOrder: number }[]) => void;
}

export function DataTable<TData extends DraggableItem, TValue>({
	columns,
	data,
	searchKey,
	isLoading,
	pagination,
	onPageChange,
	onLimitChange,
	statusFilter,
	onStatusChange,
	onReorder,
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

	// biome-ignore lint/suspicious/noExplicitAny: DnD result type
	const handleDragEnd = (result: any) => {
		if (!result.destination) {
			return;
		}

		if (!onReorder) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const items = Array.from(data);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const updates = items.map((item, index) => ({
			id: item._id,
			displayOrder: index + 1,
		}));

		onReorder(updates);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<Input
						placeholder="Search..."
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
							<SelectItem value="all">All Categories</SelectItem>
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
				<DragDropContext onDragEnd={handleDragEnd}>
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
						<Droppable droppableId="categories">
							{(provided) => (
								<TableBody {...provided.droppableProps} ref={provided.innerRef}>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row, index) => (
											<Draggable
												key={row.original._id}
												draggableId={row.original._id}
												index={index}
											>
												{(provided) => (
													<TableRow
														ref={provided.innerRef}
														{...provided.draggableProps}
														data-state={row.getIsSelected() && "selected"}
													>
														{row.getVisibleCells().map((cell) => (
															<TableCell
																key={cell.id}
																{...(cell.column.id === "drag"
																	? provided.dragHandleProps
																	: {})}
															>
																{flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext(),
																)}
															</TableCell>
														))}
													</TableRow>
												)}
											</Draggable>
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
									{provided.placeholder}
								</TableBody>
							)}
						</Droppable>
					</Table>
				</DragDropContext>
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
