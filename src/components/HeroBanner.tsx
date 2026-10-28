import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock, Copy, Check, Zap } from 'lucide-react';
import { Language } from '../types';

interface HeroBannerProps {
  lang: Language;
  onExplore: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang, onExplore }) => {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Main Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl min-h-[300px] sm:min-h-[350px] flex items-center">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
              <span>
                {lang === 'bn' ? 'Ratul Shop মেগা ধামাকা • ১০০+ পণ্য লাইভ!' : 'Ratul Shop Mega Sale • 100+ Live Items!'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>
                  <span className="font-['Outfit'] text-amber-300">Ratul Shop</span> এ সেরা মান <br />
                  <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-white bg-clip-text text-transparent">
                    ১০০টি প্রিমিয়াম পণ্য সরাসরি আপনার ঠিকানায়!
                  </span>
                </>
              ) : (
                <>
                  Welcome to <span className="font-['Outfit'] text-amber-300">Ratul Shop</span> <br />
                  <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-white bg-clip-text text-transparent">
                    100+ Verified Products At Your Doorstep
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg leading-relaxed">
              {lang === 'bn'
                ? 'ইলেকট্রনিক্স, খাঁটি গ্রোসারি, ঐতিহ্যবাহী পোশাক, স্কিনকেয়ার ও হোম অ্যাপ্লায়েন্সের ১০০টি সেরা প্রোডাক্টের সম্ভার। বিকাশ, নগদ ও ক্যাশ অন ডেলিভারিতে দ্রুত কেনাকাটা করুন।'
                : 'Explore 100 curated items across tech, organic pantry, lifestyle fashion, and home kitchen. Instant checkout via bKash, Nagad, Card, or COD.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-xs sm:text-sm text-slate-900 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <span>{lang === 'bn' ? '১০০টি পণ্য দেখুন' : 'Explore 100 Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Coupon chip */}
              <div 
                onClick={() => handleCopy('RATUL10')}
                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                title={lang === 'bn' ? 'ক্লিক করে কুপন কপি করুন' : 'Click to copy coupon'}
              >
                <span className="text-amber-300 font-mono font-bold">RATUL10</span>
                <span className="text-[11px] text-emerald-200">
                  {lang === 'bn' ? '(১০% ছাড়)' : '(10% Off)'}
                </span>
                {copiedCoupon === 'RATUL10' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Right Hero Feature Showcase */}
          <div className="hidden md:flex justify-center items-center relative">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Featured Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {lang === 'bn' ? 'হট ডিল' : 'Hot Pick'}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'প্রিমিয়াম নয়েজ ক্যানসেলিং হেডফোন' : 'ANC Wireless Headphone'}
                </h4>
                <p className="text-xs text-emerald-300 font-extrabold mt-0.5">
                  ৳৩,২৫০ <span className="line-through text-slate-400 text-[10px]">৳৩,৮০০</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? 'ফ্রি হোম ডেলিভারি' : 'Free Delivery'}
            </p>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn' ? '৳১০০০+ অর্ডারে সারাদেশে' : 'On orders over ৳1000'}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? '১০০% আসল প্রোডাক্ট' : 'Authentic Guaranteed'}
            </p>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn' ? 'সরাসরি প্রস্তুতকারক হতে' : 'Direct from source'}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট' : '7 Days Return'}
            </p>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn' ? 'ঝামেলাহীন ফেরত নীতি' : 'Hassle-free replacement'}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#e2136e] flex items-center justify-center shrink-0 font-bold text-xs">
            বিকাশ
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? 'সহজ পেমেন্ট সুবিধা' : 'Instant Payment'}
            </p>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn' ? 'বিকাশ, নগদ, কার্ড ও ক্যাশ' : 'bKash, Nagad, Card, COD'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
