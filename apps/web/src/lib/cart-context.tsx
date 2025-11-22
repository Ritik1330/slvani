"use client";

import type { Product } from "@/lib/data";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem extends Product {
	quantity: number;
}

interface CartContextType {
	items: CartItem[];
	addItem: (product: Product) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	cartCount: number;
	cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load cart from local storage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			try {
				setItems(JSON.parse(savedCart));
			} catch (error) {
				console.error("Failed to parse cart from local storage", error);
			}
		}
		setIsInitialized(true);
	}, []);

	// Save cart to local storage whenever it changes
	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem("cart", JSON.stringify(items));
		}
	}, [items, isInitialized]);

	const addItem = (product: Product) => {
		setItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.id === product.id);
			if (existingItem) {
				return prevItems.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prevItems, { ...product, quantity: 1 }];
		});
		toast.success(`Added ${product.title} to cart`);
	};

	const removeItem = (productId: string) => {
		setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
		toast.info("Item removed from cart");
	};

	const updateQuantity = (productId: string, quantity: number) => {
		if (quantity < 1) {
			removeItem(productId);
			return;
		}
		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === productId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setItems([]);
		localStorage.removeItem("cart");
	};

	const cartCount = items.reduce((total, item) => total + item.quantity, 0);
	const cartTotal = items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	return (
		<CartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				cartCount,
				cartTotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
