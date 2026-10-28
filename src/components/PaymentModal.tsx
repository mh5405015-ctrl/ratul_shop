import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Building,
  User as UserIcon,
  Phone,
  MapPin
} from 'lucide-react';
import { CartItem, CustomerDetails, Language, PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  lang: Language;
  initialCustomer: CustomerDetails;
  onSuccess: (orderData: {
    customer: CustomerDetails;
    paymentMethod: PaymentMethod;
    transactionId: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    grandTotal: number;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  discount,
  couponCode,
  lang,
  initialCustomer,
  onSuccess
}) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  
  // Customer Shipping Details State
  const [customer, setCustomer] = useState<CustomerDetails>(initialCustomer);
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState('');

  // bKash / Nagad Gateway Simulation States
  const [mfsStep, setMfsStep] = useState<'phone' | 'otp' | 'pin'>('phone');
  const [mfsPhone, setMfsPhone] = useState(initialCustomer.phone || '01700000000');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('784912');

  // Card Gateway State
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(initialCustomer.name || 'MD HASAN');

  if (!isOpen) return null;

  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const validateShipping = () => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = lang === 'bn' ? 'নাম প্রদান করুন' : 'Name is required';
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errors.phone = lang === 'bn' ? 'সঠিক মোবাইল নম্বর দিন' : 'Valid phone number is required';
    }
    if (!customer.address.trim()) {
      errors.address = lang === 'bn' ? 'সম্পূর্ণ ঠিকানা লিখুন' : 'Address is required';
    }
    if (!customer.city.trim()) {
      errors.city = lang === 'bn' ? 'জেলা/শহর নির্বাচন করুন' : 'City is required';
    }
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  // Complete Payment Flow
  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setProcessError('');

    // Generate Transaction ID based on method
    let txId = '';
    const randomHex = Math.random().toString(36).substring(2, 9).toUpperCase();

    if (paymentMethod === 'bkash') {
      if (mfsStep === 'phone') {
        if (!mfsPhone || mfsPhone.length < 11) {
          setIsProcessing(false);
          setProcessError(lang === 'bn' ? 'সঠিক ১১ সংখ্যার বিকাশ নম্বর দিন' : 'Enter valid 11-digit bKash number');
          return;
        }
        setTimeout(() => {
          setIsProcessing(false);
          setMfsStep('otp');
        }, 800);
        return;
      } else if (mfsStep === 'otp') {
        if (!mfsOtp || mfsOtp.length < 4) {
          setIsProcessing(false);
          setProcessError(lang === 'bn' ? 'সঠিক OTP কোড দিন (যেমন: 784912)' : 'Enter OTP code');
          return;
        }
        setTimeout(() => {
          setIsProcessing(false);
          setMfsStep('pin');
        }, 800);
        return;
      } else if (mfsStep === 'pin') {
        if (!mfsPin || mfsPin.length < 4) {
          setIsProcessing(false);
          setProcessError(lang === 'bn' ? 'আপনার গোপন পিন (PIN) দিন' : 'Enter 5-digit PIN');
          return;
        }
        txId = `BKASH-${randomHex}`;
      }
    } else if (paymentMethod === 'nagad') {
      if (mfsStep === 'phone') {
        if (!mfsPhone || mfsPhone.length < 11) {
          setIsProcessing(false);
          setProcessError(lang === 'bn' ? 'সঠিক ১১ সংখ্যার নগদ নম্বর দিন' : 'Enter valid Nagad number');
          return;
        }
        setTimeout(() => {
          setIsProcessing(false);
          setMfsStep('pin');
        }, 800);
        return;
      } else if (mfsStep === 'pin') {
        if (!mfsPin) {
          setIsProcessing(false);
          setProcessError(lang === 'bn' ? 'আপনার নগদ পিন দিন' : 'Enter Nagad PIN');
          return;
        }
        txId = `NAGAD-${randomHex}`;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || !cardCvv || !cardExpiry) {
        setIsProcessing(false);
        setProcessError(lang === 'bn' ? 'কার্ডের সঠিক তথ্য প্রদান করুন' : 'Provide complete card details');
        return;
      }
      txId = `CARD-${randomHex}`;
    } else {
      // Cash on delivery
      txId = `COD-${randomHex}`;
    }

    // Complete order simulation
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        customer,
        paymentMethod,
        transactionId: txId,
        subtotal,
        discount,
        deliveryFee,
        grandTotal
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {step === 'shipping' 
                ? (lang === 'bn' ? 'ডেলিভারি ঠিকানা ও তথ্য' : 'Shipping & Customer Details')
                : (lang === 'bn' ? 'পেমেন্ট গেটওয়ে ও কনফার্মেশন' : 'Payment Gateway & Checkout')}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'নিরাপদ ২৫৬-বিট এসএসএল এনক্রিপ্টেড চেকআউট' : '256-bit SSL Encrypted Secure Checkout'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-center gap-3 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-emerald-700' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'shipping' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
            <span>{lang === 'bn' ? 'ডেলিভারি তথ্য' : 'Shipping'}</span>
          </div>
          <span className="text-slate-300">———</span>
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-emerald-700' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
            <span>{lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {step === 'shipping' ? (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="মাহমুদুল হাসান"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {shippingErrors.name && (
                    <span className="text-[11px] text-rose-500">{shippingErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {shippingErrors.phone && (
                    <span className="text-[11px] text-rose-500">{shippingErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শহর / জেলা *' : 'City / District *'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="ঢাকা (Dhaka)"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {shippingErrors.city && (
                    <span className="text-[11px] text-rose-500">{shippingErrors.city}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *' : 'Detailed Delivery Address *'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <textarea
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
                {shippingErrors.address && (
                  <span className="text-[11px] text-rose-500">{shippingErrors.address}</span>
                )}
              </div>

              {/* Order Quick Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'আইটেম মোট:' : 'Items Total:'}</span>
                  <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{lang === 'bn' ? `ছাড় (${couponCode}):` : `Discount (${couponCode}):`}</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                  <span>{deliveryFee === 0 ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `৳${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>{lang === 'bn' ? 'পরিশোধযোগ্য মোট:' : 'Payable Total:'}</span>
                  <span className="text-emerald-700">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'bn' ? 'পেমেন্ট পেজে এগিয়ে যান' : 'Continue to Payment'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Payment Methods Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {lang === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন:' : 'Select Payment Method:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bkash');
                      setMfsStep('phone');
                      setProcessError('');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-50/70 text-pink-700 ring-2 ring-pink-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e2136e] text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                      বিকাশ
                    </div>
                    <span className="text-xs font-bold">bKash</span>
                    <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'ইনস্ট্যান্ট' : 'Instant'}</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('nagad');
                      setMfsStep('phone');
                      setProcessError('');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-700 ring-2 ring-orange-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f7941d] text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                      নগদ
                    </div>
                    <span className="text-xs font-bold">Nagad</span>
                    <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'ইনস্ট্যান্ট' : 'Instant'}</span>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setProcessError('');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-700 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Card</span>
                    <span className="text-[10px] text-slate-500">Visa / Master</span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cod');
                      setProcessError('');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-teal-500 bg-teal-50/70 text-teal-700 ring-2 ring-teal-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Cash on Del.</span>
                    <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'হাতে পেয়ে' : 'Doorstep'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Gateway Simulator Body */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                {/* bKash Flow */}
                {paymentMethod === 'bkash' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#e2136e] text-white px-2 py-0.5 rounded font-black text-xs">
                          bKash
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {lang === 'bn' ? 'বিকাশ অনলাইন পেমেন্ট' : 'bKash Payment Gateway'}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#e2136e]">
                        ৳{grandTotal.toLocaleString()}
                      </span>
                    </div>

                    {mfsStep === 'phone' && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600">
                          {lang === 'bn' 
                            ? 'আপনার ১১ সংখ্যার বিকাশ অ্যাকাউন্ট নম্বর দিন:' 
                            : 'Enter your 11-digit bKash account number:'}
                        </p>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            maxLength={11}
                            value={mfsPhone}
                            onChange={(e) => setMfsPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full text-sm font-mono pl-9 pr-3 py-2 rounded-xl border border-pink-300 focus:border-pink-500 outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {mfsStep === 'otp' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-600">
                            {lang === 'bn' 
                              ? `মোবাইলে পাঠানো ৬ সংখ্যার OTP কোড লিখুন:` 
                              : `Enter 6-digit verification code sent to ${mfsPhone}:`}
                          </p>
                          <button
                            type="button"
                            onClick={() => setMfsOtp(simulatedOtp)}
                            className="text-[11px] text-pink-600 underline font-semibold cursor-pointer"
                          >
                            {lang === 'bn' ? `অটো ফিল (${simulatedOtp})` : `Auto-fill (${simulatedOtp})`}
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={mfsOtp}
                          onChange={(e) => setMfsOtp(e.target.value)}
                          placeholder="784912"
                          className="w-full text-center tracking-widest text-base font-mono py-2 rounded-xl border border-pink-300 focus:border-pink-500 outline-none bg-white"
                        />
                      </div>
                    )}

                    {mfsStep === 'pin' && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600">
                          {lang === 'bn' 
                            ? 'পেমেন্ট নিশ্চিত করতে আপনার গোপন বিকাশ পিন দিন:' 
                            : 'Enter your bKash 5-digit secret PIN:'}
                        </p>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="password"
                            maxLength={5}
                            value={mfsPin}
                            onChange={(e) => setMfsPin(e.target.value)}
                            placeholder="•••••"
                            className="w-full text-center tracking-widest text-base font-mono pl-9 pr-3 py-2 rounded-xl border border-pink-300 focus:border-pink-500 outline-none bg-white"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">
                          {lang === 'bn' ? 'এটি একটি সিমুলেটেড টেস্ট গেটওয়ে (যেকোনো পিন ব্যবহার করা যাবে)' : 'Simulated test gateway (any PIN works)'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Nagad Flow */}
                {paymentMethod === 'nagad' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#f7941d] text-white px-2 py-0.5 rounded font-black text-xs">
                          নগদ
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {lang === 'bn' ? 'নগদ ডিজিটাল পেমেন্ট' : 'Nagad Payment Gateway'}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#f7941d]">
                        ৳{grandTotal.toLocaleString()}
                      </span>
                    </div>

                    {mfsStep === 'phone' ? (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600">
                          {lang === 'bn' ? 'নগদ অ্যাকাউন্ট নম্বর দিন:' : 'Enter your Nagad Account Number:'}
                        </p>
                        <input
                          type="tel"
                          maxLength={11}
                          value={mfsPhone}
                          onChange={(e) => setMfsPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-orange-300 focus:border-orange-500 outline-none bg-white"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600">
                          {lang === 'bn' ? 'নগদ পিন নম্বর প্রবেশ করান:' : 'Enter 4-digit Nagad PIN:'}
                        </p>
                        <input
                          type="password"
                          maxLength={4}
                          value={mfsPin}
                          onChange={(e) => setMfsPin(e.target.value)}
                          placeholder="••••"
                          className="w-full text-center text-base font-mono tracking-widest py-2 rounded-xl border border-orange-300 focus:border-orange-500 outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Card Flow */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800">
                        {lang === 'bn' ? 'ভিসা / মাস্টারকার্ড পেমেন্ট' : 'Credit / Debit Card'}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        ৳{grandTotal.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {lang === 'bn' ? 'কার্ড নম্বর' : 'Card Number'}
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'bn' ? 'মেয়াদ (MM/YY)' : 'Expiry (MM/YY)'}
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="888"
                          className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Flow */}
                {paymentMethod === 'cod' && (
                  <div className="p-3 text-center space-y-2">
                    <Truck className="w-8 h-8 text-teal-600 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-800">
                      {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)' : 'Cash on Delivery'}
                    </h4>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      {lang === 'bn'
                        ? `ডেলিভারি ম্যান আপনার ঠিকানায় (${customer.address}) পৌঁছানোর পর পণ্যটি চেক করে নগদ ৳${grandTotal.toLocaleString()} পরিশোধ করুন।`
                        : `Pay ৳${grandTotal.toLocaleString()} cash to our delivery executive once your items arrive at ${customer.address}.`}
                    </p>
                  </div>
                )}

                {processError && (
                  <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{processError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setStep('shipping');
                    setProcessError('');
                  }}
                  className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  {lang === 'bn' ? 'ঠিকানা পরিবর্তন' : 'Back to Address'}
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmOrder}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#e2136e] hover:bg-[#c10f5c] shadow-pink-500/20'
                      : paymentMethod === 'nagad'
                      ? 'bg-[#f7941d] hover:bg-[#d67b0d] shadow-orange-500/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'ভেরিফাই ও প্রসেসিং হচ্ছে...' : 'Verifying payment...'}</span>
                    </>
                  ) : paymentMethod === 'bkash' && mfsStep === 'phone' ? (
                    <span>{lang === 'bn' ? 'OTP পাঠান' : 'Send OTP'}</span>
                  ) : paymentMethod === 'bkash' && mfsStep === 'otp' ? (
                    <span>{lang === 'bn' ? 'OTP নিশ্চিত করুন' : 'Confirm OTP'}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {lang === 'bn'
                          ? `অর্ডার নিশ্চিত করুন (৳${grandTotal.toLocaleString()})`
                          : `Confirm Order (৳${grandTotal.toLocaleString()})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
