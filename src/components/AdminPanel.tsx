import React, { useState } from 'react';
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  RotateCcw,
  Eye,
  X,
  Upload,
  ArrowUpDown
} from 'lucide-react';
import { Product, Order, CategoryType, Language, OrderStatus } from '../types';
import { CATEGORIES } from '../data/initialData';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onResetData: () => void;
  lang: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onResetData,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    sku: '',
    category: 'electronics' as CategoryType,
    price: 1000,
    discountPrice: '',
    stock: 20,
    unit: 'পিস (Pcs)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
    description: '',
    descriptionBn: ''
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.grandTotal : 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.titleBn.includes(searchQuery) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'all' 
      ? true 
      : stockFilter === 'low' 
      ? p.stock > 0 && p.stock <= 5 
      : p.stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      titleBn: '',
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: 'electronics',
      price: 1200,
      discountPrice: '',
      stock: 15,
      unit: 'পিস (Pcs)',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
      description: 'High quality authentic product with warranty.',
      descriptionBn: 'উচ্চমানের সেরা পণ্য, দীর্ঘস্থায়ী ও নির্ভরযোগ্য।'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      titleBn: product.titleBn,
      sku: product.sku,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stock: product.stock,
      unit: product.unit,
      image: product.image,
      description: product.description,
      descriptionBn: product.descriptionBn
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() && !formData.titleBn.trim()) return;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        title: formData.title || formData.titleBn,
        titleBn: formData.titleBn || formData.title,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        unit: formData.unit,
        image: formData.image,
        description: formData.description,
        descriptionBn: formData.descriptionBn
      };
      onUpdateProduct(updated);
    } else {
      // Add
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        sku: formData.sku,
        title: formData.title || formData.titleBn,
        titleBn: formData.titleBn || formData.title,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        rating: 5.0,
        reviewsCount: 1,
        unit: formData.unit,
        image: formData.image,
        description: formData.description,
        descriptionBn: formData.descriptionBn,
        isFeatured: false
      };
      onAddProduct(newProd);
    }
    setIsAddModalOpen(false);
  };

  const handleQuickStockAdjust = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    onUpdateProduct({ ...product, stock: newStock });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
              {lang === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
            </span>
            <span className="text-slate-400 text-xs">• Ratul Shop ইনভেন্টরি কন্ট্রোল প্যানেল</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {lang === 'bn' ? 'Ratul Shop স্টক ও ইনভেন্টরি ম্যানেজমেন্ট' : 'Ratul Shop Stock & Inventory Management'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title={lang === 'bn' ? 'শুরুর ডেটাতে রিসেট করুন' : 'Reset to default data'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রিসেট ডেমো ডেটা' : 'Reset Demo'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন প্রোডাক্ট যোগ করুন' : 'Add New Product'}</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'bn' ? 'মোট বিক্রয় (টাকা)' : 'Total Sales'}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">
              {orders.length}
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'bn' ? 'মোট প্রোডাক্ট' : 'Total Products'}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">
              {products.length}
            </p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div 
          onClick={() => {
            setActiveTab('inventory');
            setStockFilter(stockFilter === 'low' ? 'all' : 'low');
          }}
          className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 cursor-pointer transition ${
            lowStockCount > 0 
              ? 'bg-amber-50/70 border-amber-300 text-amber-900 hover:bg-amber-100/70' 
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-600 font-medium">
              {lang === 'bn' ? 'স্বল্প স্টক সতর্কতা' : 'Low Stock Alert'}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-amber-900">
              {lowStockCount} {lang === 'bn' ? 'টি আইটেম' : 'items'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs (Inventory vs Orders) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer border-b-2 ${
              activeTab === 'inventory'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রোডাক্ট ও ইনভেন্টরি কন্ট্রোল' : 'Product & Stock Control'}</span>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-700 font-semibold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer border-b-2 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'bn' ? 'কাস্টমার অর্ডারসমূহ' : 'Customer Orders'}</span>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-700 font-semibold">
              {orders.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'নাম বা SKU দিয়ে খুঁজুন...' : 'Search by name or SKU...'}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category & Stock Filter Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>
                      {lang === 'bn' ? c.nameBn : c.nameEn}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">{lang === 'bn' ? 'সকল স্টক অবস্থা' : 'All Stock Status'}</option>
                  <option value="low">{lang === 'bn' ? 'স্বল্প স্টক (≤৫)' : 'Low Stock (≤5)'}</option>
                  <option value="out">{lang === 'bn' ? 'স্টক শেষ (০)' : 'Out of Stock (0)'}</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{lang === 'bn' ? 'প্রোডাক্ট' : 'Product'}</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                    <th className="p-3">{lang === 'bn' ? 'মূল্য (টাকা)' : 'Price'}</th>
                    <th className="p-3">{lang === 'bn' ? 'স্টক ইনভেন্টরি' : 'Stock'}</th>
                    <th className="p-3">{lang === 'bn' ? 'দ্রুত স্টক পরিবর্তন' : 'Quick Stock'}</th>
                    <th className="p-3 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const isOut = prod.stock <= 0;
                    const isLow = prod.stock > 0 && prod.stock <= 5;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                        {/* Product info */}
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate max-w-[200px]">
                              {lang === 'bn' ? prod.titleBn : prod.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {prod.title}
                            </p>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="p-3 font-mono font-medium text-slate-600">
                          {prod.sku}
                        </td>

                        {/* Category */}
                        <td className="p-3 capitalize text-slate-600">
                          {prod.category}
                        </td>

                        {/* Price */}
                        <td className="p-3 font-semibold text-slate-800">
                          ৳{prod.discountPrice ?? prod.price}
                          {prod.discountPrice && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              ৳{prod.price}
                            </span>
                          )}
                        </td>

                        {/* Stock status */}
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            isOut 
                              ? 'bg-rose-100 text-rose-700' 
                              : isLow 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isOut 
                              ? (lang === 'bn' ? '০ (স্টক শেষ)' : '0 (Out)') 
                              : `${prod.stock} ${prod.unit}`}
                          </span>
                        </td>

                        {/* Quick Stock +/- */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickStockAdjust(prod, -1)}
                              disabled={prod.stock <= 0}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition cursor-pointer disabled:opacity-30"
                              title="-1"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(prod, 1)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition cursor-pointer"
                              title="+1"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(prod, 10)}
                              className="px-1.5 h-6 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center transition cursor-pointer"
                              title="+10"
                            >
                              +10
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                              title={lang === 'bn' ? 'এডিট করুন' : 'Edit'}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'bn' ? `আপনি কি নিশ্চিতভাবে "${prod.titleBn}" মুছে ফেলতে চান?` : `Delete product "${prod.title}"?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>{lang === 'bn' ? 'কোনো প্রোডাক্ট পাওয়া যায়নি।' : 'No products found matching filters.'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Customer Orders Management */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{lang === 'bn' ? 'অর্ডার নং' : 'Order ID'}</th>
                    <th className="p-3">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th className="p-3">{lang === 'bn' ? 'কাস্টমার ও ঠিকানা' : 'Customer'}</th>
                    <th className="p-3">{lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment'}</th>
                    <th className="p-3">{lang === 'bn' ? 'মোট (টাকা)' : 'Total'}</th>
                    <th className="p-3">{lang === 'bn' ? 'অর্ডার স্ট্যাটাস' : 'Status'}</th>
                    <th className="p-3 text-right">{lang === 'bn' ? 'ডিটেইলস' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {ord.orderNumber}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {ord.date}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{ord.customer.name}</p>
                        <p className="text-[11px] text-slate-400">{ord.customer.phone}</p>
                      </td>
                      <td className="p-3">
                        <span className="uppercase text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">
                        ৳{ord.grandTotal.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold py-1 px-2.5 rounded-full border outline-none cursor-pointer ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : ord.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : ord.orderStatus === 'processing'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : ord.orderStatus === 'cancelled'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="pending">{lang === 'bn' ? 'পেন্ডিং (Pending)' : 'Pending'}</option>
                          <option value="processing">{lang === 'bn' ? 'প্রসেসিং (Processing)' : 'Processing'}</option>
                          <option value="shipped">{lang === 'bn' ? 'ডেলিভারিতে আছে (Shipped)' : 'Shipped'}</option>
                          <option value="delivered">{lang === 'bn' ? 'সম্পূর্ণ ডেলিভার্ড (Delivered)' : 'Delivered'}</option>
                          <option value="cancelled">{lang === 'bn' ? 'বাতিল (Cancelled)' : 'Cancelled'}</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setViewingOrder(ord)}
                          className="px-2 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>{lang === 'bn' ? 'এখনো কোনো কাস্টমার অর্ডার নেই।' : 'No orders placed yet.'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {editingProduct 
                  ? (lang === 'bn' ? 'প্রোডাক্ট এডিট ও স্টক আপডেট' : 'Edit Product & Stock')
                  : (lang === 'bn' ? 'নতুন প্রোডাক্ট যুক্ত করুন' : 'Add New Product')}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'প্রোডাক্ট নাম (বাংলা) *' : 'Title (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="ওয়্যারলেস ব্লুটুথ ইয়ারবাডস"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'প্রোডাক্ট নাম (English)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Wireless Bluetooth Earbuds"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full font-mono px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>
                        {lang === 'bn' ? c.nameBn : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'একক (Unit)' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="পিস (Pcs)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'নিয়মিত মূল্য (টাকা) *' : 'Regular Price *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ছাড়ের পর মূল্য (টাকা)' : 'Discount Price'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="ঐচ্ছিক"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইনভেন্টরি স্টক সংখ্যা *' : 'Stock Count *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ছবির লিংক (Image URL)' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিবরণ (বাংলা)' : 'Description (Bengali)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="পণ্যটির গুণগত বৈশিষ্ট্য ও স্পেসিফিকেশন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  {editingProduct 
                    ? (lang === 'bn' ? 'আপডেট সংরক্ষণ' : 'Save Changes') 
                    : (lang === 'bn' ? 'প্রোডাক্ট সংরক্ষণ' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {lang === 'bn' ? 'অর্ডার বিস্তারিত:' : 'Order Details:'} #{viewingOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">{viewingOrder.date}</p>
              </div>
              <button 
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">{lang === 'bn' ? 'কাস্টমার তথ্য:' : 'Customer Information:'}</p>
                <p><span className="text-slate-500">নাম:</span> {viewingOrder.customer.name}</p>
                <p><span className="text-slate-500">ফোন:</span> {viewingOrder.customer.phone}</p>
                <p><span className="text-slate-500">ঠিকানা:</span> {viewingOrder.customer.address}, {viewingOrder.customer.city}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">{lang === 'bn' ? 'অর্ডারকৃত প্রোডাক্ট:' : 'Ordered Items:'}</p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={it.product.image} className="w-8 h-8 rounded object-cover" />
                        <div>
                          <p className="font-semibold text-slate-800">{lang === 'bn' ? it.product.titleBn : it.product.title}</p>
                          <p className="text-[10px] text-slate-400">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">
                        ৳{((it.product.discountPrice ?? it.product.price) * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                <span>{lang === 'bn' ? 'মোট মূল্য:' : 'Grand Total:'}</span>
                <span className="text-emerald-700">৳{viewingOrder.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
