import React, {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

export type ShadowButtonVariant = "text" | "icon" | "both";
export type ShadowButtonSize = "sm" | "md" | "lg" | "circle" | "custom";
export type ShadowButtonRounded = "full" | "2xl" | "xl" | "lg" | "md" | "none";

interface BaseShadowButtonProps {
  variant?: ShadowButtonVariant;
  size?: ShadowButtonSize;
  rounded?: ShadowButtonRounded;
  bg?: string;
  shadowColor?: string;
  textColor?: string;
  borderColor?: string;
  shadowOffset?: number;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

export type ShadowButtonAsAnchor = BaseShadowButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseShadowButtonProps> & {
    href: string;
  };

export type ShadowButtonAsButton = BaseShadowButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseShadowButtonProps> & {
    href?: undefined;
  };

export type ShadowButtonProps = ShadowButtonAsAnchor | ShadowButtonAsButton;

const isAnchor = (props: ShadowButtonProps): props is ShadowButtonAsAnchor => {
  return "href" in props && typeof props.href === "string";
};

const ROUNDED_MAP: Record<ShadowButtonRounded, string> = {
  full: "rounded-full",
  "2xl": "rounded-2xl",
  xl: "rounded-xl",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

export const ShadowButton: React.FC<ShadowButtonProps> = (props) => {
  const {
    variant = "text",
    size = "md",
    rounded = "full",
    bg = "#ffd372",
    shadowColor = "#2b3d73",
    textColor,
    borderColor,
    shadowOffset = 4,
    icon,
    children,
    className = "",
    innerClassName = "",
    onClick,
    disabled = false,
  } = props;
  const roundedClass = ROUNDED_MAP[rounded] || "rounded-full";

  // Size styles
  let sizeClass = "";
  if (size === "circle") {
    sizeClass = "w-13 h-13 sm:w-16 sm:h-16 aspect-square p-0";
  } else if (size === "sm") {
    sizeClass = "px-5 py-2 text-sm";
  } else if (size === "md") {
    sizeClass = "px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg";
  } else if (size === "lg") {
    sizeClass =
      "px-10 sm:px-14 py-3.5 sm:py-4 text-base sm:text-xl font-bold min-w-[200px] sm:min-w-[260px]";
  }

  // Border style: defaults to shadowColor if not explicitly specified so every button has a clean outline
  const finalBorderColor = borderColor ?? shadowColor;
  const borderStyle =
    finalBorderColor && finalBorderColor !== "none" && finalBorderColor !== "transparent"
      ? `1.5px solid ${finalBorderColor}`
      : undefined;

  // Render inner content based on variant
  const renderContent = () => {
    if (variant === "icon") {
      return (
        <span className="flex items-center justify-center w-full h-full pointer-events-none">
          {icon || children}
        </span>
      );
    }

    if (variant === "both") {
      return (
        <span className="flex items-center justify-center gap-2.5 pointer-events-none">
          {icon && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </span>
      );
    }

    return (
      <span className="flex items-center justify-center pointer-events-none tracking-wide">
        {children}
      </span>
    );
  };

  const sharedContent = (
    <>
      {/* 1. Authentic 3D Shadow Base Layer Underneath */}
      <div
        className={`absolute inset-0 ${roundedClass} pointer-events-none transition-transform duration-100 ease-out`}
        style={{
          backgroundColor: shadowColor,
          transform: `translateY(${shadowOffset}px)`,
        }}
      />

      {/* 2. Top Interactive Button Surface: On hover, smoothly glides down by shadowOffset so it covers the bottom shadow fill, leaving only the border */}
      <div
        className={`shadow-btn-top relative ${roundedClass} ${sizeClass} flex items-center justify-center ${innerClassName}`}
        style={{
          backgroundColor: bg,
          color: textColor,
          border: borderStyle,
          ['--shadow-offset' as string]: `${shadowOffset}px`,
        }}
      >
        {renderContent()}
      </div>
    </>
  );

  const containerClasses = `relative inline-flex group cursor-pointer select-none transition-transform active:scale-[0.98] shrink-0 ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } ${className}`;

  if (isAnchor(props)) {
    const {
      variant: _v,
      size: _s,
      rounded: _r,
      bg: _b,
      shadowColor: _sc,
      textColor: _tc,
      borderColor: _bc,
      shadowOffset: _so,
      icon: _i,
      children: _c,
      className: _cl,
      innerClassName: _icl,
      onClick: _oc,
      disabled: _d,
      target,
      rel,
      href,
      ...anchorRest
    } = props;

    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
        onClick={onClick}
        className={containerClasses}
        {...anchorRest}
      >
        {sharedContent}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    rounded: _r,
    bg: _b,
    shadowColor: _sc,
    textColor: _tc,
    borderColor: _bc,
    shadowOffset: _so,
    icon: _i,
    children: _c,
    className: _cl,
    innerClassName: _icl,
    onClick: _oc,
    disabled: _d,
    type = "button",
    ...buttonRest
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClasses}
      {...buttonRest}
    >
      {sharedContent}
    </button>
  );
};

export default ShadowButton;
