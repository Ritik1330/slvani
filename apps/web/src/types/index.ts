import type {
	IAddress,
	ICart,
	ICartItem,
	ICategory,
	ICoupon,
	IOrder,
	IOrderAddress,
	IOrderItem,
	IProduct,
	IReview,
	IWishlist,
} from "@ecommerce/db";

// Convert Date to string for JSON serialization
type DateToString<T> = {
	[K in keyof T]: T[K] extends Date
		? string
		: T[K] extends Date | undefined
			? string | undefined
			: T[K];
};

// Product Types
export type Product = DateToString<Omit<IProduct, "category">> & {
	category: string | Category;
};

// Category Types
export type Category = DateToString<Omit<ICategory, "parentCategory">> & {
	parentCategory?: string | Category;
};

// Address Types
export type Address = DateToString<IAddress>;

// Cart Types
export type CartItem = ICartItem & {
	price: number;
	title: string;
	coverImage: string;
	category: string;
};

export type Cart = Omit<DateToString<ICart>, "items"> & {
	items: CartItem[];
};

// Order Types
export type OrderItem = IOrderItem;
export type OrderAddress = IOrderAddress;
export type Order = DateToString<IOrder>;

// Review Types
export type Review = DateToString<IReview>;

// Wishlist Types
export type Wishlist = DateToString<IWishlist>;

// Coupon Types
export type Coupon = DateToString<Omit<ICoupon, "isValid">>;

// API Response Types
export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

export interface ApiError {
	status: number;
	error: string;
}
