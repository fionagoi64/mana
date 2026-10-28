import React, { useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import lottie from "lottie-web";
import { FeatureCardConfig } from "../../../types/types.ts";

export interface FeatureCardProps {
  card: FeatureCardConfig;
  headerBg?: string;
  className?: string;
  bodyClassName?: string;
}

export const FeatureCard = ({
  card,
  headerBg = "#f15b40",
  className = "",
  bodyClassName = "",
}: FeatureCardProps) => {
  const { t } = useTranslation();
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  const title = t(`features.cards.${card.key}.title`);
  const desc = t(`features.cards.${card.key}.desc`);

  const syncLottieColors = useCallback((color: string) => {
    const el = lottieContainerRef.current;
    if (!el) return;
    el.querySelectorAll<SVGElement>("path, g").forEach((p) => {
      if (p.hasAttribute("stroke") && p.getAttribute("stroke") !== "none") {
        p.setAttribute("stroke", color);
        p.style.stroke = color;
      }
      if (p.hasAttribute("fill") && p.getAttribute("fill") !== "none") {
        p.setAttribute("fill", color);
        p.style.fill = color;
      }
    });
  }, []);

  useEffect(() => {
    if (!lottieContainerRef.current || !card.lottiePath) return;

    const anim = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: card.lottiePath,
    });

    const handleLoaded = () => syncLottieColors(headerBg);
    anim.addEventListener("DOMLoaded", handleLoaded);

    return () => {
      anim.destroy();
    };
  }, [card.lottiePath]);

  useEffect(() => {
    syncLottieColors(headerBg);
  }, [headerBg, syncLottieColors]);

  return (
    <div
      className={`w-[88vw] max-w-[360px] sm:max-w-[480px] md:max-w-[500px] lg:max-w-[540px] text-center select-none ${className}`}
    >
      <div
        className="text-white uppercase font-bold sm:font-extrabold text-[clamp(17px,1.55vw,25px)] md:text-[clamp(19px,1.75vw,28px)] tracking-wider py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl sm:rounded-[22px] shadow-sm transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ backgroundColor: headerBg }}
      >
        {title}
      </div>

      <div
        className={`bg-white rounded-[26px] sm:rounded-[36px] mt-3 sm:mt-3.5 p-6 sm:p-7 md:p-8 flex flex-col items-center justify-between aspect-[0.98] sm:aspect-[0.96] shadow-xl sm:shadow-2xl border border-neutral-100/90 relative overflow-hidden ${bodyClassName}`}
      >
        <p className="text-[clamp(15px,1.3vw,20px)] md:text-[clamp(17px,1.45vw,23px)] text-neutral-800 font-normal leading-[1.35] max-w-[340px] sm:max-w-[430px] text-center">
          {desc}
        </p>

        <div
          ref={lottieContainerRef}
          className="feature-lottie-container w-[145px] h-[145px] sm:w-[185px] sm:h-[185px] md:w-[215px] md:h-[215px] my-auto flex items-center justify-center pointer-events-none"
          style={{ "--flavor-color": headerBg } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default FeatureCard;
