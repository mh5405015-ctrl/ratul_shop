/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Store,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Product, CartItem, Order, User, Language, CategoryType, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_USER, CATEGORIES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { RatulShopLogo } from './components/RatulShopLogo';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'RS-82914',
    date: '২৬ অক্টোবর, ২০২৬',
    customer: {
      name: 'মাহমুদুল হাসান রাতুল',
      phone: '01712345678',
      email: 'mh5405015@gmail.com',
      city: 'ঢাকা (Dhaka)',
      address: 'বাড়ি ১২, রোড ৫, ধানমন্ডি',
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[40], quantity: 2 },
    ],
    subtotal: 4610,
    discount: 461,
    deliveryFee: 0,
    grandTotal: 4149,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    transactionId: 'BKASH-7KP89X'
  }
];

export default function App() {
  // State with LocalStorage Persistence
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ratulshop_lang') as Language) || 'bn';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ratulshop_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 80) {
          return parsed;
        }
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ratulshop_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ratulshop_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_ORDERS;
      }
    }
    return SAMPLE_ORDERS;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('ratulshop_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ratulshop_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[2], INITIAL_PRODUCTS[20]];
      }
    }
    return [INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[2], INITIAL_PRODUCTS[20]];
  });

  // UI View States
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'profile' | 'wishlist'>('shop');
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ratulshop_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ratulshop_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ratulshop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ratulshop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ratulshop_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ratulshop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('amarshop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prevCart, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Wishlist Action
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Checkout flow
  const handleProceedToCheckout = (discount: number, coupon: string) => {
    setAppliedDiscount(discount);
    setAppliedCoupon(coupon);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handleOrderSuccess = (orderData: {
    customer: any;
    paymentMethod: any;
    transactionId: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    grandTotal: number;
  }) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `RS-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customer: orderData.customer,
      items: [...cart],
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      deliveryFee: orderData.deliveryFee,
      grandTotal: orderData.grandTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending',
      transactionId: orderData.transactionId,
    };

    // Deduct stock from inventory
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    // Empty cart
    setCart([]);
    setIsPaymentOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Admin inventory operations
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord))
    );
  };

  const handleResetData = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি সব ডেমো ডেটা রিসেট করে ১০০টি প্রোডাক্ট লোড করতে চান?' : 'Reset all data and load 100 products?')) {
      setProducts(INITIAL_PRODUCTS);
      setOrders(SAMPLE_ORDERS);
      setUser(INITIAL_USER);
      setCart([]);
      localStorage.removeItem('ratulshop_products_v2');
      localStorage.removeItem('ratulshop_orders');
      localStorage.removeItem('ratulshop_user');
      localStorage.removeItem('ratulshop_cart');
      localStorage.removeItem('ratulshop_wishlist');
      localStorage.removeItem('amarshop_products');
      localStorage.removeItem('amarshop_orders');
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.titleBn.includes(searchQuery) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = filterInStockOnly ? p.stock > 0 : true;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCategory, searchQuery, filterInStockOnly, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleCategorySelect = (cat: CategoryType) => {
    setCurrentCategory(cat);
    setCurrentPage(1);
    if (currentView !== 'shop') setCurrentView('shop');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Navbar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setCurrentView('wishlist')}
        lang={lang}
        onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        allProducts={products}
        onQuickView={setQuickViewProduct}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-8">
            {/* Hero Section */}
            {!searchQuery && currentCategory === 'all' && (
              <HeroBanner
                lang={lang}
                onExplore={() => {
                  const element = document.getElementById('products-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Products Section Header & Sorting */}
            <div id="products-section" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span>
                      {searchQuery
                        ? lang === 'bn'
                          ? `"${searchQuery}" এর জন্য অনুসন্ধান ফলাফল`
                          : `Results for "${searchQuery}"`
                        : currentCategory === 'all'
                        ? lang === 'bn'
                          ? 'জনপ্রিয় সকল প্রোডাক্ট'
                          : 'Explore All Products'
                        : CATEGORIES.find((c) => c.id === currentCategory)?.[lang === 'bn' ? 'nameBn' : 'nameEn']}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      {filteredProducts.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'সেরা কোয়ালিটি ও যাচাইকৃত রেটিং সহ' : 'Handpicked high quality items with verified ratings'}
                  </p>
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* In Stock toggle */}
                  <button
                    onClick={() => setFilterInStockOnly(!filterInStockOnly)}
                    className={`text-xs px-3 py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 font-semibold ${
                      filterInStockOnly
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'স্টকে আছে এমন' : 'In Stock Only'}</span>
                  </button>

                  {/* Sorting dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer pr-7 appearance-none font-semibold"
                    >
                      <option value="featured">{lang === 'bn' ? 'ফিচার্ড ও ট্রেন্ডিং' : 'Featured'}</option>
                      <option value="price-asc">{lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                      <option value="price-desc">{lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                      <option value="rating">{lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-700">
                      {lang === 'bn' ? 'কোনো প্রোডাক্ট মেলেনি!' : 'No products found!'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'bn'
                        ? 'অনুসন্ধান শব্দটি পরিবর্তন করুন অথবা ক্যাটাগরি ফিল্টার চেক করুন।'
                        : 'Try searching with different keywords or reset your category filter.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentCategory('all');
                      setFilterInStockOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {paginatedProducts.map((product) => {
                      const isInCart = cart.some((item) => item.product.id === product.id);
                      const isWishlisted = wishlist.some((p) => p.id === product.id);
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          lang={lang}
                          onAddToCart={(p) => handleAddToCart(p, 1)}
                          onQuickView={setQuickViewProduct}
                          isWishlisted={isWishlisted}
                          onToggleWishlist={handleToggleWishlist}
                          isInCart={isInCart}
                        />
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white p-4 rounded-2xl shadow-xs">
                      <div className="text-slate-500 font-medium">
                        {lang === 'bn' ? (
                          <>
                            মোট <strong className="text-slate-800">{filteredProducts.length}</strong> টির মধ্যে{' '}
                            <strong className="text-emerald-700">
                              {(currentPage - 1) * itemsPerPage + 1} -{' '}
                              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                            </strong>{' '}
                            প্রদর্শিত হচ্ছে
                          </>
                        ) : (
                          <>
                            Showing{' '}
                            <strong className="text-emerald-700">
                              {(currentPage - 1) * itemsPerPage + 1} -{' '}
                              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                            </strong>{' '}
                            of <strong className="text-slate-800">{filteredProducts.length}</strong> items
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-semibold transition cursor-pointer"
                        >
                          {lang === 'bn' ? '« পূর্ববর্তী' : '« Prev'}
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          const isActive = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-semibold transition cursor-pointer"
                        >
                          {lang === 'bn' ? 'পরবর্তী »' : 'Next »'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* View 2: Admin Panel */}
        {currentView === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResetData={handleResetData}
            lang={lang}
          />
        )}

        {/* View 3: User Profile & Orders */}
        {currentView === 'profile' && (
          <UserProfile
            user={user}
            onUpdateUser={setUser}
            orders={orders}
            wishlist={wishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onRemoveFromWishlist={handleToggleWishlist}
            onViewOrderInvoice={(ord) => {
              setLatestOrder(ord);
              setIsSuccessModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {/* View 4: Wishlist View */}
        {currentView === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <UserProfile
              user={user}
              onUpdateUser={setUser}
              orders={orders}
              wishlist={wishlist}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onRemoveFromWishlist={handleToggleWishlist}
              onViewOrderInvoice={(ord) => {
                setLatestOrder(ord);
                setIsSuccessModalOpen(true);
              }}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Action Cart Indicator on Mobile */}
      {cartCount > 0 && currentView === 'shop' && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-700/40 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/80 flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <span className="text-xs font-bold">
                {lang === 'bn' ? 'কার্ট দেখুন' : 'View Cart'}
              </span>
            </div>
            <span className="text-sm font-extrabold">
              ৳{cartTotal.toLocaleString()}
            </span>
          </button>
        </div>
      )}

      {/* Modals & Overlays */}
      {/* 1. Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        lang={lang}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={wishlist.some((p) => p.id === quickViewProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        lang={lang}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Checkout & Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cart={cart}
        subtotal={cartTotal}
        discount={appliedDiscount}
        couponCode={appliedCoupon}
        lang={lang}
        initialCustomer={{
          name: user.name,
          phone: user.phone,
          email: user.email,
          city: user.city,
          address: user.address,
        }}
        onSuccess={handleOrderSuccess}
      />

      {/* 4. Order Confirmation & Printable Invoice Modal */}
      <OrderSuccessModal
        order={latestOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        lang={lang}
        onViewOrders={() => setCurrentView('profile')}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <RatulShopLogo size="md" inverted={true} showTagline={false} />
            <p className="text-[11px] leading-relaxed text-slate-400">
              {lang === 'bn'
                ? 'Ratul Shop (রাতুল শপ) - বাংলাদেশের নির্ভরযোগ্য ১০০+ পণ্যের মেগা ই-কমার্স মার্কেটপ্লেস। ১০০% আসল পণ্য, দ্রুততম ডেলিভারি ও সহজ অনলাইন পেমেন্ট।'
                : 'Ratul Shop - Bangladesh’s premier 100+ curated items marketplace. Authentic quality, swift delivery, and instant bKash/Nagad checkout.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'জনপ্রিয় ক্যাটাগরি' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setCurrentCategory(c.id as CategoryType);
                      setCurrentPage(1);
                      setCurrentView('shop');
                    }}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    {lang === 'bn' ? c.nameBn : c.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'পেমেন্ট মাধ্যমসমূহ' : 'Payment Partners'}
            </h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e2136e]" /> bKash (বিকাশ অনলাইন গেটওয়ে)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f7941d]" /> Nagad (নগদ ডিজিটাল ওয়ালেট)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Visa / MasterCard / Amex
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> ক্যাশ অন ডেলিভারি (Cash on Delivery)
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'Customer Support'}
            </h4>
            <div className="space-y-2 text-[11px]">
              <p className="font-semibold text-slate-300">হটলাইন: 01712-345678</p>
              <p>ইমেইল: support@ratulshop.com</p>
              <p>হেড অফিস: রোড ৫, ধানমন্ডি, ঢাকা - ১২০৯</p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  {lang === 'bn' ? 'এডমিন ইনভেন্টরি লগইন' : 'Admin Inventory Portal'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Ratul Shop (রাতুল শপ) BD. All rights reserved. নিরাপদ ও খাঁটি কেনাকাটার বিশ্বস্ত ঠিকানা।</p>
        </div>
      </footer>
    </div>
  );
}
