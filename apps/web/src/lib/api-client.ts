import type {
	Address,
	ApiError,
	Cart,
	Category,
	Coupon,
	Order,
	PaginatedResponse,
	Product,
	Review,
	Wishlist,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

class ApiClient {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	protected async request<T>(
		endpoint: string,
		options?: RequestInit,
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			credentials: "include", // Important for cookies
		});

		if (!response.ok) {
			const error: ApiError = await response.json();
			throw new Error(error.error || "Something went wrong");
		}

		return response.json();
	}

	// Products
	async getProducts(params?: {
		category?: string;
		search?: string;
		sort?: string;
		minPrice?: number;
		maxPrice?: number;
		page?: number;
		limit?: number;
	}): Promise<PaginatedResponse<Product>> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}
		return this.request(`/api/products?${queryParams.toString()}`);
	}

	async getProduct(id: string): Promise<Product> {
		return this.request(`/api/products/${id}`);
	}

	// Categories
	async getCategories(params?: {
		isActive?: boolean;
		parentCategory?: string;
		limit?: number;
		skip?: number;
	}): Promise<Category[]> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}
		return this.request(`/api/categories?${queryParams.toString()}`);
	}

	// Cart
	async getCart(): Promise<Cart> {
		return this.request("/api/cart");
	}

	async addToCart(productId: string, quantity: number): Promise<Cart> {
		return this.request("/api/cart/add", {
			method: "POST",
			body: JSON.stringify({ productId, quantity }),
		});
	}

	async updateCart(productId: string, quantity: number): Promise<Cart> {
		return this.request("/api/cart/update", {
			method: "POST",
			body: JSON.stringify({ productId, quantity }),
		});
	}

	async removeFromCart(productId: string): Promise<Cart> {
		return this.request("/api/cart/remove", {
			method: "POST",
			body: JSON.stringify({ productId }),
		});
	}

	async clearCart(): Promise<{ message: string }> {
		return this.request("/api/cart/clear", {
			method: "POST",
		});
	}

	// Orders
	async getOrders(): Promise<Order[]> {
		return this.request("/api/orders");
	}

	async getOrder(id: string): Promise<Order> {
		return this.request(`/api/orders/${id}`);
	}

	async createOrder(orderData: {
		items: Array<{
			productId: string;
			title: string;
			price: number;
			quantity: number;
			image: string;
		}>;
		subtotal: number;
		discount: number;
		total: number;
		paymentMethod: "card" | "upi" | "netbanking" | "cod";
		shippingAddress: Address;
		billingAddress: Address;
		couponCode?: string;
	}): Promise<Order> {
		return this.request("/api/orders", {
			method: "POST",
			body: JSON.stringify(orderData),
		});
	}

	// Addresses
	async getAddresses(): Promise<Address[]> {
		return this.request("/api/addresses");
	}

	async createAddress(
		address: Omit<Address, "_id" | "userId" | "createdAt" | "updatedAt">,
	): Promise<Address> {
		return this.request("/api/addresses", {
			method: "POST",
			body: JSON.stringify(address),
		});
	}

	async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
		return this.request(`/api/addresses/${id}`, {
			method: "PUT",
			body: JSON.stringify(address),
		});
	}

	async deleteAddress(id: string): Promise<{ message: string }> {
		return this.request(`/api/addresses/${id}`, {
			method: "DELETE",
		});
	}

	// Reviews
	async getProductReviews(productId: string): Promise<Review[]> {
		return this.request(`/api/reviews/product/${productId}`);
	}

	async createReview(review: {
		productId: string;
		rating: number;
		comment?: string;
		images?: string[];
	}): Promise<Review> {
		return this.request("/api/reviews", {
			method: "POST",
			body: JSON.stringify(review),
		});
	}

	async deleteReview(id: string): Promise<{ message: string }> {
		return this.request(`/api/reviews/${id}`, {
			method: "DELETE",
		});
	}

	// Wishlist
	async getWishlist(): Promise<Wishlist> {
		return this.request("/api/wishlist");
	}

	async toggleWishlist(productId: string): Promise<Wishlist> {
		return this.request("/api/wishlist/toggle", {
			method: "POST",
			body: JSON.stringify({ productId }),
		});
	}

	// Coupons
	async verifyCoupon(code: string): Promise<Coupon> {
		return this.request("/api/coupons/verify", {
			method: "POST",
			body: JSON.stringify({ code }),
		});
	}

	// Payments
	async createPaymentIntent(data: {
		amount: number;
		orderId: string;
		method?: "card" | "upi" | "netbanking" | "cod";
	}): Promise<{ clientSecret: string }> {
		return this.request("/api/payments/create-intent", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}
}

