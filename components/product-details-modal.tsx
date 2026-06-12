"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  MessageCircle, 
  X, 
  Award, 
  ShieldAlert, 
  FlaskConical, 
  ShoppingCart 
} from "lucide-react";
import type { ProductCardData } from "./product-card";
import { useLanguage } from "@/lib/language-context";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductCardData | null;
  whatsappNumber?: string;
  brand?: string;
}

const INR = "\u20B9";

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  whatsappNumber = "918124165047",
  brand = "Thennaiyan",
}: ProductDetailsModalProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!isOpen || !product) return null;

  const displayBrand = lang === "ta" ? t("brand") : brand;

  // Selected variant details
  const variantsList = product.variants && product.variants.length > 0 ? product.variants : [];
  const hasVariants = variantsList.length > 0;
  const activeVariant = hasVariants ? variantsList[selectedVariantIndex] : null;

  const activeSize = activeVariant ? activeVariant.sizeLabel : "1L";
  const activePrice = activeVariant ? activeVariant.priceInr : product.startingFrom;
  const activeStock = activeVariant ? activeVariant.stock : (product.inStock ? 99 : 0);

  // Generate dynamic sharing link for the product in the WhatsApp message
  const productLink = typeof window !== "undefined"
    ? `${window.location.origin}/shop?product=${product.slug}`
    : `https://chekku-oil-store.vercel.app/shop?product=${product.slug}`;

  const whatsappText = lang === "ta"
    ? `வணக்கம், நான் *${product.name}* ஆர்டர் செய்ய விரும்புகிறேன் (${product.variant} - ${activeSize}) - ${displayBrand}.\nதொகுதி: ${product.batch}\nஆட்டப்பட்டது: ${product.pressed}\nவிலை: ₹${activePrice}\nதயாரிப்பு விவரம்: ${productLink}`
    : `Hi, I want to order ${product.name} (${product.variant} - ${activeSize}) from ${displayBrand}.\nBatch: ${product.batch}\nPressed: ${product.pressed}\nPrice: ${INR}${activePrice}\nProduct Link: ${productLink}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  // Handle Add to Cart action
  const handleAddToCart = () => {
    addItem(product, 1, activeSize, activePrice);
    onClose();
    router.push("/cart");
  };

  // Determine batch-specific lab report values based on product slug
  const isVirgin = product.slug.includes("virgin");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm overflow-y-auto">
      <section className="w-full max-w-md my-8 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col">
        {/* Header Visual */}
        <div
          className="relative aspect-[16/9] flex-shrink-0"
          style={{
            background: `radial-gradient(circle at 28% 18%, rgba(255,255,255,0.78), transparent 26%), linear-gradient(150deg, ${product.hueA}, ${product.hueB})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#111827] hover:bg-white transition-colors duration-200"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75">
              {t("batchLabel")} {product.batch} - {product.pressed}
            </p>
            <h2 className="mt-1 truncate font-body text-xl font-extrabold text-white">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh] scrollbar-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-bold text-gray-400 uppercase tracking-wide">
                {product.variant}
              </p>
              <p className="mt-1 font-body text-2xl font-extrabold text-leaf">
                {INR}
                {activePrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-leaf-mist px-3 py-1 font-body text-[10px] font-extrabold uppercase tracking-wide text-leaf border border-leaf/10">
                {t("naturalBadge")}
              </span>
              <div className="mt-1 text-[10px] font-bold font-mono">
                {activeStock > 0 ? (
                  <span className="text-leaf">● In Stock</span>
                ) : (
                  <span className="text-red-500">○ Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Size Variant Selector */}
          {hasVariants && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {variantsList.map((v, idx) => (
                  <button
                    key={v.id || v.sizeLabel}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={cn(
                      "px-4 py-2 text-xs font-bold font-body rounded-full border transition-all select-none",
                      v.stock === 0
                        ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                        : selectedVariantIndex === idx
                        ? "border-leaf bg-leaf text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-leaf/40"
                    )}
                  >
                    {v.sizeLabel} - {INR}{v.priceInr}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="font-body text-sm font-semibold leading-relaxed text-gray-600 bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
            {product.description || product.tagline}
          </p>

          {/* Benefits Block */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-body text-xs font-extrabold uppercase tracking-wider text-gray-400">
                {t("benefitsHeading")}
              </h3>
              <div className="grid gap-2">
                {product.benefits.slice(0, 4).map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2.5 rounded-lg bg-gray-50/50 border border-gray-100 px-3 py-2 font-body text-xs font-bold text-gray-700"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf text-white shadow-xs">
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Batch Purity Certificate Card */}
          <div className="rounded-xl border border-[#fbbf24]/20 bg-[#fefdfa] p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#fbbf24]/10 pb-2">
              <FlaskConical size={16} className="text-[#d97706]" />
              <div>
                <h3 className="font-body text-xs font-extrabold text-[#d97706] uppercase tracking-wide">
                  {t("purityCertTitle")}
                </h3>
                <p className="font-body text-[9px] font-bold text-gray-400">
                  {t("purityCertSubtitle")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-body font-bold text-gray-700">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-400 font-semibold">{t("extractionMethod")}:</span>
                <span className="text-ink">{isVirgin ? "Centrifuge" : "Wood Press"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-400 font-semibold">{t("origin")}:</span>
                <span className="text-ink">Madurai, TN</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-400 font-semibold">FFA:</span>
                <span className="text-[#217743]">{isVirgin ? "0.08%" : "0.12%"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-400 font-semibold">Peroxide:</span>
                <span className="text-[#217743]">0.6 meq/kg</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-400 font-semibold">Moisture:</span>
                <span className="text-[#217743]">0.08%</span>
              </div>
              {isVirgin && (
                <div className="flex justify-between border-b border-gray-100 py-1 col-span-2">
                  <span className="text-gray-400 font-semibold">{t("lauricAcid")}:</span>
                  <span className="text-[#217743]">51.4% (Rich Immunity)</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-gray-400/90 font-bold text-center pt-1 italic">
              * {t("certifiedPure")}
            </p>
          </div>

          {/* Form Actions */}
          <div className="space-y-2.5 pt-1">
            {activeStock > 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-[#1f6b3b] hover:bg-[#154b29] text-white font-body text-xs font-extrabold transition-all duration-200 shadow-md select-none"
              >
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-gray-200 text-gray-400 font-body text-xs font-extrabold cursor-not-allowed select-none"
              >
                <span>Out of Stock</span>
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 font-body text-xs font-bold transition-all duration-200 select-none"
              >
                Close
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-leaf text-leaf font-body text-xs font-bold hover:bg-leaf/5 transition-all duration-200 select-none"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
