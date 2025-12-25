"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

interface UserMenuProps {
	customTrigger?: React.ReactNode;
}

export default function UserMenu({ customTrigger }: UserMenuProps) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		if (customTrigger) {
			return <Link href="/login">{customTrigger}</Link>;
		}
		return (
			<Button
				variant="outline"
				asChild
				className="h-10 w-10 px-0 md:h-10 md:w-auto md:px-4"
			>
				<Link href="/login">
					<User className="h-5 w-5 md:hidden" />
					<span className="hidden md:inline">Sign In</span>
				</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{customTrigger || (
					<Button
						variant="outline"
						className="h-10 w-10 px-0 md:h-10 md:w-auto md:px-4"
					>
						<User className="h-5 w-5 md:hidden" />
						<span className="hidden md:inline">{session.user.name}</span>
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-card" align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>{session.user.email}</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Button
						variant="destructive"
						className="w-full"
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										router.push("/");
									},
								},
							});
						}}
					>
						Sign Out
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
