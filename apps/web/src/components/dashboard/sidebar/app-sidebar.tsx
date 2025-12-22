"use client";

import {
	Command,
	Frame,
	LayoutGrid,
	LifeBuoy,
	Map as MapIcon,
	Megaphone,
	Monitor,
	PieChart,
	Send,
	Tag,
	Ticket,
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
			isActive: true,
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
			title: "Campaigns",
			url: "/dashboard/campaigns",
			icon: Megaphone,
			items: [
				{
					title: "All Campaigns",
					url: "/dashboard/campaigns",
				},
				{
					title: "Add New",
					url: "/dashboard/campaigns/new",
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
			title: "Deals",
			url: "/dashboard/deals",
			icon: Tag,
			items: [
				{
					title: "All Deals",
					url: "/dashboard/deals",
				},
				{
					title: "Add New",
					url: "/dashboard/deals/new",
				},
			],
		},
		{
			title: "Ads",
			url: "/dashboard/ads",
			icon: Monitor,
			items: [
				{
					title: "All Ads",
					url: "/dashboard/ads",
				},
				{
					title: "Add New",
					url: "/dashboard/ads/new",
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
