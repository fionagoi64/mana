import React, { useEffect, useRef, useId, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RainbowBouncingTextRef {
  /** Trigger the rainbow letter-stagger bouncing animation programmatically */
  play: () => void;
}

export interface RainbowBouncingTextProps {
  /** The text string to render and animate */
  text: string;
  /** Whether the text should curve along an arched SVG path */
  curved?: boolean;
  /** Custom SVG curve path 'd' attribute (when curved is true). Defaults to authentic Mana arc */
  curveD?: string;
  /** Color palette to cycle through during the bounce animation */
  colors?: string[];
  /** Default base text color */
  baseColor?: string;
  /** Font size (e.g. '15.2vw', '72px', or 'clamp(36px, 6vw, 84px)') */
  fontSize?: string;
  /** Custom font family */
  fontFamily?: string;
  /** Font weight (e.g. 300, 400, 'normal', 'bold') */
  fontWeight?: string | number;
  /** Custom letter spacing (e.g. '-0.03em' for straight, '0.1em' for curved) */
  letterSpacing?: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Semantic HTML tag for straight text (defaults to 'div') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'span';
  /** Whether to trigger the rainbow bounce animation automatically on scroll */
  triggerOnScroll?: boolean;
  /** ScrollTrigger start position (defaults to 'top 75%') */
  scrollStart?: string;
  /** Whether hovering over the whole text container triggers the wave */
  interactiveHover?: boolean;
  /** Whether hovering over an individual letter bounces that letter */
  bounceOnLetterHover?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

export const DEFAULT_RAINBOW_PALETTE = [
  '#f15b40', // c-orange
  '#2b3d73', // c-bleu2
  '#e72f63', // c-rouge
  '#f6b1cf', // c-rose
  '#88c1f8', // c-bleu
  '#ffd372', // c-jaune
  '#0e0e0e', // c-noir
];

export const RainbowBouncingText = forwardRef<RainbowBouncingTextRef, RainbowBouncingTextProps>(
  (
    {
      text,
      curved = false,
      curveD = 'M 40 230 C 490 30 960 30 1410 230',
      colors = DEFAULT_RAINBOW_PALETTE,
      baseColor = '#0E0E0E',
      fontSize,
      fontFamily = '"Neue Montreal", "Outfit", "Cabinet Grotesk", sans-serif',
      fontWeight,
      letterSpacing,
      className = '',
      as: Tag = 'div',
      triggerOnScroll = true,
      scrollStart = 'top 75%',
      interactiveHover = true,
      bounceOnLetterHover = true,
      onClick,
    },
    ref
  ) => {
    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const pathId = `curve-path-${cleanId}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const isPlayingRef = useRef(false);

    // Bounce a single letter with elastic spring and authentic rainbow cycle
    const bounceSingleLetter = (el: HTMLElement | SVGElement, idx: number) => {
      gsap.killTweensOf(el);
      const isSvg = el instanceof SVGElement;

      if (isSvg) {
        gsap.fromTo(
          el,
          { baselineShift: '20px' },
          {
            baselineShift: '0px',
            duration: 0.6,
            ease: 'elastic.out(2, 0.5)',
          }
        );
      } else {
        gsap.fromTo(
          el,
          { scale: 0.8 },
          {
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(2, 0.5)',
          }
        );
      }

      // Cycle colors rapidly: 70ms per color
      colors.forEach((color, cIdx) => {
        setTimeout(() => {
          if (isSvg) {
            gsap.set(el, { fill: color });
          } else {
            gsap.set(el, { color: color });
          }
        }, cIdx * 70);
      });
    };

    // Trigger the full bouncy rainbow wave across all letters sequentially
    const play = () => {
      const container = containerRef.current;
      if (!container) return;

      const letters = container.querySelectorAll<HTMLElement | SVGElement>('.lettre');
      if (!letters || letters.length === 0) return;

      isPlayingRef.current = true;

      letters.forEach((el, index) => {
        gsap.killTweensOf(el);
        const isSvg = el instanceof SVGElement;

        // 1. Elastic vertical bounce with 0.07s stagger
        if (isSvg) {
          gsap.fromTo(
            el,
            { baselineShift: '20px' },
            {
              baselineShift: '0px',
              duration: 0.6,
              delay: index * 0.07,
              ease: 'elastic.out(2, 0.5)',
            }
          );
        } else {
          gsap.fromTo(
            el,
            { scale: 0.8 },
            {
              scale: 1,
              duration: 0.6,
              delay: index * 0.07,
              ease: 'elastic.out(2, 0.5)',
            }
          );
        }

        // 2. Authentic Mana rainbow color wave cascade (70ms per step)
        colors.forEach((color, cIdx) => {
          setTimeout(() => {
            if (isSvg) {
              gsap.set(el, { fill: color });
            } else {
              gsap.set(el, { color: color });
            }
          }, index * 70 + cIdx * 70);
        });

        // 3. Finish cascade
        setTimeout(() => {
          if (isSvg) {
            gsap.set(el, { fill: baseColor });
          } else {
            gsap.set(el, { color: baseColor });
          }
          if (index === letters.length - 1) {
            isPlayingRef.current = false;
          }
        }, index * 70 + colors.length * 70 + 50);
      });
    };

    useImperativeHandle(ref, () => ({
      play,
    }));

    // ScrollTrigger: automatically trigger once entering viewport
    useEffect(() => {
      if (!triggerOnScroll || !containerRef.current) return;

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: scrollStart,
        onEnter: () => {
          play();
        },
      });

      return () => {
        st.kill();
      };
    }, [text, curved, triggerOnScroll, scrollStart]);

    // Split text into characters
    const characters = Array.from(text);

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        onMouseEnter={interactiveHover ? play : undefined}
        className={`rainbow-bouncing-text relative select-none ${className}`}
      >
        {curved ? (
          /* ========================================================
             CURVED SVG TEXT ALONG AN ARCHED PATH
             ======================================================== */
          <svg
            viewBox="0 0 1450 280"
            className="w-full h-auto overflow-visible cursor-pointer block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id={pathId} d={curveD} fill="none" />
            </defs>
            <text
              fill={baseColor}
              style={{
                fontFamily,
                fontSize: fontSize || 'clamp(46px, 5.8vw, 88px)',
                fontWeight: fontWeight ?? 400,
                textTransform: 'uppercase',
                letterSpacing: letterSpacing || '0.1em',
              }}
            >
              <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {characters.map((char, index) => (
                  <tspan
                    key={index}
                    className="lettre transition-colors duration-150 cursor-pointer inline-block"
                    style={{ fill: baseColor }}
                    onMouseEnter={
                      bounceOnLetterHover
                        ? (e) => {
                            e.stopPropagation();
                            bounceSingleLetter(e.currentTarget, index);
                          }
                        : undefined
                    }
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </tspan>
                ))}
              </textPath>
            </text>
          </svg>
        ) : (
          /* ========================================================
             STRAIGHT TEXT: STRICTLY ONE LINE WITHOUT BREAK
             ======================================================== */
          <Tag
            className="flex items-center justify-center whitespace-nowrap overflow-hidden leading-none m-0 p-0"
            style={{
              fontFamily,
              fontSize: fontSize || '15.2vw',
              fontWeight: fontWeight ?? 300,
              letterSpacing: letterSpacing || '-0.03em',
              color: baseColor,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            {characters.map((char, index) => (
              <span
                key={index}
                className="lettre inline-block transition-transform duration-150 cursor-pointer select-none"
                style={{ color: baseColor }}
                onMouseEnter={
                  bounceOnLetterHover
                    ? (e) => {
                        e.stopPropagation();
                        bounceSingleLetter(e.currentTarget, index);
                      }
                    : undefined
                }
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </Tag>
        )}
      </div>
    );
  }
);

RainbowBouncingText.displayName = 'RainbowBouncingText';

export default RainbowBouncingText;

