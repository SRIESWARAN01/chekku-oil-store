"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, Tag, Phone, MessageCircle, Info, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { validateCouponAction } from "@/app/actions/checkout";
import { cn } from "@/lib/utils";

const INR = "\u20B9";

function formatPrice(amount: number) {
  return `${INR}${amount.toFixed(2)}`;
}

interface CartViewProps {
  settings: {
    brand_short: string;
    whatsapp_number: string;
    contact_phone: string;
  };
}

export function CartView({ settings }: CartViewProps) {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  // Order type: "whatsapp" or "callback"
  const [orderType, setOrderType] = useState<"whatsapp" | "callback">("whatsapp");

  // Callback form fields
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackError, setCallbackError] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-gray-400 font-body text-sm">
        Loading cart...
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const handling = subtotal > 0 ? 25 : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + handling - discount);

  // Apply Coupon code handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await validateCouponAction(couponCode, subtotal);
      if (res.success && res.discount !== undefined) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: res.discount,
        });
        setCouponSuccess(`Coupon "${couponCode.trim().toUpperCase()}" applied successfully: -${formatPrice(res.discount)}`);
      } else {
        setCouponError(res.error || "Failed to apply coupon.");
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err.message || "Something went wrong.");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove Coupon handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Place Order handler (WhatsApp link redirect)
  const handlePlaceOrder = (e: React.MouseEvent) => {
    e.preventDefault();

    if (orderType === "callback") {
      if (!callbackName.trim() || !callbackPhone.trim()) {
        setCallbackError("Please fill out your name and phone number for a callback.");
        return;
      }
      setCallbackError(null);
    }

    const brandName = settings.brand_short || "Thennaiyan";
    const shopOrigin = typeof window !== "undefined" ? window.location.origin : "https://chekku-oil-store.vercel.app";

    let message = `🥥 *${brandName} Coconut Company*\n`;

    if (orderType === "whatsapp") {
      message += `*New Order details:*\n\n`;
      items.forEach((item) => {
        message += `• *${item.product.name}* (${item.selectedSize}) x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
        message += `  Link: ${shopOrigin}/shop?product=${item.product.slug}\n\n`;
      });

      message += `*Subtotal:* ${formatPrice(subtotal)}\n`;
      message += `*Packing & Handling:* ${formatPrice(handling)}\n`;
      if (appliedCoupon) {
        message += `*Coupon applied (${appliedCoupon.code}):* -${formatPrice(appliedCoupon.discount)}\n`;
      }
      message += `*Grand Total:* ${formatPrice(total)}\n\n`;
      message += `Please confirm my order. Thank you!`;
    } else {
      message += `*Request for Callback:*\n\n`;
      message += `Customer Name: *${callbackName.trim()}*\n`;
      message += `Phone Number: *${callbackPhone.trim()}*\n\n`;
      message += `*Interested items:*\n`;
      items.forEach((item) => {
        message += `• ${item.product.name} (${item.selectedSize}) x ${item.quantity}\n`;
        message += `  Link: ${shopOrigin}/shop?product=${item.product.slug}\n`;
      });
      message += `\nPlease call me back to discuss ordering these items. Thank you!`;
    }

    const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`;
    
    // Clear cart and redirect
    clearCart();
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-body text-xl font-extrabold text-[#111827]">
          Cart
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="font-body text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <section className="rounded-2xl bg-white border border-gray-200/80 p-10 text-center shadow-xs">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf6ee] text-[#1f6b3b]">
            <ShoppingCart size={22} />
          </div>
          <h2 className="mt-4 font-body text-lg font-extrabold text-[#111827]">
            Your cart is empty
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 font-semibold">
            Choose pure oils from the product menu to get started.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#1f6b3b] px-6 font-body text-xs font-extrabold text-white hover:bg-[#154b29] transition-all duration-200 shadow-md"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] items-start">
          
          {/* Cart items list */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.slug}-${item.selectedSize}`}
                className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-xs"
              >
                <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{
                        background: `linear-gradient(150deg, ${item.product.hueA}, ${item.product.hueB})`,
                      }}
                    >
                      🥥
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-body text-sm font-extrabold text-[#111827]">
                    {item.product.name}
                  </h3>
                  <p className="mt-0.5 font-body text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {item.selectedSize}
                  </p>
                  <p className="mt-1 font-body text-xs font-semibold text-gray-600">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeItem(item.product.slug, item.selectedSize)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.selectedSize, item.quantity - 1)}
                      className="grid h-6 w-6 place-items-center rounded bg-white text-gray-400 hover:text-ink hover:shadow-xs transition-all border border-gray-100"
                    >
                      <Minus size={10} strokeWidth={3} />
                    </button>
                    <span className="w-5 text-center font-mono text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.selectedSize, item.quantity + 1)}
                      className="grid h-6 w-6 place-items-center rounded bg-white text-[#1f6b3b] hover:shadow-xs transition-all border border-gray-100"
                    >
                      <Plus size={10} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Code Section */}
            <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-xs space-y-3.5">
              <span className="font-body text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Apply Coupon Code
              </span>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon !== null}
                  placeholder="ENTER COUPON CODE"
                  className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 font-mono text-sm uppercase outline-none focus:border-[#1f6b3b] disabled:bg-gray-50 disabled:text-gray-400"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="h-10 px-4 rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50/20 text-xs font-bold text-red-500 transition-all"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="h-10 px-5 rounded-lg bg-[#1f6b3b] disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold hover:bg-[#154b29] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Tag size={12} />
                    {couponLoading ? "Verifying..." : "Apply"}
                  </button>
                )}
              </form>

              {couponError && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 bg-red-50/20 p-2 border border-red-100 rounded-lg">
                  <Info size={12} />
                  {couponError}
                </p>
              )}

              {couponSuccess && (
                <p className="text-xs font-semibold text-leaf flex items-center gap-1.5 bg-leaf-mist p-2 border border-leaf/10 rounded-lg">
                  <Check size={12} strokeWidth={3} />
                  {couponSuccess}
                </p>
              )}
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="space-y-4">
            
            {/* Order type selector */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="mb-3.5 font-body text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Order Type
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType("whatsapp")}
                  className={cn(
                    "h-10 rounded-lg font-body text-xs font-bold transition-all flex items-center justify-center gap-1.5 select-none",
                    orderType === "whatsapp"
                      ? "bg-[#1f6b3b]/10 text-[#1f6b3b] border border-[#1f6b3b]/20 font-extrabold"
                      : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <MessageCircle size={14} />
                  WhatsApp Order
                </button>
                <button
                  onClick={() => setOrderType("callback")}
                  className={cn(
                    "h-10 rounded-lg font-body text-xs font-bold transition-all flex items-center justify-center gap-1.5 select-none",
                    orderType === "callback"
                      ? "bg-[#1f6b3b]/10 text-[#1f6b3b] border border-[#1f6b3b]/20 font-extrabold"
                      : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <Phone size={13} />
                  Call Back
                </button>
              </div>

              {/* Callback Form details */}
              {orderType === "callback" && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
                  <div>
                    <label htmlFor="cb_name" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      id="cb_name"
                      type="text"
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                  <div>
                    <label htmlFor="cb_phone" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      id="cb_phone"
                      type="tel"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                  {callbackError && (
                    <p className="text-[10px] text-red-500 font-bold">{callbackError}</p>
                  )}
                </div>
              )}
            </section>

            {/* Price Calculations */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>Packing & handling</span>
                <span>{formatPrice(handling)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-leaf font-bold">
                  <span>Coupon applied ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-body text-sm font-extrabold text-[#111827]">
                <span>Grand total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </section>

            <button
              onClick={handlePlaceOrder}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f6b3b] font-body text-xs font-extrabold text-white shadow-md hover:bg-[#154b29] transition-all duration-200 select-none"
            >
              <MessageCircle size={15} />
              {orderType === "whatsapp" 
                ? `Place WhatsApp Order - ${formatPrice(total)}` 
                : "Request Call Back"
              }
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
