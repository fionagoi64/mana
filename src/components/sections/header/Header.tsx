import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n.ts";
import { NAV_KEYS, HEADER_ICON_ACTIONS } from "../../../data/header.ts";
import { HeaderLogo } from "./HeaderLogo.tsx";
import { HeaderPillButton } from "./HeaderPillButton.tsx";
import { HeaderCircleButton } from "./HeaderCircleButton.tsx";

export interface HeaderProps {
  cartCount: number;
}

export const Header = ({ cartCount: _cartCount }: HeaderProps) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const [logoHidden, setLogoHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setScrolled(currentScrollY > 350);
      const footerEl = document.getElementById("shopify-section-footer");
      if (footerEl) {
        setAtFooter(footerEl.getBoundingClientRect().top <= 120);
      }

      if (currentScrollY <= 30) {
        setLogoHidden(false);
      } else if (delta > 3 && currentScrollY > 50) {
        setLogoHidden(true);
      } else if (delta < -3) {
        setLogoHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(t("header.nextLang"));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 pt-5 sm:pt-7 flex items-center justify-between pointer-events-none select-none transition-all duration-300">
      <HeaderLogo scrolled={scrolled} visible={!logoHidden && !atFooter} />

      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 relative">
        {NAV_KEYS.map((key) => (
          <HeaderPillButton key={key} label={t(`header.nav.${key}`)} />
        ))}

        <HeaderCircleButton
          onClick={toggleLanguage}
          className="hidden md:flex"
          ariaLabel={t("header.toggleLangAria")}
        >
          <span>{t("header.toggleLang")}</span>
        </HeaderCircleButton>

        {HEADER_ICON_ACTIONS.map((action) => (
          <HeaderCircleButton
            key={action.id}
            ariaLabel={t(action.ariaKey)}
            iconSrc={action.iconSrc}
            className={action.className}
            iconClassName={action.iconClassName}
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;

