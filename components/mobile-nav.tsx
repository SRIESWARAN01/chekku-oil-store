"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function MobileNav() {
  const pathname = usePathname();
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

  // Hide mobile nav in admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      href: "/shop",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/cart",
    },
    {
      label: "Account",
      icon: User,
      href: "/account",
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-gray-100 bg-white/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md safe-bottom lg:hidden">
        <nav className="grid h-full grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 transition-colors duration-200 ${
                  isActive ? "text-[#1f6b3b]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label === "Cart" && cartCount > 0 && (
                    <span className={`absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-[#217743] text-[8px] font-extrabold text-white ${animate ? "animate-pulse-badge" : ""}`}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="max-w-full truncate text-[10px] font-bold uppercase tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div aria-hidden="true" className="h-16 safe-bottom lg:hidden" />
    </>
  );
}
