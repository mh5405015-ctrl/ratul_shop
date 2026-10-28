import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Heart, 
  Edit3, 
  Save, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { User, Order, Product, Language } from '../types';

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  orders: Order[];
  wishlist: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onViewOrderInvoice: (order: Order) => void;
  lang: Language;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateUser,
  orders,
  wishlist,
  onAddToCart,
  onRemoveFromWishlist,
  onViewOrderInvoice,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<User>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profileForm);
    setIsEditingProfile(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {lang === 'bn' ? 'ডেলিভার্ড সম্পন্ন' : 'Delivered'}</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Package className="w-3 h-3" /> {lang === 'bn' ? 'ডেলিভারির পথে' : 'Shipped'}</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> {lang === 'bn' ? 'প্রসেসিং হচ্ছে' : 'Processing'}</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{lang === 'bn' ? 'বাতিল' : 'Cancelled'}</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{lang === 'bn' ? 'পেন্ডিং' : 'Pending'}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 text-3xl font-extrabold shadow-inner shrink-0">
          {user.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {lang === 'bn' ? 'ভেরিফায়েড কাস্টমার' : 'Verified Customer'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-100/80">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.city}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('profile');
              setIsEditingProfile(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'bn' ? 'আপনার প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
          <span className={`text-xs px-2 py-0.2 rounded-full ${activeTab === 'orders' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'wishlist' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{lang === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'}</span>
          <span className={`text-xs px-2 py-0.2 rounded-full ${activeTab === 'wishlist' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {wishlist.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ঠিকানা ও প্রোফাইল' : 'Account Details'}</span>
        </button>
      </div>

      {/* Content Area */}
      {/* 1. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-base font-bold text-slate-700">
                {lang === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' : 'No orders found.'}
              </p>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'পছন্দের পণ্য অর্ডার করে আপনার কেনাকাটা শুরু করুন।' : 'Start shopping to see your orders here.'}
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition overflow-hidden"
              >
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">{lang === 'bn' ? 'অর্ডার নম্বর:' : 'Order ID:'}</span>{' '}
                    <strong className="font-mono text-slate-800 text-sm">#{ord.orderNumber}</strong>
                    <span className="text-slate-400 ml-3">• {ord.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ord.orderStatus)}
                    <button
                      onClick={() => onViewOrderInvoice(ord)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ইনভয়েস' : 'Invoice'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Items */}
                    <div className="md:col-span-2 space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {lang === 'bn' ? item.product.titleBn : item.product.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              পরিমাণ: {item.quantity} {item.product.unit} • ৳{(item.product.discountPrice ?? item.product.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary & Destination */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2 flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-slate-800 mb-1">{lang === 'bn' ? 'ডেলিভারি ঠিকানা:' : 'Shipping Address:'}</p>
                        <p className="text-slate-600 text-[11px]">{ord.customer.address}, {ord.customer.city}</p>
                        <p className="text-slate-500 text-[11px]">{ord.customer.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                        <span className="text-slate-600">{lang === 'bn' ? 'পরিশোধিত মোট:' : 'Total:'}</span>
                        <span className="text-emerald-700 text-sm">৳{ord.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-base font-bold text-slate-700">
                {lang === 'bn' ? 'আপনার উইশলিস্টে কোনো পণ্য নেই।' : 'Your wishlist is empty.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlist.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-3 shadow-xs">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {lang === 'bn' ? prod.titleBn : prod.title}
                      </h4>
                      <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                        ৳{(prod.discountPrice ?? prod.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        {lang === 'bn' ? 'কার্টে নিন' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(prod)}
                        className="py-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        {lang === 'bn' ? 'মুছুন' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Account Details Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'bn' ? 'ব্যক্তিগত তথ্য ও ডেলিভারি ঠিকানা' : 'Personal & Delivery Address'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'অর্ডারের সময় এই তথ্যটি স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে' : 'Used automatically during checkout'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'শহর / জেলা' : 'City / District'}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা)' : 'Detailed Address'}
              </label>
              <textarea
                rows={2}
                required
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
