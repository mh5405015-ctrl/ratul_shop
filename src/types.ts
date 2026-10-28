export type CategoryType = 'all' | 'electronics' | 'fashion' | 'groceries' | 'beauty' | 'home';

export interface Product {
  id: string;
  sku: string;
  title: string;
  titleBn: string;
  category: CategoryType;
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  descriptionBn: string;
  unit: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cod';
export type PaymentStatus = 'paid' | 'pending';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: 'customer' | 'admin';
}

export type Language = 'bn' | 'en';
