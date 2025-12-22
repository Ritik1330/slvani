import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApiClient, apiClient } from "@/lib/api-client";
import type { Coupon } from "@/types";

// Query keys
export const couponKeys = {
	all: ["coupons"] as const,
	lists: () => [...couponKeys.all, "list"] as const,
	list: () => [...couponKeys.lists()] as const,
	detail: (id: string) => [...couponKeys.all, "detail", id] as const,
	verify: (code: string) => [...couponKeys.all, "verify", code] as const,
};

// Verify coupon query (for users)
export function useVerifyCoupon(code: string) {
	return useQuery({
		queryKey: couponKeys.verify(code),
		queryFn: () => apiClient.verifyCoupon(code),
		enabled: !!code && code.length > 0,
		retry: false,
		staleTime: 0, // Always fresh
	});
}

// Get all coupons query (admin only)
export function useCouponsQuery() {
	return useQuery({
		queryKey: couponKeys.list(),
		queryFn: () => adminApiClient.getAllCoupons(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Get single coupon query (admin only)
export function useCouponQuery(id: string) {
	return useQuery({
		queryKey: couponKeys.detail(id),
		queryFn: () => adminApiClient.getCoupon(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Create coupon mutation (admin only)
export function useCreateCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.createCoupon.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
			toast.success("Coupon created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create coupon");
		},
	});
}

// Update coupon mutation (admin only)
export function useUpdateCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) =>
			adminApiClient.updateCoupon(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
			toast.success("Coupon updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update coupon");
		},
	});
}

// Delete coupon mutation (admin only)
export function useDeleteCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.deleteCoupon.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
			toast.success("Coupon deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete coupon");
		},
	});
}
