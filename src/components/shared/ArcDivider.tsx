import React, { forwardRef } from "react";

export interface ArcDividerProps {
  variant?: "top" | "bottom";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ArcDivider = forwardRef<SVGSVGElement, ArcDividerProps>(
  ({ variant = "top", color = "#FEF7E6", className = "", style }, ref) => {
    const isTop = variant === "top";
    const pathD = isTop
      ? "M-2 95L0 92.0674C528.5 -28.9327 977.5 -32.4328 1517 92.0674L1519 95H-2Z"
      : "M-2 -2H1519L1517 0.182373C988.391 121.182 539.391 124.682 0 0.18224L-2 -2Z";

    return (
      <svg
        ref={ref}
        className={`w-full block pointer-events-none ${className}`}
        style={style}
        viewBox="0 0 1517 93"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d={pathD} fill={color} />
      </svg>
    );
  },
);

export default ArcDivider;
