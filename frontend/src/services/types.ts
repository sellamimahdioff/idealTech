export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  parent?: Category | null;
  children?: Category[];
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  retail_price: number;
  wholesale_price?: number;
  wholesale_min_qty?: number;
  stock_quantity: number;
  category?: Category;
  images: string[];
  created_at: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'order' | 'quote';

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  shipping_address?: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}
export interface Review {
  id: number;
  author_name: string;
  author_email: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
  product?: Product;
}