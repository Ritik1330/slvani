import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApiClient, apiClient } from "@/lib/api-client";
import type { Product } from "@/types";

// Query keys
export const productKeys = {
	all: ["products"] as const,
	lists: () => [...productKeys.all, "list"] as const,
	list: (filters: Record<string, unknown>) =>
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

// Create product mutation (admin only)
export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.createProduct.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			toast.success("Product created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create product");
		},
	});
}

// Update product mutation (admin only)
export function useUpdateProduct(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<Product>) =>
			adminApiClient.updateProduct(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
			toast.success("Product updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update product");
		},
	});
}

// Delete product mutation (admin only)
export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.deleteProduct.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			toast.success("Product deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete product");
		},
	});
}

// Seed products mutation (admin only)
export function useSeedProducts() {
	const queryClient = useQueryClient();

	return useMutation<{ message: string; count: number }, Error, void>({
		mutationFn: () => adminApiClient.seedProducts(),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			toast.success(`${data.count} products seeded successfully`);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to seed products");
		},
	});
}
