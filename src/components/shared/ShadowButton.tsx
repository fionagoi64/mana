import React from "react";
import {
  ShadowButtonProps,
  ShadowButtonRounded,
  ShadowButtonSize,
} from "../../types/types.ts";

const ROUNDED_MAP: Record<ShadowButtonRounded, string> = {
  full: "rounded-full",
  xl: "rounded-xl",
};

const SIZE_MAP: Record<ShadowButtonSize, string> = {
  circle: "w-13 h-13 sm:w-16 sm:h-16 aspect-square p-0 shrink-0",
  lg: "px-7 sm:px-9 py-2.5 sm:py-3 text-[clamp(22px,1.72vw,33px)] font-normal leading-[1.3]",
};

export const ShadowButton = ({
  children,
  icon,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  bg = "#ffd372",
  shadowColor = "#2b3d73",
  textColor,
  borderColor,
  shadowOffset = 2.5,
  rounded = "full",
  size = "lg",
  variant = "text",
  className = "",
  innerClassName = "",
  onClick,
  ...rest
}: ShadowButtonProps) => {
  const roundedClass = ROUNDED_MAP[rounded] || "rounded-full";
  const sizeClass = SIZE_MAP[size] ?? "";
  const finalBorder = borderColor ?? shadowColor;
  const borderStyle =
    finalBorder && finalBorder !== "none"
      ? `1.5px solid ${finalBorder}`
      : undefined;

  const content = (
    <>
      <div
        className={`absolute inset-0 ${roundedClass} pointer-events-none transition-transform duration-100 ease-out`}
        style={{
          backgroundColor: shadowColor,
          transform: `translateY(${shadowOffset}px)`,
        }}
      />
      <div
        className={`shadow-btn-top relative ${roundedClass} ${sizeClass} flex items-center justify-center w-fit whitespace-nowrap ${innerClassName}`}
        style={{
          backgroundColor: bg,
          color: textColor,
          border: borderStyle,
          ["--shadow-offset" as string]: `${shadowOffset}px`,
        }}
      >
        {icon && (
          <span className="flex items-center justify-center pointer-events-none">
            {icon}
          </span>
        )}
        {children && (
          <span className="flex items-center justify-center pointer-events-none">
            {children}
          </span>
        )}
      </div>
    </>
  );

  const isText =
    variant === "text" ||
    (variant !== "icon" && size !== "circle" && Boolean(children));
  const heightClass = isText ? "h-[55px] lg:h-[95px]" : "";

  const containerClasses = `${heightClass} relative inline-flex w-fit group cursor-pointer select-none transition-transform active:scale-[0.98] shrink-0 ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
        onClick={onClick}
        className={containerClasses}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={containerClasses}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};

export default ShadowButton;
