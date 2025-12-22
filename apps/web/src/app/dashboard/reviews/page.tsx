"use client";

import { MessageSquare } from "lucide-react";
import * as React from "react";
import {
	useAdminDeleteReview,
	useAdminReviewsQuery,
} from "@/hooks/use-reviews";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function ReviewsPage() {
	const [pageSize, setPageSize] = React.useState(10);
	const [pageIndex, setPageIndex] = React.useState(0);
	const [productIdFilter, setProductIdFilter] = React.useState("");
	const [verifiedFilter, setVerifiedFilter] = React.useState<
		boolean | undefined
	>(undefined);

	const { data: reviews, isLoading } = useAdminReviewsQuery({
		limit: pageSize,
		skip: pageIndex * pageSize,
		productId: productIdFilter || undefined,
		isVerifiedPurchase: verifiedFilter,
	});

	const deleteMutation = useAdminDeleteReview();

	React.useEffect(() => {
		const handleDelete = (event: Event) => {
			const customEvent = event as CustomEvent<string>;
			const reviewId = customEvent.detail;
			if (window.confirm("Are you sure you want to delete this review?")) {
				deleteMutation.mutate(reviewId);
			}
		};

		window.addEventListener("deleteReview", handleDelete);
		return () => window.removeEventListener("deleteReview", handleDelete);
	}, [deleteMutation]);

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
						Reviews
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage customer reviews and ratings
					</p>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<MessageSquare className="h-4 w-4" />
					<span>{reviews?.length || 0} reviews</span>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={reviews || []}
				pageSize={pageSize}
				pageIndex={pageIndex}
				onPageSizeChange={setPageSize}
				onPageIndexChange={setPageIndex}
				onProductIdFilterChange={setProductIdFilter}
				onVerifiedFilterChange={setVerifiedFilter}
			/>
		</div>
	);
}
