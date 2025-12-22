import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

// Query keys
export const reviewKeys = {
	all: ["reviews"] as const,
	lists: () => [...reviewKeys.all, "list"] as const,
	list: (productId: string) => [...reviewKeys.lists(), productId] as const,
};

// Get product reviews query
export function useProductReviewsQuery(productId: string) {
	return useQuery({
		queryKey: reviewKeys.list(productId),
		queryFn: () => apiClient.getProductReviews(productId),
		enabled: !!productId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Create review mutation
export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (review: {
			productId: string;
			rating: number;
			comment?: string;
			images?: string[];
		}) => apiClient.createReview(review),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: reviewKeys.list(variables.productId),
			});
			toast.success("Review submitted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to submit review");
		},
	});
}

// Delete review mutation
export function useDeleteReview(productId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apiClient.deleteReview.bind(apiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: reviewKeys.list(productId),
			});
			toast.success("Review deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete review");
		},
	});
}
