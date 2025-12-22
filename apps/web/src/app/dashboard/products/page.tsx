"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useProductsQuery } from "@/hooks/use-products";
import { createColumns } from "./columns";
import { ProductsDataTable } from "./data-table";

export default function ProductsPage() {
	const { data: response, isLoading } = useProductsQuery();

	const columns = React.useMemo(() => createColumns(), []);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Products
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage your product catalog
					</p>
				</div>
				<Link href="/dashboard/products/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<ProductsDataTable columns={columns} data={response?.data || []} />
			)}
		</div>
	);
}
