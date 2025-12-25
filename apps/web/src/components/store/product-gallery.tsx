"use client";

import Image from "next/image";
import * as React from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductGalleryProps {
	product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
	// Extract cover image URL
	const coverImageUrl =
		typeof product.coverImage === "string"
			? product.coverImage
			: product.coverImage?.url || "";

	// Extract additional images URLs
	const additionalImages =
		product.images?.map((img) =>
			typeof img === "string" ? img : img?.url || "",
		) || [];

	// Combine cover image + additional images
	const allImages = [coverImageUrl, ...additionalImages].filter(Boolean);

	// Carousel API state
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	// Navigate to slide when thumbnail is clicked
	const handleThumbnailClick = (index: number) => {
		if (api) {
			api.scrollTo(index);
		}
	};

	if (allImages.length === 0) {
		return (
			<div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
				<div className="flex h-full w-full items-center justify-center text-muted-foreground">
					No images available
				</div>
			</div>
		);
	}

	// If only one image, show it without carousel
	if (allImages.length === 1) {
		return (
			<div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
				<Image
					src={allImages[0]}
					alt={product.title}
					fill
					className="object-cover object-center"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority
				/>
			</div>
		);
	}

	// Multiple images - show carousel
	return (
		<div className="flex flex-col gap-4">
			<div className="relative">
				<Carousel className="w-full" setApi={setApi}>
					<CarouselContent>
						{allImages.map((imageUrl, index) => (
							<CarouselItem key={`slide-${imageUrl}`}>
								<div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
									<Image
										src={imageUrl}
										alt={`${product.title} - Image ${index + 1}`}
										fill
										className="object-cover object-center"
										sizes="(max-width: 768px) 100vw, 50vw"
										priority={index === 0}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-2 hidden md:flex" />
					<CarouselNext className="right-2 hidden md:flex" />
				</Carousel>

				{/* Mobile Dots Only Overlaid on Image? Or separate? Let's use thumbnails for mobile too or dots. 
					Thumbnails below are good. Let's stick to thumbnails for all sizes as it is safer. 
					Just indicator text overlay for mobile usually looks nice or dots.
					Let's add dots overlay for mobile as user said "mobile carousel".
				*/}
				<div className="absolute right-0 bottom-2 left-0 flex justify-center gap-1 md:hidden">
					{allImages.map((imageUrl, index) => (
						<div
							key={`dot-${imageUrl}`}
							className={cn(
								"h-1.5 w-1.5 rounded-full ring-1 ring-white/50 transition-all",
								index === current ? "w-3 bg-white" : "bg-white/50",
							)}
						/>
					))}
				</div>
			</div>

			{/* Thumbnails */}
			<div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
				{allImages.map((imageUrl, index) => (
					<button
						type="button"
						key={`thumb-${imageUrl}`}
						onClick={() => handleThumbnailClick(index)}
						className={cn(
							"relative h-20 w-20 shrink-0 overflow-hidden rounded-md border transition-all hover:opacity-100",
							index === current
								? "border-primary ring-2 ring-primary ring-offset-1"
								: "border-transparent opacity-70",
						)}
					>
						<Image
							src={imageUrl}
							alt={`Thumbnail ${index + 1}`}
							fill
							className="object-cover object-center"
							sizes="80px"
						/>
					</button>
				))}
			</div>
		</div>
	);
}
