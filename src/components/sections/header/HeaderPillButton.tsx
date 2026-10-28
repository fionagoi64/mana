export interface HeaderPillButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

const PILL_BTN_CLASS =
  "h-[clamp(44px,3.2vw,56px)] px-[clamp(16px,1.4vw,26px)] rounded-full bg-white text-[clamp(15px,1.15vw,25px)] font-normal flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/5 bounce-btn cursor-pointer whitespace-nowrap select-none";

export const HeaderPillButton = ({
  label,
  onClick,
  className = "hidden md:inline-flex",
}: HeaderPillButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`${PILL_BTN_CLASS} ${className}`.trim()}
    aria-label={label}
  >
    <span>{label}</span>
  </button>
);

export default HeaderPillButton;

