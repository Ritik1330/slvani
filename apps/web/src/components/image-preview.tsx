"use client";

import Image from "next/image";
import * as React from "react";
import { adminApiClient } from "@/lib/api-client";

interface ImagePreviewProps {
	imageId: string;
}

export function ImagePreview({ imageId }: ImagePreviewProps) {
	const [imageUrl, setImageUrl] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchImage = async () => {
			try {
				setLoading(true);
				const response = await adminApiClient.getImages({ limit: 1000 });
				const image = response.data.find((img) => img._id === imageId);
				if (image) {
					setImageUrl(image.url);
				}
			} catch (error) {
				console.error("Failed to fetch image:", error);
			} finally {
				setLoading(false);
			}
		};

		if (imageId) {
			fetchImage();
		}
	}, [imageId]);

	if (loading) {
		return (
			<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-muted">
				<div className="flex h-full items-center justify-center text-muted-foreground text-xs">
					...
				</div>
			</div>
		);
	}

	if (!imageUrl) {
		return (
			<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-muted">
				<div className="flex h-full items-center justify-center text-muted-foreground text-xs">
					No preview
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border">
			<Image
				src={imageUrl}
				alt="Image preview"
				fill
				className="object-cover"
				onError={() => setImageUrl(null)}
			/>
		</div>
	);
}
