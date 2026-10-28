import React from "react";
import { useTranslation } from "react-i18next";

export interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
  ariaLabel?: string;
  className?: string;
  iconClassName?: string;
}

export const ArrowButton = ({
  direction,
  ariaLabel,
  className = "",
  iconClassName = "",
  disabled = false,
  onClick,
  type = "button",
  ...rest
}: ArrowButtonProps) => {
  const { t } = useTranslation();
  const isRight = direction === "right";
  const defaultLabel = isRight ? t("common.next") : t("common.previous");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || defaultLabel}
      className={`w-[clamp(55px,4.96vw,95px)] h-[clamp(55px,4.96vw,95px)] min-w-[55px] min-h-[55px] max-w-[95px] max-h-[95px] aspect-square rounded-full bg-white flex items-center justify-center shrink-0 cursor-pointer select-none transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${className}`}
      {...rest}
    >
      <img
        src="/svg/i_arrow.svg"
        alt=""
        className={`w-[32%] max-w-[28px] h-auto pointer-events-none transition-transform duration-200 ${
          isRight ? "rotate-180" : ""
        } ${iconClassName}`}
      />
    </button>
  );
};

export default ArrowButton;
