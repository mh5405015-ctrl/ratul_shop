import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, ArrowRight, Package, FileText, ShoppingBag, X } from 'lucide-react';
import { Order, Language } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  lang,
  onViewOrders
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {lang === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {lang === 'bn' 
              ? 'Ratul Shop এ কেনাকাটা করার জন্য ধন্যবাদ। আপনার ইনভয়েস রশিদ নিচে দেওয়া হলো।' 
              : 'Thank you for shopping with Ratul Shop. Your invoice details are ready.'}
          </p>
        </div>

        {/* Invoice Body (Printable area) */}
        <div id="printable-invoice" className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-slate-700">
          {/* Order Header Info */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <p className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'ইনভয়েস #' : 'Invoice #'} <span className="font-mono text-emerald-700">{order.orderNumber}</span>
              </p>
              <p className="text-slate-500">{order.date}</p>
              <p className="mt-1">
                <span className="font-semibold">{lang === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}</span>{' '}
                <span className="uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {order.paymentMethod}
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                {order.paymentStatus === 'paid' ? (lang === 'bn' ? 'পরিশোধিত' : 'Paid') : (lang === 'bn' ? 'বকেয়া' : 'Pending')}
              </span>
              {order.transactionId && (
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  TrxID: {order.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800">{lang === 'bn' ? 'ডেলিভারি ঠিকানা:' : 'Delivery Details:'}</p>
            <p className="font-semibold">{order.customer.name} • {order.customer.phone}</p>
            <p className="text-slate-500">{order.customer.address}, {order.customer.city}</p>
          </div>

          {/* Items List */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">{lang === 'bn' ? 'অর্ডারকৃত প্রোডাক্টসমূহ:' : 'Ordered Items:'}</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, index) => {
                const itemPrice = item.product.discountPrice ?? item.product.price;
                return (
                  <div key={index} className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-9 h-9 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {lang === 'bn' ? item.product.titleBn : item.product.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ৳{itemPrice.toLocaleString()} × {item.quantity} {item.product.unit}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">
                      ৳{(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
              <span className="font-semibold">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{lang === 'bn' ? 'ডিসকাউন্ট ছাড়:' : 'Discount:'}</span>
                <span className="font-semibold">-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
              <span className="font-semibold">
                {order.deliveryFee === 0 ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `৳${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>{lang === 'bn' ? 'সর্বমোট পরিশোধিত:' : 'Total Amount:'}</span>
              <span className="text-emerald-700">৳{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রশিদ প্রিন্ট / PDF' : 'Print Invoice'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমার অর্ডারে দেখুন' : 'Track in My Orders'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
