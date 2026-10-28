import { useTranslation } from "react-i18next";

export interface HeaderLogoProps {
  scrolled: boolean;
  visible: boolean;
}

export const HeaderLogo = ({ scrolled, visible }: HeaderLogoProps) => {
  const { t } = useTranslation();
  const visibilityClass = visible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "-translate-y-28 opacity-0 pointer-events-none";

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`pointer-events-auto flex items-center transition-all duration-300 ease-out z-50 ${visibilityClass}`}
      aria-label={t("header.brandAria")}
    >
      <img
        src="/svg/logo.svg"
        alt=""
        className={`w-28 sm:w-36 h-auto drop-shadow-xs transition-all duration-300 ${
          scrolled ? "" : "brightness-0 invert"
        }`}
      />
    </a>
  );
};

export default HeaderLogo;

