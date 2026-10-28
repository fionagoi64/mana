import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export interface LottieBoxProps {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LottieBox = ({
  path,
  loop = true,
  autoplay = true,
  className,
  style,
}: LottieBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      path,
    });
    return () => {
      anim.destroy();
    };
  }, [path, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default LottieBox;
