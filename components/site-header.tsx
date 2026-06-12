"use client";

import Link from "next/link";
import { ShoppingCart, QrCode, History, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "./language-toggle";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { t } = useLanguage();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt={t("brand")}
              className="h-9 w-9 rounded-full border border-leaf/10 object-cover"
            />
            <span className="font-body font-bold text-lg text-ink tracking-tight">
              {t("brand")}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-600">
            <Link href="/#products" className="hover:text-leaf transition-colors">
              Products
            </Link>
            <Link href="/story" className="hover:text-leaf transition-colors">
              Story
            </Link>
            <Link href="/journal" className="hover:text-leaf transition-colors">
              Journal
            </Link>
            <Link href="/contact" className="hover:text-leaf transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 text-gray-700">
          <LanguageToggle />

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
          >
            <ShoppingCart size={20} strokeWidth={2} />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 bg-[#217743] text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center border border-white ${animate ? "animate-pulse-badge" : ""}`}>
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label={t("scanQR")}
            onClick={() => alert("Table scanner initiated...")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <QrCode size={20} strokeWidth={2} />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <User size={20} strokeWidth={2} />
          </Link>
          <Link
            href="/account/orders"
            aria-label={t("orderHistory")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <History size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
