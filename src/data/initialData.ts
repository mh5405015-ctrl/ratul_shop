import { Product, User } from '../types';
import { PRODUCTS_100 } from './products100';

export const INITIAL_PRODUCTS: Product[] = PRODUCTS_100;

export const INITIAL_USER: User = {
  id: 'usr-101',
  name: 'মাহমুদুল হাসান রাতুল',
  email: 'mh5405015@gmail.com',
  phone: '01712345678',
  address: 'বাড়ি ১২, রোড ৫, ধানমন্ডি',
  city: 'ঢাকা (Dhaka)',
  role: 'customer'
};

export const INITIAL_COUPONS: Record<string, { discountPercent?: number; flatDiscount?: number; minOrder: number }> = {
  'RATUL10': { discountPercent: 10, minOrder: 1000 },
  'RATUL500': { flatDiscount: 500, minOrder: 3000 },
  'AMAR10': { discountPercent: 10, minOrder: 1000 },
  'EID500': { flatDiscount: 500, minOrder: 3000 },
  'WELCOME': { discountPercent: 15, minOrder: 800 }
};

export const CATEGORIES = [
  { id: 'all', nameBn: 'সব প্রোডাক্ট (১০০)', nameEn: 'All Products (100)', icon: 'Sparkles' },
  { id: 'electronics', nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট (২০)', nameEn: 'Electronics (20)', icon: 'Smartphone' },
  { id: 'fashion', nameBn: 'ফ্যাশন ও লাইফস্টাইল (২০)', nameEn: 'Fashion (20)', icon: 'Shirt' },
  { id: 'groceries', nameBn: 'খাঁটি গ্রোসারি ও ফুড (২০)', nameEn: 'Groceries (20)', icon: 'Apple' },
  { id: 'beauty', nameBn: 'রূপচর্চা ও প্রসাধনী (২০)', nameEn: 'Beauty & Care (20)', icon: 'Heart' },
  { id: 'home', nameBn: 'হোম ও কিচেন অ্যাপ্লায়েন্স (২০)', nameEn: 'Home & Kitchen (20)', icon: 'Home' }
];
