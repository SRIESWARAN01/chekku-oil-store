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
      className="relative bg-cover bg-center bg-no-repeat px-4 py-12 text-center text-white transition-all duration-300 sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-28"
      style={{
        backgroundImage: heroBannerImage ? `url(${heroBannerImage})` : "none",
        backgroundColor: heroBannerImage ? "transparent" : "#1f6b3b",
      }}
    >
      {/* Overlay to ensure high readability and contrast */}
      {heroBannerImage && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px] z-0" />
      )}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        {/* Coconut Emoji */}
        <span
          className="mb-4 text-4xl animate-bounce md:text-5xl"
          style={{ animationDuration: "2.5s" }}
        >
          🥥
        </span>

        <h1 className="mb-4 max-w-full font-body text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {displayTitle}
        </h1>

        <p className="mb-2 max-w-xl font-body text-base font-bold text-white/95 md:text-lg lg:text-xl">
          {displaySubtitle}
        </p>
        <p className="mb-8 max-w-lg font-body text-xs text-white/80 md:text-sm">
          {t("exploreWhatsApp")}
        </p>

        <a
          href="#products"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-leaf shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95 sm:px-8 md:text-base"
        >
          {t("browseProducts")}
        </a>
      </div>
    </section>
  );
}
