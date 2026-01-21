"use client";

import { Loader2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAdminWishlistsQuery } from "@/hooks/use-wishlist";

export default function WishlistsPage() {
	const { data: wishlists, isLoading } = useAdminWishlistsQuery();

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div>
				<h2 className="font-bold text-xl tracking-tight md:text-2xl">
					Wishlists
				</h2>
				<p className="text-muted-foreground text-sm">
					Manage all user wishlists
				</p>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User ID</TableHead>
							<TableHead>Products</TableHead>
							<TableHead>Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{wishlists && wishlists.length > 0 ? (
							wishlists.map((wishlist) => (
								<TableRow key={wishlist._id}>
									<TableCell className="font-mono text-sm">
										{wishlist.userId}
									</TableCell>
									<TableCell>{wishlist.productIds.length} items</TableCell>
									<TableCell>
										{new Date(wishlist.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} className="h-24 text-center">
									No wishlists found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
