export interface Product {
	id: string;
	title: string;
	price: number;
	image: string;
	category: string;
	description: string;
}

export const products: Product[] = [
	{
		id: "1",
		title: "Ethereal Gold Necklace",
		price: 1250,
		image:
			"https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
		category: "necklaces",
		description:
			"A stunning gold necklace that captures the essence of elegance.",
	},
	{
		id: "2",
		title: "Diamond Solitaire Ring",
		price: 3400,
		image:
			"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
		category: "rings",
		description:
			"A classic diamond solitaire ring, perfect for special occasions.",
	},
	{
		id: "3",
		title: "Pearl Drop Earrings",
		price: 890,
		image:
			"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
		category: "earrings",
		description:
			"Elegant pearl drop earrings that add a touch of sophistication.",
	},
	{
		id: "4",
		title: "Gold Cuff Bracelet",
		price: 1500,
		image:
			"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
		category: "bracelets",
		description: "A bold gold cuff bracelet that makes a statement.",
	},
	{
		id: "5",
		title: "Sapphire Pendant",
		price: 2100,
		image:
			"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
		category: "necklaces",
		description: "A deep blue sapphire pendant set in white gold.",
	},
	{
		id: "6",
		title: "Emerald Studs",
		price: 1800,
		image:
			"https://images.unsplash.com/photo-1589674781759-c21c37956311?q=80&w=2070&auto=format&fit=crop",
		category: "earrings",
		description: "Vibrant emerald stud earrings for a pop of color.",
	},
	{
		id: "7",
		title: "Rose Gold Band",
		price: 950,
		image:
			"https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=2080&auto=format&fit=crop",
		category: "rings",
		description: "A delicate rose gold band with intricate detailing.",
	},
	{
		id: "8",
		title: "Silver Charm Bracelet",
		price: 650,
		image:
			"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop",
		category: "bracelets",
		description: "A sterling silver bracelet ready for your favorite charms.",
	},
];
