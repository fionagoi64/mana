import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface HeaderProps {
  cartCount: number;
  onOpenCart?: () => void;
  activeColor?: string;
}

export const Header = ({ cartCount, onOpenCart }: HeaderProps) => {
  const { i18n } = useTranslation();
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
    const current = i18n.language ? i18n.language.toUpperCase() : "EN";
    const nextLang = current.startsWith("FR") ? "en" : "fr";
    i18n.changeLanguage(nextLang);
  };

  const isFrench = Boolean(
    i18n.language && i18n.language.toLowerCase().startsWith("fr"),
  );

  let logoFill = "white";
  if (scrolled) {
    logoFill = "#0e0e0e";
  }

  let logoVisibilityClass = "opacity-100";
  if (atFooter) {
    logoVisibilityClass = "opacity-0 pointer-events-none -translate-x-4";
  }

  // Authentic Mana pill button styling (matching .btn50h)
  const pillBtnClass =
    "h-[clamp(44px,3.2vw,56px)] px-[clamp(16px,1.4vw,26px)] rounded-full bg-white text-[#0E0E0E] text-[clamp(15px,1.15vw,19px)] font-normal flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-[#fafafa] active:scale-95 transition-all cursor-pointer whitespace-nowrap";

  // Authentic Mana circle button styling (matching .btnRond4)
  const circleBtnClass =
    "w-[clamp(44px,3.2vw,56px)] h-[clamp(44px,3.2vw,56px)] rounded-full bg-white text-[#0E0E0E] text-[clamp(15px,1.15vw,19px)] font-normal flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-[#fafafa] active:scale-95 transition-all cursor-pointer relative shrink-0";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 pt-5 sm:pt-7 flex items-center justify-between pointer-events-none select-none transition-all duration-300">
      {/* Authentic Chunky MANA Logo */}
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

      {/* Floating Header Buttons (matching authentic Mana header) */}
      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
        {/* Shop Pill Button */}
        <button className={pillBtnClass} aria-label="Shop">
          <span>Shop</span>
          <svg
            className="w-3 h-2 text-[#0E0E0E]"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.46967 6.53033C5.76256 6.82322 6.23744 6.82322 6.53033 6.53033L11.3033 1.75736C11.5962 1.46447 11.5962 0.989593 11.3033 0.696699C11.0104 0.403806 10.5355 0.403806 10.2426 0.696699L6 4.93934L1.75736 0.696699C1.46447 0.403806 0.989593 0.403806 0.696699 0.696699C0.403806 0.989592 0.403806 1.46447 0.696699 1.75736L5.46967 6.53033ZM5.25 5L5.25 6L6.75 6L6.75 5L5.25 5Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Learn Pill Button */}
        <button
          className={`${pillBtnClass} hidden md:inline-flex`}
          aria-label="Learn"
        >
          <span>Learn</span>
          <svg
            className="w-3 h-2 text-[#0E0E0E]"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.46967 6.53033C5.76256 6.82322 6.23744 6.82322 6.53033 6.53033L11.3033 1.75736C11.5962 1.46447 11.5962 0.989593 11.3033 0.696699C11.0104 0.403806 10.5355 0.403806 10.2426 0.696699L6 4.93934L1.75736 0.696699C1.46447 0.403806 0.989593 0.403806 0.696699 0.696699C0.403806 0.989592 0.403806 1.46447 0.696699 1.75736L5.46967 6.53033ZM5.25 5L5.25 6L6.75 6L6.75 5L5.25 5Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Subscription Pill Button */}
        <button
          className={`${pillBtnClass} hidden sm:inline-flex`}
          aria-label="Subscription"
        >
          <span>Subscription</span>
        </button>

        {/* Language Circle Button: Fr / En */}
        <button
          onClick={toggleLanguage}
          className={circleBtnClass}
          aria-label="Toggle language"
        >
          <span>{isFrench ? "En" : "Fr"}</span>
        </button>

        {/* User Account Circle Button */}
        <button
          className={`${circleBtnClass} hidden sm:flex`}
          aria-label="Account"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1.33334C6.55648 1.33334 1.33331 6.55651 1.33331 13C1.33331 19.4435 6.55648 24.6667 13 24.6667C19.4435 24.6667 24.6666 19.4435 24.6666 13C24.6666 6.55651 19.4435 1.33334 13 1.33334Z"
              stroke="#0E0E0E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.98285 20.4037C3.98285 20.4037 6.58335 17.0833 13 17.0833C19.4167 17.0833 22.0183 20.4037 22.0183 20.4037"
              stroke="#0E0E0E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 13C13.9283 13 14.8185 12.6313 15.4749 11.9749C16.1313 11.3185 16.5 10.4283 16.5 9.5C16.5 8.57174 16.1313 7.6815 15.4749 7.02513C14.8185 6.36875 13.9283 6 13 6C12.0717 6 11.1815 6.36875 10.5251 7.02513C9.86875 7.6815 9.5 8.57174 9.5 9.5C9.5 10.4283 9.86875 11.3185 10.5251 11.9749C11.1815 12.6313 12.0717 13 13 13V13Z"
              stroke="#0E0E0E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Shopping Cart Circle Button */}
        <button
          onClick={onOpenCart}
          className={circleBtnClass}
          aria-label="Shopping Cart"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.8125 4.6894V6.25191H22.6562V9.34492L20.9229 14.8457H7.3209L5.36777 0.78125H0.78125V2.34375H4.00723L5.96035 16.4082H22.0687L24.2188 9.58526V4.6894H7.8125ZM8.6418 17.9855C7.81328 17.9865 7.01898 18.316 6.43313 18.9019C5.84728 19.4877 5.51774 20.282 5.5168 21.1105C5.5168 21.9394 5.84604 22.7342 6.43209 23.3203C7.01814 23.9063 7.81299 24.2355 8.6418 24.2355C9.4706 24.2355 10.2655 23.9063 10.8515 23.3203C11.4376 22.7342 11.7668 21.9394 11.7668 21.1105C11.7659 20.282 11.4363 19.4877 10.8505 18.9019C10.2646 18.316 9.47031 17.9865 8.6418 17.9855ZM8.6418 22.673C8.33276 22.673 8.03067 22.5814 7.77372 22.4097C7.51677 22.238 7.3165 21.994 7.19824 21.7085C7.07997 21.423 7.04903 21.1088 7.10932 20.8057C7.16961 20.5026 7.31842 20.2242 7.53694 20.0057C7.75546 19.7872 8.03387 19.6384 8.33697 19.5781C8.64006 19.5178 8.95423 19.5487 9.23974 19.667C9.52525 19.7852 9.76928 19.9855 9.94097 20.2425C10.1127 20.4994 10.2043 20.8015 10.2043 21.1105C10.2038 21.5248 10.039 21.9219 9.74611 22.2149C9.45319 22.5078 9.05605 22.6726 8.6418 22.673ZM19.5793 17.9855C18.7508 17.9865 17.9565 18.316 17.3706 18.9019C16.7848 19.4877 16.4552 20.282 16.4543 21.1105C16.4543 21.9394 16.7835 22.7342 17.3696 23.3203C17.9556 23.9063 18.7505 24.2355 19.5793 24.2355C20.4081 24.2355 21.203 23.9063 21.789 23.3203C22.3751 22.7342 22.7043 21.9394 22.7043 21.1105C22.7034 20.282 22.3738 19.4877 21.788 18.9019C21.2021 18.316 20.4078 17.9865 19.5793 17.9855ZM19.5793 22.673C19.2703 22.673 18.9682 22.5814 18.7112 22.4097C18.4543 22.238 18.254 21.994 18.1357 21.7085C18.0175 21.423 17.9865 21.1088 18.0468 20.8057C18.1071 20.5026 18.2559 20.2242 18.4744 20.0057C18.693 19.7872 18.9714 19.6384 19.2745 19.5781C19.5776 19.5178 19.8917 19.5487 20.1772 19.667C20.4627 19.7852 20.7068 19.9855 20.8785 20.2425C21.0502 20.4994 21.1418 20.8015 21.1418 21.1105C21.1413 21.5248 20.9765 21.9219 20.6836 22.2149C20.3907 22.5078 19.9935 22.6726 19.5793 22.673Z"
              fill="#0E0E0E"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#0E0E0E] text-white rounded-full text-[11px] font-semibold flex items-center justify-center leading-none">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
