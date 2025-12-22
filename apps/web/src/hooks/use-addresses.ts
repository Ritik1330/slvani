import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { Address } from "@/types";

// Query keys
export const addressKeys = {
	all: ["addresses"] as const,
	lists: () => [...addressKeys.all, "list"] as const,
	list: () => [...addressKeys.lists()] as const,
};

// Get all addresses query
export function useAddressesQuery() {
	return useQuery({
		queryKey: addressKeys.list(),
		queryFn: () => apiClient.getAddresses(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Create address mutation
export function useCreateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apiClient.createAddress.bind(apiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
			toast.success("Address added successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to add address");
		},
	});
}

// Update address mutation
export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
			apiClient.updateAddress(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
			toast.success("Address updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update address");
		},
	});
}

// Delete address mutation
export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apiClient.deleteAddress.bind(apiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
			toast.success("Address deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete address");
		},
	});
}
