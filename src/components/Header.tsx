import React, { useState, useEffect } from "react";
import { ChevronDown, ShoppingBag, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeColor?: string;
}

export const Header = ({ cartCount, onOpenCart, activeColor }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [learnMenuOpen, setLearnMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 350);
      const footerEl = document.getElementById("shopify-section-footer");
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        setAtFooter(rect.top <= 120);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "EN" ? "FR" : "EN";
    i18n.changeLanguage(nextLang);
  };

  const scrollTo = (id: string) => {
    setShopMenuOpen(false);
    setLearnMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  let logoFill = "white";
  if (scrolled) {
    logoFill = "#0e0e0e";
  }

  let logoVisibilityClass = "opacity-100";
  if (atFooter) {
    logoVisibilityClass = "opacity-0 pointer-events-none -translate-x-4";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between pointer-events-none select-none transition-all duration-300">
      {/* Authentic Chunky MANA Logo (White on hero, black on beige section) */}
      <a
        href="#"
        className={`pointer-events-auto flex items-center transition-all duration-300 hover:scale-105 active:scale-95 ${logoVisibilityClass}`}
        aria-label="MANA Yerba Maté"
      >
        <svg
          className="w-28 sm:w-36 h-auto drop-shadow-xs transition-colors duration-300"
          viewBox="0 0 133 50"
          fill={logoFill}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M112.279 6.69161L106.91 49.2856L115.005 49.2856L116.444 37.8657L123.471 37.8657L124.91 49.2856L133.005 49.2856L127.636 6.70133C127.338 4.03343 125.017 0.024298 119.96 0.0242982C114.903 0.0242984 112.577 4.02857 112.279 6.69647L112.279 6.69161ZM118.068 24.9733L118.068 24.9927L121.847 24.9927L121.847 24.9733L122.467 29.8814L117.448 29.8814L118.068 24.9733ZM44.4845 6.68189C44.187 4.014 41.8658 0.00486191 36.8087 0.00486213C31.7517 0.00486235 29.4255 4.01886 29.128 6.68675L26.8214 24.9927L23.0371 24.9927L20.7256 6.6819C20.4282 4.014 18.1069 0.00486295 13.0498 0.00486317C7.99278 0.00486339 5.66663 4.01886 5.36915 6.68676L-3.12255e-08 49.2856L8.09519 49.2856L11.1577 24.9927L14.942 24.9927L17.2486 43.3181C17.5461 45.986 19.8673 50 24.9244 50C29.9814 50 32.3076 45.986 32.6051 43.3181L34.9166 24.9927L38.7008 24.9927L41.0075 43.3181C41.3001 45.986 43.6262 50 48.6833 50C53.7403 50 56.0665 45.9909 56.364 43.3181L57.0467 37.8851L64.0788 37.8851L64.7615 43.3084C65.059 45.9763 67.3851 50 72.4422 50C77.4992 50 79.8254 45.9714 80.1228 43.2987L82.4295 24.9927L86.2137 24.9927L88.5204 43.3035C88.8179 45.9714 91.1391 49.9806 96.1962 49.9806C101.253 49.9806 103.579 45.9666 103.877 43.2987L109.241 0.719211L101.146 0.719211L98.0883 24.9927L94.304 24.9927L91.9974 6.67703C91.6999 4.00914 89.3738 0.00485983 84.3167 0.00486005C79.2597 0.00486027 76.9335 4.00914 76.6361 6.67703L72.7055 37.8851L72.1691 37.8851L68.2385 6.68189C67.941 4.014 65.6198 0.00486087 60.5627 0.00486109C55.5057 0.00486131 53.1795 4.01886 52.882 6.68675L48.9515 37.8851L48.4151 37.8851L44.4796 6.68189L44.4845 6.68189ZM58.0513 29.9009L58.6706 24.9927L62.4549 24.9927L63.0742 29.9009L58.0513 29.9009Z" />
        </svg>
      </a>

      {/* Floating White Pills Navigation */}
      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Shop Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShopMenuOpen(!shopMenuOpen);
              setLearnMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-neutral-900 font-bold text-sm tracking-wide shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            <span>{t("nav.shop_cases").replace(" 12-Packs", "")}</span>
            <ChevronDown className="w-4 h-4 text-neutral-600 transition-transform duration-200" />
          </button>

          {shopMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-left">
              <button
                onClick={() => scrollTo("shop-products")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl"
              >
                {t("shop.discovery_title")}
              </button>
              <button
                onClick={() => scrollTo("shop-products")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl"
              >
                12-Pack Cases
              </button>
            </div>
          )}
        </div>

        {/* Learn Dropdown Pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setLearnMenuOpen(!learnMenuOpen);
              setShopMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-neutral-900 font-bold text-sm tracking-wide shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            <span>Learn</span>
            <ChevronDown className="w-4 h-4 text-neutral-600 transition-transform duration-200" />
          </button>

          {learnMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-left">
              <button
                onClick={() => scrollTo("why-mana")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl"
              >
                {t("nav.why_yerba_mate")}
              </button>
              <button
                onClick={() => scrollTo("taste-matrix")}
                className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl"
              >
                {t("nav.taste_profile")}
              </button>
            </div>
          )}
        </div>

        {/* Subscription Pill */}
        <button
          onClick={() => scrollTo("shop-products")}
          className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-white text-neutral-900 font-bold text-sm tracking-wide shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
        >
          Subscription
        </button>

        {/* Language Pill: FR / EN */}
        <button
          onClick={toggleLanguage}
          className="px-4 py-2.5 rounded-full bg-white text-neutral-900 font-bold text-sm uppercase tracking-wide shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
        >
          {i18n.language === "EN" ? "Fr" : "En"}
        </button>

        {/* User Account Circle Button */}
        <button
          onClick={() => alert("Account simulation")}
          className="hidden sm:flex w-10 h-10 rounded-full bg-white items-center justify-center text-neutral-900 shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Account"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Cart Circle Button */}
        <button
          onClick={onOpenCart}
          className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-950 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
