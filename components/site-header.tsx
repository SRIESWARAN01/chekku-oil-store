"use client";

import Link from "next/link";
import { ShoppingCart, QrCode, History } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "./language-toggle";

export function SiteHeader() {
  const { t } = useLanguage();
  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/story", label: "Story" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="container flex min-h-16 items-center justify-between gap-3 py-2">
        {/* Logo and Brand */}
        <Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90">
          <img
            src="/logo.png"
            alt={t("brand")}
            className="h-9 w-9 shrink-0 rounded-full border border-leaf/10 object-cover"
          />
          <span className="max-w-[42vw] truncate font-body text-sm font-bold tracking-tight text-ink sm:max-w-[48vw] sm:text-base lg:max-w-none lg:text-lg">
            {t("brand")}
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[8px] px-3 py-2 font-body text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-leaf"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center gap-1 text-gray-700 sm:gap-2">
          <LanguageToggle />

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-gray-50 lg:grid"
          >
            <ShoppingCart size={20} strokeWidth={2} />
          </Link>
          <button
            aria-label={t("scanQR")}
            onClick={() => alert("Table scanner initiated...")}
            className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-gray-50 sm:grid"
          >
            <QrCode size={20} strokeWidth={2} />
          </button>
          <Link
            href="/account/orders"
            aria-label={t("orderHistory")}
            className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-gray-50 lg:grid"
          >
            <History size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
