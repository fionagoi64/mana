import {
  useEffect,
  useRef,
  useId,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RainbowPlayableRef } from "../../types/types.ts";
import {
  RAINBOW_CLASSES,
  useRainbowCascade,
} from "../../utils/rainbowAnimation.ts";

gsap.registerPlugin(ScrollTrigger);

export interface RainbowBouncingTextProps {
  text: string;
  curved?: boolean;
  curveD?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "p" | "span";
  autoPlay?: boolean;
  triggerOnScroll?: boolean;
  scrollStart?: string;
  onClick?: () => void;
  id?: string;
}

export const RainbowBouncingText = forwardRef<
  RainbowPlayableRef,
  RainbowBouncingTextProps
>(
  (
    {
      text,
      curved = false,
      curveD = "M 40 230 C 490 30 960 30 1410 230",
      fontSize,
      fontFamily,
      fontWeight = 300,
      letterSpacing,
      className = "",
      as: Tag = "h2",
      autoPlay = false,
      triggerOnScroll = true,
      scrollStart = "top 80%",
      onClick,
      id,
    },
    ref,
  ) => {
    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const pathId = `curve-path-${cleanId}`;

    const containerRef = useRef<HTMLDivElement>(null);

    const { play, hasAnimatedRef, clearAllTimeouts } = useRainbowCascade(
      containerRef,
      {
        fromScale: 0.75,
        fromY: 14,
        duration: 0.65,
        ease: "elastic.out(1.8, 0.45)",
        staggerSec: 0.07,
      },
    );

    useImperativeHandle(ref, () => ({
      play,
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const letters = container.querySelectorAll<HTMLElement | SVGElement>(
        ".lettre",
      );
      if (!letters.length) return;

      if (autoPlay) {
        hasAnimatedRef.current = true;
        play();
        return;
      }

      if (!hasAnimatedRef.current) {
        letters.forEach((el) => {
          el.classList.remove(...RAINBOW_CLASSES);
          el.classList.add("c-beige");
        });
        gsap.set(letters, { scale: 0.8, transformOrigin: "center center" });
      }

      if (!triggerOnScroll) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: scrollStart || "top 80%",
          once: true,
          onEnter: () => {
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              play();
            }
          },
        });
      }, container);

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimer);
        ctx.revert();
        clearAllTimeouts();
      };
    }, [
      text,
      curved,
      autoPlay,
      triggerOnScroll,
      scrollStart,
      play,
      hasAnimatedRef,
      clearAllTimeouts,
    ]);

    const words = text.split(" ");

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        className={`relative select-none w-full flex items-center justify-center cursor-default ${className}`}
      >
        {curved ? (
          <svg
            viewBox="0 0 1450 280"
            className="rainbow w-full h-auto overflow-visible cursor-default block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id={pathId} d={curveD} fill="none" />
            </defs>
            <text
              className="select-none"
              style={{
                fontFamily: fontFamily || "var(--font-main)",
                fontSize: fontSize || "clamp(46px, 5.8vw, 88px)",
                fontWeight: fontWeight ?? 400,
                textTransform: "uppercase",
                letterSpacing: letterSpacing || "0.1em",
              }}
            >
              <textPath
                href={`#${pathId}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {Array.from(text).map((char, index) => (
                  <tspan
                    key={index}
                    className={`lettre c-beige l${char.toLowerCase()} inline-block`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </tspan>
                ))}
              </textPath>
            </text>
          </svg>
        ) : (
          <Tag
            id={id}
            className="grosTitre grosTitreSpe rainbow flex items-center justify-center whitespace-nowrap overflow-visible m-0 p-0 cursor-default"
            style={{
              fontFamily: fontFamily || "var(--font-main)",
              fontSize: fontSize || undefined,
              fontWeight: fontWeight ?? 300,
              letterSpacing: letterSpacing || "-0.02em",
            }}
          >
            {words.map((word, wIdx) => (
              <span key={wIdx} className="mot inline-block whitespace-nowrap">
                {Array.from(word).map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className={`lettre c-beige l${char.toLowerCase()} inline-block`}
                  >
                    {char}
                  </span>
                ))}
                {wIdx < words.length - 1 ? (
                  <span className="inline-block w-[0.25em]">&nbsp;</span>
                ) : null}
              </span>
            ))}
          </Tag>
        )}
      </div>
    );
  },
);

export default RainbowBouncingText;
