import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApiClient } from "@/lib/api-client";

// Query keys
export const imageKeys = {
	all: ["images"] as const,
	lists: () => [...imageKeys.all, "list"] as const,
	list: (filters?: {
		usedFor?: "product" | "category" | "banner" | "other";
		page?: number;
		limit?: number;
	}) => [...imageKeys.lists(), filters] as const,
};

// Get images query (admin only)
export function useImagesQuery(filters?: {
	usedFor?: "product" | "category" | "banner" | "other";
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: imageKeys.list(filters),
		queryFn: () => adminApiClient.getImages(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Create image mutation (admin only)
export function useCreateImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.createImage.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
			toast.success("Image uploaded successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to upload image");
		},
	});
}

// Update image mutation (admin only)
export function useUpdateImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			// biome-ignore lint/suspicious/noExplicitAny: Image type not fully defined
			data: Partial<any>;
		}) => adminApiClient.updateImage(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
			toast.success("Image updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update image");
		},
	});
}

// Delete image mutation (admin only)
export function useDeleteImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.deleteImage.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
			toast.success("Image deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete image");
		},
	});
}

// Get upload signature mutation (admin only)
export function useGetUploadSignature() {
	return useMutation({
		mutationFn: (folder?: string) => adminApiClient.getUploadSignature(folder),
		onError: (error: Error) => {
			toast.error(error.message || "Failed to get upload signature");
		},
	});
}
