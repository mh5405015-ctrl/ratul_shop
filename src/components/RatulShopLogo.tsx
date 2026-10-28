import React from 'react';

interface RatulShopLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
}

export const RatulShopLogo: React.FC<RatulShopLogoProps> = ({ 
  size = 'md', 
  showTagline = true,
  inverted = false 
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14'
  }[size];

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl'
  }[size];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none group">
      {/* Custom Designed Vector Logo Icon */}
      <div className={`relative ${iconSizeClasses} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-md"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Emerald to Cyan High-end Gradient */}
            <linearGradient id="ratulGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0F766E" />
            </linearGradient>

            {/* Gold / Amber Accent Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Inner Glow */}
            <linearGradient id="bagInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Rounded Container Squircle */}
          <rect width="100" height="100" rx="26" fill="url(#ratulGrad)" />

          {/* Subtle geometric ring */}
          <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="4 3" />

          {/* Shopping Bag Outline */}
          <path 
            d="M26 34 L74 34 L66 84 L34 84 Z" 
            fill="url(#bagInner)" 
            stroke="#FFFFFF" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
          />

          {/* Bag Handles */}
          <path 
            d="M38 34 C38 23 44 16 50 16 C56 16 62 23 62 34" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Golden Sparkle / Crown Accent on top handle */}
          <path 
            d="M50 10 L52 14 L56 16 L52 18 L50 22 L48 18 L44 16 L48 14 Z" 
            fill="url(#goldGrad)" 
          />

          {/* Prominent Stylized Monogram "R" in the Center of Bag */}
          <path 
            d="M41 44 L41 72 M41 44 L53 44 C57 44 60 47 60 51 C60 55 57 58 53 58 L41 58 M52 58 L61 72" 
            stroke="#FFFFFF" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Tiny Golden Dot inside R's loop */}
          <circle cx="49" cy="51" r="2.5" fill="url(#goldGrad)" />
        </svg>

        {/* Small floating pulse badge */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
        </span>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-black tracking-tight font-['Outfit','Inter',sans-serif] ${textSizeClasses} ${
              inverted 
                ? 'text-white' 
                : 'bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 bg-clip-text text-transparent'
            }`}
          >
            Ratul
          </span>
          <span 
            className={`font-black tracking-tight font-['Outfit','Inter',sans-serif] ${textSizeClasses} ${
              inverted 
                ? 'text-emerald-400' 
                : 'text-emerald-600'
            }`}
          >
            Shop
          </span>

          <span className="ml-0.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-xs">
            100+ PRO
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] sm:text-[11px] font-medium ${inverted ? 'text-emerald-200/80' : 'text-slate-500'}`}>
              রাতুল শপ • প্রিমিয়াম অনলাইন মার্কেটপ্লেস
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
