import React from 'react';
import { ShoppingCart, Star, Heart, Eye, Check } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
  isInCart = false,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
          </span>
        )}
        {isLowStock && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {lang === 'bn' ? `মাত্র ${product.stock} টি বাকি` : `Only ${product.stock} left`}
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
          </span>
        )}
        {product.isFeatured && !discountPercent && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {lang === 'bn' ? 'স্পেশাল' : 'Featured'}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs transition cursor-pointer"
        title={lang === 'bn' ? 'পছন্দ তালিকায় যুক্ত করুন' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition ${
            isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Image Container with Quick View Button */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative pt-[80%] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 hover:bg-white hover:text-emerald-700 transition transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="uppercase font-medium tracking-wider">{product.category}</span>
            <span className="font-mono">{product.sku}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-slate-800 hover:text-emerald-700 line-clamp-2 cursor-pointer transition mb-2"
          >
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
              ৳{(product.discountPrice ?? product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-slate-400 ml-auto">/{product.unit}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="py-2 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ভিউ' : 'View'}</span>
            </button>

            <button
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product)}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/20'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'যোগ হয়েছে' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অর্ডার' : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
