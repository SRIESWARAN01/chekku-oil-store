"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

export function IntroAnimation() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user has already seen the intro animation in this session
    const hasSeen = sessionStorage.getItem("has_seen_intro");
    if (!hasSeen) {
      setShow(true);
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Stage animations:
      // Start exit animation at 2.4 seconds
      const exitTimer = setTimeout(() => {
        setExiting(true);
      }, 2400);

      // Unmount component at 3.0 seconds
      const finishTimer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
        sessionStorage.setItem("has_seen_intro", "true");
      }, 3000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  // Handler to skip the animation immediately on user click
  const handleSkip = () => {
    setExiting(true);
    setShow(false);
    document.body.style.overflow = "";
    sessionStorage.setItem("has_seen_intro", "true");
  };

  if (!mounted || !show) {
    return null;
  }

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#03140a] to-[#072412] cursor-pointer transition-all select-none ${
        exiting ? "animate-overlay-exit" : ""
      }`}
    >
      {/* Premium background radial golden flare */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(218,165,32,0.18)_0%,rgba(0,0,0,0)_75%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-gold-glow pointer-events-none" />

      {/* Intro Animation Content Box */}
      <div className="flex flex-col items-center max-w-md px-6 text-center z-10 pointer-events-none">
        
        {/* Transparent Logo with entrance transition */}
        <div className="relative mb-6 animate-logo-entrance">
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 blur-xl scale-110 pointer-events-none" />
          <img
            src="/logo.png"
            alt="Thennaiyan logo"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-yellow-500/20 object-cover shadow-2xl relative"
          />
        </div>

        {/* Brand Title with fade-slide reveal */}
        <h1 
          className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-50 animate-text-reveal"
          style={{ animationDelay: "400ms" }}
        >
          {t("brand") || "Thennaiyan Coconut Company"}
        </h1>

        {/* Separator line with gold sweep style */}
        <div 
          className="relative w-28 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent my-4 overflow-hidden animate-text-reveal"
          style={{ animationDelay: "800ms" }}
        >
          <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-yellow-200 to-transparent animate-line-sweep" />
        </div>

        {/* Tagline */}
        <p 
          className="font-mono text-xs uppercase tracking-[0.25em] text-yellow-300/70 font-semibold animate-text-reveal"
          style={{ animationDelay: "1000ms" }}
        >
          Pure • Cold-Pressed • Traditional
        </p>
      </div>

      {/* Silent hint to skip */}
      <div 
        className="absolute bottom-8 text-[10px] font-mono tracking-widest text-white/30 uppercase animate-text-reveal pointer-events-none"
        style={{ animationDelay: "1400ms" }}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}
