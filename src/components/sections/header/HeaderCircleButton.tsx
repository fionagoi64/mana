import { ReactNode } from "react";

export interface HeaderCircleButtonProps {
  ariaLabel: string;
  onClick?: () => void;
  iconSrc?: string;
  iconClassName?: string;
  className?: string;
  children?: ReactNode;
}

const CIRCLE_BTN_CLASS =
  "w-[clamp(44px,3.2vw,56px)] h-[clamp(44px,3.2vw,56px)] rounded-full bg-white text-[clamp(15px,1.15vw,19px)] font-normal flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/5 bounce-btn cursor-pointer relative shrink-0 select-none";

export const HeaderCircleButton = ({
  ariaLabel,
  onClick,
  iconSrc,
  iconClassName = "w-5 h-5 sm:w-6 sm:h-6 pointer-events-none",
  className = "",
  children,
}: HeaderCircleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`${CIRCLE_BTN_CLASS} ${className}`.trim()}
    aria-label={ariaLabel}
  >
    {iconSrc ? (
      <img src={iconSrc} alt="" className={iconClassName} />
    ) : (
      children
    )}
  </button>
);

export default HeaderCircleButton;

