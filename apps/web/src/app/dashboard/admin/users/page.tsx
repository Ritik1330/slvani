"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Shield, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";

export default function AdminUsersPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [newUserData, setNewUserData] = useState<{
		email: string;
		password: string;
		name: string;
		role: "user" | "admin";
	}>({
		email: "",
		password: "",
		name: "",
		role: "user",
	});

	// Fetch all users using better-auth admin API
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "users", page, limit],
		queryFn: async () => {
			const offset = (page - 1) * limit;
			const { data: users, error } = await authClient.admin.listUsers({
				query: {
					limit,
					offset,
					sortBy: "createdAt",
					sortDirection: "desc",
				},
			});
			if (error) {
				throw new Error(error.message || "Failed to fetch users");
			}
			return users;
		},
	});

	const usersList = data?.users || [];
	const totalItems = data?.total || 0;
	const totalPages = Math.ceil(totalItems / limit);
	const pagination = {
		currentPage: page,
		totalPages,
		totalItems,
		itemsPerPage: limit,
	};

	// Count admins
	const adminCount = usersList.filter((user) => user.role === "admin").length;

	// Set admin mutation
	const setAdminMutation = useMutation({
		mutationFn: async (userId: string) => {
			console.log("Setting admin role for userId:", userId);
			const { data, error } = await authClient.admin.setRole({
				userId,
				role: "admin",
			});
			console.log("Set admin response:", { data, error });
			if (error) {
				throw new Error(error.message || "Failed to set admin role");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("User promoted to admin successfully");
		},
		onError: (error: Error) => {
			console.error("Set admin error:", error);
			toast.error(error.message || "Failed to set admin role");
		},
	});

	// Remove admin mutation
	const removeAdminMutation = useMutation({
		mutationFn: async (userId: string) => {
			console.log("Removing admin role for userId:", userId);
			const { data, error } = await authClient.admin.setRole({
				userId,
				role: "user",
			});
			console.log("Remove admin response:", { data, error });
			if (error) {
				throw new Error(error.message || "Failed to remove admin role");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("Admin role removed successfully");
		},
		onError: (error: Error) => {
			console.error("Remove admin error:", error);
			toast.error(error.message || "Failed to remove admin role");
		},
	});

	// Create user mutation
	const createUserMutation = useMutation({
		mutationFn: async (userData: {
			email: string;
			password: string;
			name: string;
			role: "user" | "admin";
		}) => {
			console.log("Creating user:", userData);
			const { data, error } = await authClient.admin.createUser({
				email: userData.email,
				password: userData.password,
				name: userData.name,
				role: userData.role as "user" | "admin",
			});
			console.log("Create user response:", { data, error });
			if (error) {
				throw new Error(error.message || "Failed to create user");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("User created successfully");
			setShowCreateDialog(false);
			setNewUserData({ email: "", password: "", name: "", role: "user" });
		},
		onError: (error: Error) => {
			console.error("Create user error:", error);
			toast.error(error.message || "Failed to create user");
		},
	});

	// Reset password mutation
	const resetPasswordMutation = useMutation({
		mutationFn: async ({
			userId,
			newPassword,
		}: {
			userId: string;
			newPassword: string;
		}) => {
			console.log("Resetting password for userId:", userId);
			console.log("New password length:", newPassword.length);
			const { data, error } = await authClient.admin.setUserPassword({
				userId,
				newPassword,
			});
			console.log("Reset password response:", { data, error });
			if (error) {
				throw new Error(error.message || "Failed to reset password");
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Password reset successfully");
		},
		onError: (error: Error) => {
			console.error("Reset password error:", error);
			toast.error(error.message || "Failed to reset password");
		},
	});

	// Ban user mutation
	const banUserMutation = useMutation({
		mutationFn: async ({
			userId,
			reason,
			expiresIn,
		}: {
			userId: string;
			reason: string;
			expiresIn: number;
		}) => {
			const { data, error } = await authClient.admin.banUser({
				userId,
				banReason: reason,
				banExpiresIn: expiresIn,
			});
			if (error) {
				throw new Error(error.message || "Failed to ban user");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("User banned successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to ban user");
		},
	});

	// Unban user mutation
	const unbanUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			const { data, error } = await authClient.admin.unbanUser({
				userId,
			});
			if (error) {
				throw new Error(error.message || "Failed to unban user");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("User unbanned successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to unban user");
		},
	});

	// Delete user mutation
	const deleteUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			const { data, error } = await authClient.admin.removeUser({
				userId,
			});
			if (error) {
				throw new Error(error.message || "Failed to delete user");
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			toast.success("User deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete user");
		},
	});

	const handleSetAdmin = (userId: string) => {
		setAdminMutation.mutate(userId);
	};

	const handleRemoveAdmin = (userId: string) => {
		removeAdminMutation.mutate(userId);
	};

	const handleResetPassword = (userId: string, newPassword: string) => {
		resetPasswordMutation.mutate({ userId, newPassword });
	};

	const handleBanUser = (userId: string, reason: string, expiresIn: number) => {
		banUserMutation.mutate({ userId, reason, expiresIn });
	};

	const handleUnbanUser = (userId: string) => {
		unbanUserMutation.mutate(userId);
	};

	const handleDeleteUser = (userId: string) => {
		deleteUserMutation.mutate(userId);
	};

	const handleCreateUser = () => {
		if (!newUserData.email || !newUserData.password || !newUserData.name) {
			toast.error("Please fill in all required fields");
			return;
		}
		createUserMutation.mutate(newUserData);
	};

	const columns = createColumns(
		handleSetAdmin,
		handleRemoveAdmin,
		handleResetPassword,
		handleBanUser,
		handleUnbanUser,
		handleDeleteUser,
	);

	return (
		<div className="flex p-1md:flex h-full flex-1 flex-col space-y-8">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="font-bold text-2xl tracking-tight">
						Users Management
					</h2>
					<p className="text-muted-foreground">
						Manage user roles and permissions
					</p>
				</div>
				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New User</DialogTitle>
							<DialogDescription>
								Add a new user to the system with email and password.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="create-user-name">Name</Label>
								<Input
									id="create-user-name"
									placeholder="John Doe"
									value={newUserData.name}
									onChange={(e) =>
										setNewUserData({ ...newUserData, name: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="create-user-email">Email</Label>
								<Input
									id="create-user-email"
									type="email"
									placeholder="user@example.com"
									value={newUserData.email}
									onChange={(e) =>
										setNewUserData({ ...newUserData, email: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="create-user-password">Password</Label>
								<Input
									id="create-user-password"
									type="password"
									placeholder="••••••••"
									value={newUserData.password}
									onChange={(e) =>
										setNewUserData({ ...newUserData, password: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="role">Role</Label>
								<Select
									value={newUserData.role}
									onValueChange={(value: "user" | "admin") =>
										setNewUserData({ ...newUserData, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowCreateDialog(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateUser}
								disabled={createUserMutation.isPending}
							>
								{createUserMutation.isPending ? "Creating..." : "Create User"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
						<div className="text-muted-foreground text-sm">Total Users</div>
					</div>
					<div className="font-bold text-2xl">{pagination.totalItems}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<Shield className="h-4 w-4 text-muted-foreground" />
						<div className="text-muted-foreground text-sm">Admins</div>
					</div>
					<div className="font-bold text-2xl text-blue-600">{adminCount}</div>
				</div>
				<div className="rounded-lg border p-4">
					<div className="text-muted-foreground text-sm">Regular Users</div>
					<div className="font-bold text-2xl text-green-600">
						{pagination.totalItems - adminCount}
					</div>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={usersList}
				isLoading={isLoading}
				searchKey="name"
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>
		</div>
	);
}
