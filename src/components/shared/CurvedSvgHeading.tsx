import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { RainbowPlayableRef } from "../../types/types.ts";
import { useRainbowCascade } from "../../utils/rainbowAnimation.ts";

gsap.registerPlugin(ScrollTrigger);

export type CurvedSvgHeadingRef = RainbowPlayableRef;

export interface CurvedSvgHeadingProps {
  paths: string[];
  headingText: string;
  viewBox: string;
  width: number | string;
  height: number | string;
  as?: "h2" | "h3";
  triggerOnScroll?: boolean;
  svgClassName?: string;
  className?: string;
}

export const CurvedSvgHeading = forwardRef<
  RainbowPlayableRef,
  CurvedSvgHeadingProps
>(
  (
    {
      paths,
      headingText,
      viewBox,
      width,
      height,
      as: HeadingTag = "h2",
      triggerOnScroll = false,
      svgClassName = "",
      className = "",
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const lang = t("common.lang");
    const svgRef = useRef<SVGSVGElement>(null);

    const { play, hasAnimatedRef, resetLettersToBeige, clearAllTimeouts } =
      useRainbowCascade<SVGPathElement>(svgRef, {
        fromScale: 0.8,
        duration: 0.6,
        ease: "elastic.out(2, 0.5)",
        staggerSec: 0.07,
      });

    useImperativeHandle(ref, () => ({
      play,
    }));

    useEffect(() => {
      const svg = svgRef.current;
      if (!svg) return;

      if (!hasAnimatedRef.current) {
        resetLettersToBeige();
      }

      if (!triggerOnScroll) {
        return () => {
          clearAllTimeouts();
        };
      }

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: svg,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              play();
            }
          },
        });
      }, svg);

      return () => {
        ctx.revert();
        clearAllTimeouts();
      };
    }, [
      lang,
      triggerOnScroll,
      play,
      hasAnimatedRef,
      resetLettersToBeige,
      clearAllTimeouts,
    ]);

    return (
      <div
        className={`relative w-full flex flex-col items-center select-none ${className}`}
      >
        <HeadingTag className="sr-only">{headingText}</HeadingTag>

        <svg
          ref={svgRef}
          className={`rainbow ${svgClassName} h-auto block mx-auto cursor-default`}
          fill="none"
          height={height}
          viewBox={viewBox}
          width={width}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#0e0e0e">
            {paths.map((d, index) => (
              <path key={`${lang}-${index}`} className="lettre c-beige" d={d} />
            ))}
          </g>
        </svg>
      </div>
    );
  },
);

export default CurvedSvgHeading;
