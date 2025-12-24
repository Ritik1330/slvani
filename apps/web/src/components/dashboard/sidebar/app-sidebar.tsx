"use client";

import {
	Command,
	CreditCard,
	Frame,
	Heart,
	Image as ImageIcon,
	LayoutGrid,
	LifeBuoy,
	Map as MapIcon,
	MessageSquare,
	Package,
	PieChart,
	Send,
	ShoppingBag,
	ShoppingCart,
	Ticket,
	Users,
} from "lucide-react";
import type * as React from "react";
import { NavUser } from "@/components/dashboard/nav-user";
import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavProjects } from "@/components/dashboard/sidebar/nav-projects";
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Categories",
			url: "/dashboard/categories",
			icon: LayoutGrid,
			items: [
				{
					title: "All Categories",
					url: "/dashboard/categories",
				},
				{
					title: "Add New",
					url: "/dashboard/categories/new",
				},
			],
		},
		{
			title: "Products",
			url: "/dashboard/products",
			icon: Package,
			items: [
				{
					title: "All Products",
					url: "/dashboard/products",
				},
				{
					title: "Add New",
					url: "/dashboard/products/new",
				},
			],
		},
		{
			title: "Coupons",
			url: "/dashboard/coupons",
			icon: Ticket,
			items: [
				{
					title: "All Coupons",
					url: "/dashboard/coupons",
				},
				{
					title: "Add New",
					url: "/dashboard/coupons/new",
				},
			],
		},
		{
			title: "Orders",
			url: "/dashboard/orders",
			icon: ShoppingBag,
			items: [
				{
					title: "All Orders",
					url: "/dashboard/orders",
				},
			],
		},
		{
			title: "Payments",
			url: "/dashboard/payments",
			icon: CreditCard,
			items: [
				{
					title: "All Payments",
					url: "/dashboard/payments",
				},
			],
		},
		{
			title: "Reviews",
			url: "/dashboard/reviews",
			icon: MessageSquare,
			items: [
				{
					title: "All Reviews",
					url: "/dashboard/reviews",
				},
			],
		},
		{
			title: "Wishlist",
			url: "/dashboard/wishlist",
			icon: Heart,
			items: [
				{
					title: "All Wishlists",
					url: "/dashboard/wishlist",
				},
			],
		},
		{
			title: "Carts",
			url: "/dashboard/carts",
			icon: ShoppingCart,
			items: [
				{
					title: "All Carts",
					url: "/dashboard/carts",
				},
			],
		},
		{
			title: "Users",
			url: "/dashboard/admin/users",
			icon: Users,
			items: [
				{
					title: "All Users",
					url: "/dashboard/admin/users",
				},
			],
		},
		{
			title: "Images",
			url: "/dashboard/images",
			icon: ImageIcon,
			items: [
				{
					title: "All Images",
					url: "/dashboard/images",
				},
				{
					title: "Upload",
					url: "/dashboard/images/new",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Acme Inc</span>
									<span className="truncate text-xs">Enterprise</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
