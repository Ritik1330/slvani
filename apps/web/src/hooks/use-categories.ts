import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApiClient, apiClient } from "@/lib/api-client";
import type { Category } from "@/types";

// Query keys
export const categoryKeys = {
	all: ["categories"] as const,
	lists: () => [...categoryKeys.all, "list"] as const,
	list: (filters?: {
		page?: number;
		limit?: number;
		isActive?: boolean;
		parentCategory?: string;
	}) => [...categoryKeys.lists(), filters] as const,
	details: () => [...categoryKeys.all, "detail"] as const,
	detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Get all categories query
export function useCategoriesQuery(filters?: {
	page?: number;
	limit?: number;
	isActive?: boolean;
	parentCategory?: string;
}) {
	return useQuery({
		queryKey: categoryKeys.list(filters),
		queryFn: () => apiClient.getCategories(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Get single category query
export function useCategoryQuery(id: string) {
	return useQuery({
		queryKey: categoryKeys.detail(id),
		queryFn: () => adminApiClient.getCategory(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Create category mutation
export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.createCategory.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			toast.success("Category created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create category");
		},
	});
}

// Update category mutation
export function useUpdateCategory(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<Category>) =>
			adminApiClient.updateCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
			toast.success("Category updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update category");
		},
	});
}

// Delete category mutation
export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.deleteCategory.bind(adminApiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			toast.success("Category deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete category");
		},
	});
}

// Reorder categories mutation
export function useReorderCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminApiClient.reorderCategories.bind(adminApiClient),
		onMutate: async (updates) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

			// Snapshot previous value
			const previousCategories = queryClient.getQueryData(categoryKeys.lists());

			// Optimistically update
			queryClient.setQueriesData<Category[]>(
				{ queryKey: categoryKeys.lists() },
				(old) => {
					if (!old) return old;
					const newCategories = [...old];
					updates.forEach((update) => {
						const index = newCategories.findIndex(
							(cat) => cat._id === update.id,
						);
						if (index !== -1) {
							newCategories[index] = {
								...newCategories[index],
								order: update.displayOrder,
							};
						}
					});
					return newCategories.sort((a, b) => a.order - b.order);
				},
			);

			return { previousCategories };
		},
		onError: (error: Error, _variables, context) => {
			// Rollback on error
			if (context?.previousCategories) {
				queryClient.setQueryData(
					categoryKeys.lists(),
					context.previousCategories,
				);
			}
			toast.error(error.message || "Failed to reorder categories");
		},
		onSuccess: () => {
			toast.success("Categories reordered successfully");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
}

// Helper hook for parent categories
export function useParentCategories(excludeId?: string) {
	const { data: categories } = useCategoriesQuery();

	const parentCategories =
		categories?.filter((cat) => !cat.parentCategory && cat._id !== excludeId) ||
		[];

	return { parentCategories };
}
