"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

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
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
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
