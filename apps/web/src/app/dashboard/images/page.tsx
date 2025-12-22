"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useImagesQuery } from "@/hooks/use-images";
import { createColumns } from "./columns";
import { ImagesDataTable } from "./data-table";

export default function ImagesPage() {
	const { data: images, isLoading } = useImagesQuery();

	const columns = React.useMemo(() => createColumns(), []);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-xl tracking-tight md:text-2xl">
						Images
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage uploaded images
					</p>
				</div>
				<Link href="/dashboard/images/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Upload Image
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<ImagesDataTable columns={columns} data={images || []} />
			)}
		</div>
	);
}
