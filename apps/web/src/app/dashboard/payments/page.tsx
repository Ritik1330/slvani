"use client";

import { CreditCard } from "lucide-react";
import * as React from "react";
import { useAdminPaymentsQuery } from "@/hooks/use-payments";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function PaymentsPage() {
	const [pageSize, setPageSize] = React.useState(10);
	const [pageIndex, setPageIndex] = React.useState(0);
	const [statusFilter, setStatusFilter] = React.useState<
		"pending" | "success" | "failed" | "refunded" | undefined
	>(undefined);
	const [methodFilter, setMethodFilter] = React.useState<
		"card" | "upi" | "netbanking" | "cod" | undefined
	>(undefined);
	const [orderIdFilter, setOrderIdFilter] = React.useState("");

	const { data: payments, isLoading } = useAdminPaymentsQuery({
		limit: pageSize,
		skip: pageIndex * pageSize,
		status: statusFilter,
		method: methodFilter,
		orderId: orderIdFilter || undefined,
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
						Payments
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage payment transactions
					</p>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<CreditCard className="h-4 w-4" />
					<span>{payments?.length || 0} payments</span>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={payments || []}
				pageSize={pageSize}
				pageIndex={pageIndex}
				onPageSizeChange={setPageSize}
				onPageIndexChange={setPageIndex}
				onStatusFilterChange={setStatusFilter}
				onMethodFilterChange={setMethodFilter}
				onOrderIdFilterChange={setOrderIdFilter}
			/>
		</div>
	);
}
