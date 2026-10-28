import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';
import { CartItem, Language } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  lang: Language;
  onProceedToCheckout: (appliedDiscount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang,
  onProceedToCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Calculate discount based on active coupon
  let discount = 0;
  if (couponCode && INITIAL_COUPONS[couponCode]) {
    const coupon = INITIAL_COUPONS[couponCode];
    if (subtotal >= coupon.minOrder) {
      if (coupon.discountPercent) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
      } else if (coupon.flatDiscount) {
        discount = coupon.flatDiscount;
      }
    }
  }

  // Delivery fee rule: Free if subtotal > 1000, else 60
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (!INITIAL_COUPONS[code]) {
      setCouponError(lang === 'bn' ? 'অকার্যকর কুপন কোড! চেষ্টা করুন: RATUL10' : 'Invalid coupon code! Try: RATUL10');
      setCouponSuccess('');
      return;
    }

    const c = INITIAL_COUPONS[code];
    if (subtotal < c.minOrder) {
      setCouponError(
        lang === 'bn'
          ? `এই কুপনের জন্য ন্যূনতম ৳${c.minOrder} টাকার অর্ডার প্রয়োজন!`
          : `Minimum order ৳${c.minOrder} required for this coupon!`
      );
      setCouponSuccess('');
      return;
    }

    setCouponCode(code);
    setCouponError('');
    setCouponSuccess(lang === 'bn' ? 'কুপন সফলভাবে যুক্ত হয়েছে!' : 'Coupon applied successfully!');
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout(discount, couponCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {lang === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
              </h2>
              <p className="text-xs text-slate-500">
                {cart.length} {lang === 'bn' ? 'টি আইটেম সিলেক্টেড' : 'items selected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition cursor-pointer"
                title={lang === 'bn' ? 'কার্ট খালি করুন' : 'Clear Cart'}
              >
                {lang === 'bn' ? 'খালি করুন' : 'Clear'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content - Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-700">
                  {lang === 'bn' ? 'আপনার কার্ট খালি!' : 'Your cart is empty!'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {lang === 'bn' 
                    ? 'আপনার পছন্দের পণ্যগুলো কার্টে যুক্ত করে সহজে অর্ডার সম্পন্ন করুন।'
                    : 'Explore our catalog and add items you love to your cart.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.product.discountPrice ?? item.product.price;
              const itemTotal = unitPrice * item.quantity;
              return (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {lang === 'bn' ? item.product.titleBn : item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SKU: {item.product.sku}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-emerald-700">
                        ৳{unitPrice.toLocaleString()}
                      </span>
                      {item.product.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ৳{item.product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= item.product.stock}
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-700 ml-auto">
                        ৳{itemTotal.toLocaleString()}
                      </span>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title={lang === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
            {/* Promo / Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={lang === 'bn' ? 'কুপন কোড (যেমন: RATUL10)' : 'Coupon code (e.g. RATUL10)'}
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 uppercase outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{lang === 'bn' ? `ডিসকাউন্ট (${couponCode}):` : `Discount (${couponCode}):`}</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {lang === 'bn' ? 'ফ্রি' : 'FREE'}
                    </span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>{lang === 'bn' ? 'সর্বমোট (টাকা):' : 'Grand Total:'}</span>
                <span className="text-emerald-700 text-base">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <span>{lang === 'bn' ? 'চেকআউট করুন' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
