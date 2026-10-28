import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User as UserIcon, 
  ShieldCheck, 
  Store, 
  PhoneCall, 
  Truck, 
  Sparkles,
  Smartphone,
  Shirt,
  Apple,
  Home,
  CheckCircle2,
  X
} from 'lucide-react';
import { CategoryType, Language, Product, User } from '../types';
import { CATEGORIES } from '../data/initialData';
import { RatulShopLogo } from './RatulShopLogo';

interface NavbarProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  lang: Language;
  onToggleLang: () => void;
  currentView: 'shop' | 'admin' | 'profile' | 'wishlist';
  onNavigate: (view: 'shop' | 'admin' | 'profile' | 'wishlist') => void;
  user: User;
  allProducts: Product[];
  onQuickView: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  lang,
  onToggleLang,
  currentView,
  onNavigate,
  user,
  allProducts,
  onQuickView
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter products for instant search preview
  const searchSuggestions = searchQuery.trim().length > 1
    ? allProducts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.titleBn.includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const getCategoryIcon = (iconName: string) => {
    switch(iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Shirt': return <Shirt className="w-4 h-4" />;
      case 'Apple': return <Apple className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>
              {lang === 'bn' 
                ? 'Ratul Shop এ স্বাগতম! ১০০+ ভেরিফায়েড প্রোডাক্ট ও ৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি!' 
                : 'Welcome to Ratul Shop! 100+ verified items & free nationwide shipping over ৳1000!'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100">
            <span className="hidden sm:inline-flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> হেল্পলাইন: 01712-345678
            </span>
            <div className="flex items-center gap-2 border-l border-emerald-500/50 pl-3">
              <button 
                onClick={onToggleLang} 
                className="hover:text-white font-medium transition cursor-pointer px-1.5 py-0.5 rounded bg-emerald-800/40 border border-emerald-400/30 text-[11px]"
              >
                {lang === 'bn' ? 'English' : 'বাংলা'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Ratul Shop Brand Logo */}
        <button 
          onClick={() => onNavigate('shop')}
          className="cursor-pointer focus:outline-none"
        >
          <RatulShopLogo size="md" showTagline={true} />
        </button>

        {/* Live Search Bar */}
        <div className="relative flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={lang === 'bn' ? 'প্রোডাক্ট খুঁজুন... (যেমন: হেডফোন, মধু, পাঞ্জাবি)' : 'Search products by name, SKU...'}
              className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm pl-10 pr-9 py-2 sm:py-2.5 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-medium flex justify-between">
                <span>{lang === 'bn' ? 'অনুসন্ধানের ফলাফল' : 'Quick Results'}</span>
                <button 
                  onClick={() => setShowSearchDropdown(false)} 
                  className="text-slate-400 hover:text-slate-700"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onQuickView(prod);
                      setShowSearchDropdown(false);
                    }}
                    className="p-2.5 flex items-center gap-3 hover:bg-emerald-50/60 cursor-pointer transition"
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {lang === 'bn' ? prod.titleBn : prod.title}
                      </p>
                      <p className="text-[11px] text-slate-500">SKU: {prod.sku} • {prod.stock > 0 ? (
                        <span className="text-emerald-600 font-medium">
                          {lang === 'bn' ? `স্টক: ${prod.stock}` : `Stock: ${prod.stock}`}
                        </span>
                      ) : (
                        <span className="text-rose-500">{lang === 'bn' ? 'স্টক শেষ' : 'Out of stock'}</span>
                      )}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-700">
                        ৳{prod.discountPrice ?? prod.price}
                      </p>
                      {prod.discountPrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          ৳{prod.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin / Shop Mode Switch */}
          <button
            onClick={() => onNavigate(currentView === 'admin' ? 'shop' : 'admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              currentView === 'admin'
                ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400/40'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
            }`}
            title={lang === 'bn' ? 'এডমিন ইনভেন্টরি কন্ট্রোল' : 'Admin Inventory Panel'}
          >
            {currentView === 'admin' ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'শপে ফিরুন' : 'Back to Shop'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'এডমিন প্যানেল' : 'Admin Panel'}</span>
              </>
            )}
          </button>

          {/* User Profile / Account */}
          <button
            onClick={() => onNavigate(currentView === 'profile' ? 'shop' : 'profile')}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              currentView === 'profile'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={lang === 'bn' ? 'আমার প্রোফাইল ও অর্ডার' : 'My Profile & Orders'}
          >
            <UserIcon className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-medium hidden md:inline truncate max-w-[80px]">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className={`relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer ${
              currentView === 'wishlist' ? 'bg-rose-50 border-rose-300 text-rose-600' : ''
            }`}
            title={lang === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-scale">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-emerald-600">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-emerald-100 font-medium">
                {lang === 'bn' ? 'কার্ট' : 'Cart'}
              </span>
              <span className="text-xs font-bold">
                ৳{cartTotal.toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scrolling Pill Bar */}
      {currentView === 'shop' && (
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as CategoryType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-emerald-200" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
