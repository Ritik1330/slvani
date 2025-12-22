import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { Wishlist } from "@/types";

// Query keys
export const wishlistKeys = {
	all: ["wishlist"] as const,
	detail: () => [...wishlistKeys.all, "detail"] as const,
};

// Get wishlist query
export function useWishlistQuery() {
	return useQuery({
		queryKey: wishlistKeys.detail(),
		queryFn: () => apiClient.getWishlist(),
		retry: 1,
		staleTime: 30 * 1000, // 30 seconds
	});
}

// Toggle wishlist mutation
export function useToggleWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: string) => apiClient.toggleWishlist(productId),
		onMutate: async (productId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });

			// Snapshot previous value
			const previousWishlist = queryClient.getQueryData<Wishlist>(
				wishlistKeys.detail(),
			);

			// Optimistically update
			if (previousWishlist) {
				const isInWishlist = previousWishlist.productIds.includes(productId);
				const newProductIds = isInWishlist
					? previousWishlist.productIds.filter((id) => id !== productId)
					: [...previousWishlist.productIds, productId];

				queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), {
					...previousWishlist,
					productIds: newProductIds,
				});
			}

			return { previousWishlist };
		},
		onError: (error: Error, _productId, context) => {
			// Rollback on error
			if (context?.previousWishlist) {
				queryClient.setQueryData(
					wishlistKeys.detail(),
					context.previousWishlist,
				);
			}
			toast.error(error.message || "Failed to update wishlist");
		},
		onSuccess: (data) => {
			queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), data);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
		},
	});
}

// Helper hook to check if product is in wishlist
export function useIsInWishlist(productId: string) {
	const { data: wishlist } = useWishlistQuery();
	return wishlist?.productIds.includes(productId) || false;
}

// Helper hook for wishlist count
export function useWishlistCount() {
	const { data: wishlist } = useWishlistQuery();
	return wishlist?.productIds.length || 0;
}
