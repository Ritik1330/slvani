"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCouponsQuery, useDeleteCoupon } from "@/hooks/use-coupons";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";

export default function CouponsPage() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [status, setStatus] = useState<boolean | undefined>();

	const { data: coupons, isLoading } = useCouponsQuery();

	const couponsList = coupons || [];

	const pagination = {
		currentPage: page,
		totalPages: Math.ceil(couponsList.length / limit),
		totalItems: couponsList.length,
		itemsPerPage: limit,
	};

	const deleteMutation = useDeleteCoupon();

	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const columns = createColumns(handleDelete);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Coupons
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage discount coupons and promotional codes
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Link href="/dashboard/coupons/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add Coupon
						</Button>
					</Link>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={couponsList}
				isLoading={isLoading}
				searchKey="code"
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
				statusFilter={status}
				onStatusChange={setStatus}
			/>
		</div>
	);
}
