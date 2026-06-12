"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BookText,
  Settings,
  ExternalLink,
  LogOut,
  BarChart3,
  ShoppingCart,
  Ticket,
  Folder,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/journal", label: "Journal", icon: BookText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between lg:hidden px-3 py-2 bg-white/10 hover:bg-white/20 text-kernel rounded-sm text-sm font-semibold transition-colors select-none"
      >
        <span className="flex items-center gap-2">
          <Menu size={16} />
          Navigation Menu
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Navigation list */}
      <nav className={cn("lg:block space-y-1", isOpen ? "block animate-in fade-in duration-200" : "hidden")}>
        {LINKS.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)} // close on click
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm font-body text-sm transition-colors",
                active
                  ? "bg-oil text-ink font-medium"
                  : "text-kernel/70 hover:text-kernel hover:bg-kernel/10",
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {l.label}
            </Link>
          );
        })}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-sm font-body text-sm text-kernel/50 hover:text-kernel hover:bg-kernel/10 transition-colors"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          View site
        </a>

        <div className="pt-2 border-t border-kernel/10 mt-2">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-body text-sm text-red-300 hover:text-red-100 hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.75} />
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
