import React, { useState } from 'react';
import { X, Star, ShoppingCart, Zap, ShieldCheck, RotateCcw, Truck, Plus, Minus, Heart } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const currentPrice = product.discountPrice ?? product.price;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery Side */}
          <div className="relative bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 w-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition duration-300"
            />
            {product.discountPrice && (
              <span className="absolute top-6 left-6 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
              </span>
            )}
          </div>

          {/* Product Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Stock */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                  {product.category}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOutOfStock 
                    ? 'bg-rose-100 text-rose-700' 
                    : product.stock < 5 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isOutOfStock 
                    ? (lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock')
                    : (lang === 'bn' ? `স্টক আছে: ${product.stock} টি` : `In Stock: ${product.stock}`)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 leading-tight">
                {lang === 'bn' ? product.titleBn : product.title}
              </h2>

              {/* SKU & Ratings */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                <span>SKU: <strong className="font-mono text-slate-700">{product.sku}</strong></span>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span>({product.reviewsCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-emerald-700">
                  ৳{(currentPrice * quantity).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ৳{(product.price * quantity).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-slate-400">({product.unit})</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {lang === 'bn' ? product.descriptionBn : product.description}
              </p>
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">
                  {lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={handleDecrease}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock || isOutOfStock}
                    onClick={handleIncrease}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ml-auto ${
                    isWishlisted ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={lang === 'bn' ? 'পছন্দের তালিকায় যোগ' : 'Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>

                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? '১০০% আসল প্রোডাক্ট' : '100% Original'}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-teal-600" />
                  <span>{lang === 'bn' ? 'দ্রুত হোম ডেলিভারি' : 'Fast Delivery'}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-cyan-600" />
                  <span>{lang === 'bn' ? '৭ দিনের রিটার্ন পলিসি' : '7 Days Return'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
