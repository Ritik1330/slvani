"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	useCategoriesQuery,
	useDeleteCategory,
	useReorderCategories,
} from "@/hooks/use-categories";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";

export default function CategoriesPage() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [status, setStatus] = useState<boolean | undefined>();

	const { data: categories, isLoading } = useCategoriesQuery({
		page,
		limit,
		isActive: status,
	});

	const categoriesList = categories || [];

	const pagination = {
		currentPage: page,
		totalPages: Math.ceil(categoriesList.length / limit),
		totalItems: categoriesList.length,
		itemsPerPage: limit,
	};

	const deleteMutation = useDeleteCategory();
	const reorderMutation = useReorderCategories();

	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const handleReorder = (updates: { id: string; displayOrder: number }[]) => {
		reorderMutation.mutate(updates);
	};

	const columns = createColumns(handleDelete);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Categories
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage your content categories
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Link href="/dashboard/categories/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add Category
						</Button>
					</Link>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={categoriesList}
				isLoading={isLoading}
				searchKey="name"
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
				statusFilter={status}
				onStatusChange={setStatus}
				onReorder={handleReorder}
			/>
		</div>
	);
}
