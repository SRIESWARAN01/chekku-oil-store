"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useCartStore } from "@/lib/cart-store";
import { useToastStore } from "@/lib/toast-store";

export interface ProductVariantData {
  id: string;
  sizeLabel: string;
  priceInr: number;
  stock: number;
}

export interface ProductCardData {
  slug: string;
  name: string;
  tagline: string;
  variant: string;
  startingFrom: number;
  batch: string;
  pressed: string;
  hueA: string;
  hueB: string;
  rating?: number;
  category?: string;
  description?: string;
  benefits?: string[];
  isVeg?: boolean;
  isBestSeller?: boolean;
  image?: string;
  brand?: string;
  inStock?: boolean;
  variants?: ProductVariantData[];
}

interface ProductCardProps {
  data: ProductCardData;
  className?: string;
  onViewDetails?: (product: ProductCardData) => void;
  whatsappNumber?: string;
  brand?: string;
}

export function ProductCard({
  data,
  className,
  onViewDetails,
  whatsappNumber = "918124165047",
  brand = "Thennaiyan",
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isFavorite, setIsFavorite] = useState(false);
  const { t, lang, translateProduct } = useLanguage();
  const [addingState, setAddingState] = useState<"idle" | "adding" | "added">("idle");
  const { addToast } = useToastStore();

  const localized = translateProduct(data.slug, data);

  const displayBrand = lang === "ta" ? t("brand") : brand;

  const whatsappText = lang === "ta"
    ? `வணக்கம், நான் *${localized.name}* ஆர்டர் செய்ய விரும்புகிறேன் (${displayBrand}).\nவிலை: ₹${data.startingFrom}`
    : `Hi, I'd like to order: *${localized.name}* from ${displayBrand}.\nPrice: ₹${data.startingFrom}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      // Pass the localized product data to the modal so it displays the correct language
      onViewDetails({
        ...data,
        name: localized.name,
        tagline: localized.tagline,
        description: localized.description,
        benefits: localized.benefits,
      });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer",
        "hover:shadow-lg transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* Upper area — Image with overlays */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={data.image || "/images/placeholder.png"}
          alt={localized.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top left favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute left-3 top-3 p-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-xs rounded-full transition-colors duration-200 z-10 text-white"
          aria-label="Add to favorites"
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors duration-200",
              isFavorite ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"
            )}
          />
        </button>

        {/* Bottom overlay for name & rating */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-8 flex items-end justify-between gap-2">
          <h3 className="font-body font-bold text-base text-white line-clamp-1">
            {localized.name}
          </h3>
          {data.rating && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/40 text-white text-[10px] font-bold rounded backdrop-blur-xs flex-shrink-0">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span>{data.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lower area — Body and actions */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
        {/* Price & Best Seller tag */}
        <div className="flex items-center justify-between">
          <span className="font-body font-extrabold text-lg text-leaf">
            ₹{Number(data.startingFrom).toFixed(2)}
          </span>
          {data.isBestSeller && (
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">
              {t("bestSeller")}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (addingState !== "idle") return;

              const size = data.variants?.[0]?.sizeLabel || "1L";
              const price = data.variants?.[0]?.priceInr || data.startingFrom;
              
              setAddingState("adding");
              addItem(data, 1, size, price);
              addToast(lang === "ta"
                ? `${localized.name} (${size}) கார்ட்டில் சேர்க்கப்பட்டது!`
                : `Added ${localized.name} (${size}) to cart!`
              );

              setTimeout(() => {
                setAddingState("added");
                setTimeout(() => {
                  setAddingState("idle");
                }, 1200);
              }, 600);
            }}
            className={cn(
              "btn-primary !px-2.5 !py-2 !text-xs rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 w-full",
              addingState === "adding" && "opacity-80 scale-95",
              addingState === "added" && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            )}
          >
            {addingState === "idle" && (
              <>
                <ShoppingCart size={13} strokeWidth={2.5} />
                <span>{t("add")}</span>
              </>
            )}
            {addingState === "adding" && (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Adding...</span>
              </>
            )}
            {addingState === "added" && (
              <>
                <svg className="h-3.5 w-3.5 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Added!</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="btn-secondary !px-2.5 !py-2 !text-xs rounded-full hover:bg-leaf/5"
          >
            {t("viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
}
