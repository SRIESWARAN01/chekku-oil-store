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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-50 h-16 safe-bottom">
      <nav className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                isActive ? "text-[#1f6b3b]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === "Cart" && cartCount > 0 && (
                  <span className={`absolute -top-1.5 -right-2 bg-[#217743] text-white text-[8px] font-extrabold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white ${animate ? "animate-pulse-badge" : ""}`}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wide uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
