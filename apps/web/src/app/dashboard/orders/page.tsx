"use client";

import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOrdersQuery, useSeedOrders } from "@/hooks/use-orders";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function OrdersPage() {
	const { data: orders, isLoading } = useAdminOrdersQuery();
	const seedMutation = useSeedOrders();

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
						Orders
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage customer orders and update their status
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => seedMutation.mutate()}
					disabled={seedMutation.isPending}
				>
					<Database className="mr-2 h-4 w-4" />
					{seedMutation.isPending ? "Seeding..." : "Seed Orders"}
				</Button>
			</div>

			<DataTable columns={columns} data={orders || []} />
		</div>
	);
}
