"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	ArrowUpDown,
	Ban,
	Key,
	Shield,
	ShieldOff,
	Trash,
	UserX,
} from "lucide-react";
import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface User {
	id: string;
	name: string;
	email: string;
	role?: string;
	image?: string | null;
	createdAt: string | Date;
	emailVerified: boolean;
	banned?: boolean | null;
}

export const createColumns = (
	onSetAdmin: (userId: string) => void,
	onRemoveAdmin: (userId: string) => void,
	onResetPassword: (userId: string, newPassword: string) => void,
	onBanUser: (userId: string, reason: string, expiresIn: number) => void,
	onUnbanUser: (userId: string) => void,
	onDeleteUser: (userId: string) => void,
): ColumnDef<User>[] => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					type="button"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					type="button"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("email")}</div>,
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue("role") as string | undefined;
			return role === "admin" ? (
				<Badge variant="default">Admin</Badge>
			) : (
				<Badge variant="secondary">User</Badge>
			);
		},
	},
	{
		accessorKey: "emailVerified",
		header: "Verified",
		cell: ({ row }) => {
			const verified = row.getValue("emailVerified") as boolean;
			return verified ? (
				<Badge variant="default" className="bg-green-600">
					Verified
				</Badge>
			) : (
				<Badge variant="secondary">Not Verified</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as string;
			return format(new Date(date), "PPP");
		},
	},
	{
		accessorKey: "banned",
		header: "Status",
		cell: ({ row }) => {
			const banned = row.getValue("banned") as boolean;
			return banned ? (
				<Badge variant="destructive">Banned</Badge>
			) : (
				<Badge variant="default" className="bg-green-600">
					Active
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original;
			const [showAdminDialog, setShowAdminDialog] = React.useState(false);
			const [showRemoveAdminDialog, setShowRemoveAdminDialog] =
				React.useState(false);
			const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
			const [showBanDialog, setShowBanDialog] = React.useState(false);
			const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
			const [newPassword, setNewPassword] = React.useState("");
			const [banReason, setBanReason] = React.useState("");
			const [banDays, setBanDays] = React.useState(7);
			const isAdmin = user.role === "admin";
			const isBanned = user.banned;

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button type="button" variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<span className="text-lg">⋮</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{isAdmin ? (
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										setShowRemoveAdminDialog(true);
									}}
								>
									<ShieldOff className="mr-2 h-4 w-4" />
									Remove Admin
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										setShowAdminDialog(true);
									}}
								>
									<Shield className="mr-2 h-4 w-4" />
									Make Admin
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
									setShowPasswordDialog(true);
								}}
							>
								<Key className="mr-2 h-4 w-4" />
								Reset Password
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{isBanned ? (
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										onUnbanUser(user.id);
									}}
								>
									<UserX className="mr-2 h-4 w-4" />
									Unban User
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										setShowBanDialog(true);
									}}
								>
									<Ban className="mr-2 h-4 w-4" />
									Ban User
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onSelect={(e) => {
									e.preventDefault();
									setShowDeleteDialog(true);
								}}
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete User
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Make Admin Dialog */}
					<AlertDialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Make Admin</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to make "{user.name}" an admin? They
									will have full access to all admin features.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onSetAdmin(user.id);
										setShowAdminDialog(false);
									}}
								>
									Make Admin
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Remove Admin Dialog */}
					<AlertDialog
						open={showRemoveAdminDialog}
						onOpenChange={setShowRemoveAdminDialog}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to remove admin access from "{user.name}
									"? They will lose access to all admin features.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onRemoveAdmin(user.id);
										setShowRemoveAdminDialog(false);
									}}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Remove Admin
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Reset Password Dialog */}
					<Dialog
						open={showPasswordDialog}
						onOpenChange={setShowPasswordDialog}
					>
						<DialogContent
							onOpenAutoFocus={(e) => {
								e.preventDefault();
								const input = document.getElementById(
									`newPassword-${user.id}`,
								) as HTMLInputElement;
								if (input) {
									setTimeout(() => input.focus(), 0);
								}
							}}
						>
							<DialogHeader>
								<DialogTitle>Reset Password</DialogTitle>
								<DialogDescription>
									Set a new password for "{user.name}".
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor={`newPassword-${user.id}`}>New Password</Label>
									<Input
										id={`newPassword-${user.id}`}
										type="password"
										placeholder="Enter new password (min 8 characters)"
										value={newPassword}
										onChange={(e) => {
											e.stopPropagation();
											setNewPassword(e.target.value);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												e.stopPropagation();
												if (newPassword && newPassword.length >= 8) {
													onResetPassword(user.id, newPassword);
													setShowPasswordDialog(false);
													setNewPassword("");
												}
											}
										}}
										minLength={8}
										autoComplete="new-password"
									/>
									<p className="text-muted-foreground text-xs">
										Password must be at least 8 characters long
									</p>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setShowPasswordDialog(false);
										setNewPassword("");
									}}
								>
									Cancel
								</Button>
								<Button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (!newPassword) {
											alert("Please enter a password");
											return;
										}
										if (newPassword.length < 8) {
											alert("Password must be at least 8 characters long");
											return;
										}
										console.log("Resetting password for user:", user.id);
										onResetPassword(user.id, newPassword);
										setShowPasswordDialog(false);
										setNewPassword("");
									}}
									disabled={!newPassword || newPassword.length < 8}
								>
									Reset Password
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Ban User Dialog */}
					<Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Ban User</DialogTitle>
								<DialogDescription>
									Ban "{user.name}" from accessing the platform.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor={`banReason-${user.id}`}>Reason</Label>
									<Textarea
										id={`banReason-${user.id}`}
										placeholder="Enter ban reason"
										value={banReason}
										onChange={(e) => setBanReason(e.target.value)}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor={`banDays-${user.id}`}>
										Ban Duration (days)
									</Label>
									<Input
										id={`banDays-${user.id}`}
										type="number"
										min="1"
										value={banDays}
										onChange={(e) => setBanDays(Number(e.target.value))}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowBanDialog(false);
										setBanReason("");
										setBanDays(7);
									}}
								>
									Cancel
								</Button>
								<Button
									type="button"
									variant="destructive"
									onClick={() => {
										const expiresIn = banDays * 24 * 60 * 60;
										onBanUser(user.id, banReason, expiresIn);
										setShowBanDialog(false);
										setBanReason("");
										setBanDays(7);
									}}
								>
									Ban User
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Delete User Dialog */}
					<AlertDialog
						open={showDeleteDialog}
						onOpenChange={setShowDeleteDialog}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete User</AlertDialogTitle>
								<AlertDialogDescription>
									Are you absolutely sure? This will permanently delete "
									{user.name}" and all associated data. This action cannot be
									undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onDeleteUser(user.id);
										setShowDeleteDialog(false);
									}}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete User
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			);
		},
	},
];
