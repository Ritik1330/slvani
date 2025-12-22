"use client";

import { Heart } from "lucide-react";
import * as React from "react";
import { useAdminWishlistsQuery } from "@/hooks/use-wishlist";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function WishlistPage() {
	const [pageSize, setPageSize] = React.useState(10);
	const [pageIndex, setPageIndex] = React.useState(0);

	const { data: wishlists, isLoading } = useAdminWishlistsQuery({
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
						Wishlists
					</h2>
					<p className="text-muted-foreground text-sm">
						View all customer wishlists
					</p>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Heart className="h-4 w-4" />
					<span>{wishlists?.length || 0} wishlists</span>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={wishlists || []}
				pageSize={pageSize}
				pageIndex={pageIndex}
				onPageSizeChange={setPageSize}
				onPageIndexChange={setPageIndex}
			/>
		</div>
	);
}
