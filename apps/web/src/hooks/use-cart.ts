import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { Cart } from "@/types";

// Query keys
export const cartKeys = {
	all: ["cart"] as const,
	detail: () => [...cartKeys.all, "detail"] as const,
};

// Get cart query
export function useCartQuery() {
	return useQuery({
		queryKey: cartKeys.detail(),
		queryFn: () => apiClient.getCart(),
		retry: 1,
		staleTime: 30 * 1000, // 30 seconds
	});
}

// Add to cart mutation
export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => apiClient.addToCart(productId, quantity),
		onSuccess: (data) => {
			// Update cart cache
			queryClient.setQueryData<Cart>(cartKeys.detail(), data);
			toast.success("Added to cart!");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to add to cart");
		},
	});
}

// Update cart mutation
export function useUpdateCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => apiClient.updateCart(productId, quantity),
		onSuccess: (data) => {
			queryClient.setQueryData<Cart>(cartKeys.detail(), data);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update cart");
		},
	});
}

// Remove from cart mutation
export function useRemoveFromCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: string) => apiClient.removeFromCart(productId),
		onSuccess: (data) => {
			queryClient.setQueryData<Cart>(cartKeys.detail(), data);
			toast.info("Item removed from cart");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to remove from cart");
		},
	});
}

// Clear cart mutation
export function useClearCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => apiClient.clearCart(),
		onSuccess: () => {
			queryClient.setQueryData<Cart>(cartKeys.detail(), {
				_id: "",
				userId: "",
				items: [],
				createdAt: "",
				updatedAt: "",
			});
			toast.success("Cart cleared");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to clear cart");
		},
	});
}

// Helper hook for cart count and total
export function useCartSummary() {
	const { data: cart } = useCartQuery();

	const cartCount =
		cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
	const cartTotal =
		cart?.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		) || 0;

	return { cartCount, cartTotal };
}
