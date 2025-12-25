import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/api-client";

// Query keys
export const paymentKeys = {
	all: ["payments"] as const,
	admin: () => [...paymentKeys.all, "admin"] as const,
};

// Get all payments query (admin only)
export function useAdminPaymentsQuery(params?: {
	limit?: number;
	skip?: number;
	status?: "pending" | "success" | "failed" | "refunded";
	method?: "card" | "upi" | "netbanking" | "cod";
	orderId?: string;
}) {
	return useQuery({
		queryKey: [...paymentKeys.admin(), params],
		queryFn: () => adminApiClient.getAllPayments(params),
		staleTime: 1 * 60 * 1000, // 1 minute
	});
}
