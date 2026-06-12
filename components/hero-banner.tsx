"use client";

import { useLanguage } from "@/lib/language-context";

interface HeroBannerProps {
  businessName: string;
  heroBannerImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export function HeroBanner({ 
  businessName, 
  heroBannerImage,
  heroTitle,
  heroSubtitle
}: HeroBannerProps) {
  const { t, lang } = useLanguage();

  const displayTitle = heroTitle || (lang === "ta" ? t("businessName") : businessName);
  const displaySubtitle = heroSubtitle || t("taglineSubtitle");

  return (
    <section 
      className="relative text-white text-center py-16 px-4 md:py-24 lg:py-32 transition-all duration-300 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: heroBannerImage ? `url(${heroBannerImage})` : "none",
        backgroundColor: heroBannerImage ? "transparent" : "#1f6b3b",
      }}
    >
      {/* Overlay to ensure high readability and contrast */}
      {heroBannerImage && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px] z-0" />
      )}

      <div className="relative max-w-3xl mx-auto flex flex-col items-center z-10">
        {/* Coconut Emoji */}
        <span
          className="text-4xl md:text-5xl mb-4 animate-bounce"
          style={{ animationDuration: "2.5s" }}
        >
          🥥
        </span>

        <h1 className="font-body font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-4 leading-tight">
          {displayTitle}
        </h1>

        <p className="font-body text-base md:text-lg lg:text-xl font-bold text-white/95 mb-2 max-w-xl">
          {displaySubtitle}
        </p>
        <p className="font-body text-xs md:text-sm text-white/80 mb-8 max-w-lg">
          {t("exploreWhatsApp")}
        </p>

        <a
          href="#products"
          className="px-8 py-3 bg-white text-leaf hover:bg-gray-100 font-bold rounded-full text-sm md:text-base shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {t("browseProducts")}
        </a>
      </div>
    </section>
  );
}
