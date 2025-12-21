import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Query keys
export const productKeys = {
	all: ["products"] as const,
	lists: () => [...productKeys.all, "list"] as const,
	list: (filters: Record<string, any>) =>
		[...productKeys.lists(), filters] as const,
	details: () => [...productKeys.all, "detail"] as const,
	detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get products query
export function useProductsQuery(params?: {
	category?: string;
	search?: string;
	sort?: string;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: productKeys.list(params || {}),
		queryFn: () => apiClient.getProducts(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Get single product query
export function useProductQuery(id: string) {
	return useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () => apiClient.getProduct(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
