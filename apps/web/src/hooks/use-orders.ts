import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApiClient, apiClient } from "@/lib/api-client";
import type { Order } from "@/types";

// Query keys
export const orderKeys = {
	all: ["orders"] as const,
	lists: () => [...orderKeys.all, "list"] as const,
	list: () => [...orderKeys.lists()] as const,
	details: () => [...orderKeys.all, "detail"] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
	admin: () => [...orderKeys.all, "admin"] as const,
};

// Get user orders query
export function useOrdersQuery() {
	return useQuery({
		queryKey: orderKeys.list(),
		queryFn: () => apiClient.getOrders(),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

// Get single order query
export function useOrderQuery(id: string) {
	return useQuery({
		queryKey: orderKeys.detail(id),
		queryFn: () => apiClient.getOrder(id),
		enabled: !!id,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

// Get all orders query (admin only)
export function useAdminOrdersQuery() {
	return useQuery({
		queryKey: orderKeys.admin(),
		queryFn: () => adminApiClient.getAllOrders(),
		staleTime: 1 * 60 * 1000, // 1 minute
	});
}

// Create order mutation
export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apiClient.createOrder.bind(apiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
			toast.success("Order placed successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to place order");
		},
	});
}

// Update order status mutation (admin only)
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string;
			status:
				| "pending"
				| "confirmed"
				| "processing"
				| "shipped"
				| "delivered"
				| "cancelled";
		}) => adminApiClient.updateOrderStatus(id, status),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(variables.id),
			});
			toast.success("Order status updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update order status");
		},
	});
}

// Seed orders mutation (admin only - dev only)
export function useSeedOrders() {
	const queryClient = useQueryClient();

	return useMutation<{ message: string; count: number }, Error, void>({
		mutationFn: () => adminApiClient.seedOrders(),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
			toast.success(`${data.count} orders seeded successfully`);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to seed orders");
		},
	});
}
