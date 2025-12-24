"use client";

import { ShoppingCart } from "lucide-react";
import * as React from "react";
import { useAdminCartsQuery } from "@/hooks/use-cart";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function CartsPage() {
	const [pageSize, setPageSize] = React.useState(10);
	const [pageIndex, setPageIndex] = React.useState(0);

	const { data: carts, isLoading } = useAdminCartsQuery({
		limit: pageSize,
		skip: pageIndex * pageSize,
	});

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Shopping Carts
					</h2>
					<p className="text-muted-foreground text-sm">
						View all customer shopping carts
					</p>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<ShoppingCart className="h-4 w-4" />
					<span>{carts?.length || 0} carts</span>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={carts || []}
				pageSize={pageSize}
				pageIndex={pageIndex}
				onPageSizeChange={setPageSize}
				onPageIndexChange={setPageIndex}
			/>
		</div>
	);
}