// Admin API Client (requires admin authentication)
class AdminApiClient extends ApiClient {
	// Products Management
	async createProduct(product: {
		title: string;
		description: string;
		price: number;
		category: string;
		coverImage: string;
		images?: string[];
		gender?: "unisex" | "men" | "women";
		rating?: { rate: number; count: number };
	}): Promise<Product> {
		return this.request("/api/products", {
			method: "POST",
			body: JSON.stringify(product),
		});
	}

	async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
		return this.request(`/api/products/${id}`, {
			method: "PUT",
			body: JSON.stringify(product),
		});
	}

	async deleteProduct(id: string): Promise<{ message: string }> {
		return this.request(`/api/products/${id}`, {
			method: "DELETE",
		});
	}

	async seedProducts(): Promise<{ message: string; count: number }> {
		return this.request("/api/products/seed", {
			method: "POST",
		});
	}

	// Categories Management
	async createCategory(category: {
		name: string;
		slug: string;
		description?: string;
		parentCategory?: string;
		coverImage?: string;
		isActive?: boolean;
	}): Promise<Category> {
		return this.request("/api/categories", {
			method: "POST",
			body: JSON.stringify(category),
		});
	}

	async updateCategory(
		id: string,
		category: Partial<Category>,
	): Promise<Category> {
		return this.request(`/api/categories/${id}`, {
			method: "PUT",
			body: JSON.stringify(category),
		});
	}

	async deleteCategory(id: string): Promise<{ message: string }> {
		return this.request(`/api/categories/${id}`, {
			method: "DELETE",
		});
	}

	async getCategory(id: string): Promise<Category> {
		return this.request(`/api/categories/${id}`);
	}

	async reorderCategories(
		updates: {
			id: string;
			displayOrder: number;
		}[],
	): Promise<{ message: string }> {
		return this.request("/api/categories/reorder", {
			method: "POST",
			body: JSON.stringify({ updates }),
		});
	}

	// Orders Management
	async getAllOrders(): Promise<Order[]> {
		return this.request("/api/orders/admin/all");
	}

	async updateOrderStatus(
		id: string,
		status:
			| "pending"
			| "confirmed"
			| "processing"
			| "shipped"
			| "delivered"
			| "cancelled",
	): Promise<Order> {
		return this.request(`/api/orders/${id}/status`, {
			method: "PUT",
			body: JSON.stringify({ status }),
		});
	}

	// Coupons Management
	async getAllCoupons(): Promise<Coupon[]> {
		return this.request("/api/coupons");
	}

	async getCoupon(id: string): Promise<Coupon> {
		return this.request(`/api/coupons/${id}`);
	}

	async createCoupon(coupon: {
		code: string;
		discountType: "percentage" | "fixed";
		discountValue: number;
		minPurchase?: number;
		maxDiscount?: number;
		startDate?: string;
		expiryDate?: string;
		usageLimit?: number;
		isActive?: boolean;
		description?: string;
	}): Promise<Coupon> {
		return this.request("/api/coupons", {
			method: "POST",
			body: JSON.stringify(coupon),
		});
	}

	async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
		return this.request(`/api/coupons/${id}`, {
			method: "PUT",
			body: JSON.stringify(coupon),
		});
	}

	async deleteCoupon(id: string): Promise<{ message: string }> {
		return this.request(`/api/coupons/${id}`, {
			method: "DELETE",
		});
	}

	// Images Management
	async getImages(params?: {
		usedFor?: "product" | "category" | "banner" | "other";
		page?: number;
		limit?: number;
	}): Promise<
		PaginatedResponse<{
			_id: string;
			title: string;
			url: string;
			usedFor: "product" | "category" | "banner" | "other";
			altText?: string;
			width?: number;
			height?: number;
			createdBy: string;
			updatedBy: string;
			createdAt: string;
			updatedAt: string;
		}>
	> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}
		return this.request(`/api/images?${queryParams.toString()}`);
	}

	async createImage(image: {
		title: string;
		url: string;
		usedFor: "product" | "category" | "banner" | "other";
		altText?: string;
		width?: number;
		height?: number;
	}): Promise<any> {
		return this.request("/api/images", {
			method: "POST",
			body: JSON.stringify(image),
		});
	}

	async updateImage(id: string, image: Partial<any>): Promise<any> {
		return this.request(`/api/images/${id}`, {
			method: "PUT",
			body: JSON.stringify(image),
		});
	}

	async deleteImage(id: string): Promise<{ message: string }> {
		return this.request(`/api/images/${id}`, {
			method: "DELETE",
		});
	}

	async getUploadSignature(folder?: string): Promise<{
		signature: string;
		timestamp: number;
		cloudName: string;
		apiKey: string;
		folder: string;
	}> {
		return this.request("/api/images/upload-signature", {
			method: "POST",
			body: JSON.stringify({ folder: folder || "ecommerce" }),
		});
	}
}

export const apiClient = new ApiClient(API_URL);
export const adminApiClient = new AdminApiClient(API_URL);
