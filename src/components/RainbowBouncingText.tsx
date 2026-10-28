import React, { useEffect, useRef, useId, forwardRef, useImperativeHandle, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RainbowBouncingTextRef {
  /** Trigger the authentic Mana rainbow wave bouncing animation programmatically */
  play: () => void;
}

export interface RainbowBouncingTextProps {
  /** The text string to render and animate (e.g. 'Flavors', 'Saveurs') */
  text: string;
  /** Whether the text should curve along an arched SVG path (for vector curves) */
  curved?: boolean;
  /** Custom SVG curve path 'd' attribute (when curved is true) */
  curveD?: string;
  /** Custom font size (defaults to authentic Mana grosTitre clamp) */
  fontSize?: string;
  /** Custom font family */
  fontFamily?: string;
  /** Font weight (defaults to 300) */
  fontWeight?: string | number;
  /** Custom letter spacing */
  letterSpacing?: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Semantic HTML tag for straight text (defaults to 'h2') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'span';
  /** Whether to trigger the rainbow bounce animation automatically on scroll */
  triggerOnScroll?: boolean;
  /** ScrollTrigger start position (defaults to authentic 'top 70%') */
  scrollStart?: string;
  /** Whether to trigger only once on scroll (defaults to true) */
  scrollOnce?: boolean;
  /** Whether hovering over the whole text container triggers the wave */
  interactiveHover?: boolean;
  /** Whether hovering over an individual letter bounces that letter */
  bounceOnLetterHover?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

export const RAINBOW_CLASSES = [
  'c-orange', // #f15b40
  'c-bleu2',  // #2b3d73
  'c-rouge',  // #e72f63
  'c-rose',   // #f6b1cf
  'c-bleu',   // #88c1f8
  'c-jaune',  // #ffd372
  'c-noir',   // #0e0e0e
];

export const RainbowBouncingText = forwardRef<RainbowBouncingTextRef, RainbowBouncingTextProps>(
  (
    {
      text,
      curved = false,
      curveD = 'M 40 230 C 490 30 960 30 1410 230',
      fontSize,
      fontFamily,
      fontWeight = 300,
      letterSpacing,
      className = '',
      as: Tag = 'h2',
      triggerOnScroll = true,
      scrollStart = 'top 80%',
      scrollOnce = false,
      interactiveHover = false,
      bounceOnLetterHover = false,
      onClick,
    },
    ref
  ) => {
    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const pathId = `curve-path-${cleanId}`;

    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutsMap = useRef<Map<HTMLElement | SVGElement, ReturnType<typeof setTimeout>[]>>(new Map());
    const hasAnimatedRef = useRef(false);

    // Clear active timeouts for a single element to prevent color race conditions
    const clearElementTimeouts = useCallback((el: HTMLElement | SVGElement) => {
      const active = timeoutsMap.current.get(el);
      if (active) {
        active.forEach(clearTimeout);
        timeoutsMap.current.delete(el);
      }
    }, []);

    // Clear all pending timeouts
    const clearAllTimeouts = useCallback(() => {
      timeoutsMap.current.forEach((timers) => timers.forEach(clearTimeout));
      timeoutsMap.current.clear();
    }, []);

    /**
     * Authentic Mana rainbow color cascading function matching live site global.js:
     * - Immediate: c-orange (0ms)
     * - 70ms: c-bleu2
     * - 140ms: c-rouge
     * - 210ms: c-rose
     * - 280ms: c-bleu
     * - 350ms: c-jaune
     * - 420ms: c-noir (stays pitch black)
     */
    const triggerRainbow = useCallback(
      (el: HTMLElement | SVGElement) => {
        clearElementTimeouts(el);

        el.classList.remove('c-beige', ...RAINBOW_CLASSES);
        el.classList.add('c-orange');

        const delays = [70, 140, 210, 280, 350, 420];
        const sequence = ['c-bleu2', 'c-rouge', 'c-rose', 'c-bleu', 'c-jaune', 'c-noir'];

        const timers: ReturnType<typeof setTimeout>[] = [];
        sequence.forEach((cls, i) => {
          const prevCls = i === 0 ? 'c-orange' : sequence[i - 1];
          const t = setTimeout(() => {
            el.classList.remove(prevCls);
            el.classList.add(cls);
          }, delays[i]);
          timers.push(t);
        });

        timeoutsMap.current.set(el, timers);
      },
      [clearElementTimeouts]
    );

    /**
     * Elastic bounce & rainbow cascade on an individual letter
     */
    const bounceSingleLetter = useCallback(
      (el: HTMLElement | SVGElement) => {
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { scale: 0.8, transformOrigin: 'center center' },
          {
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(2, 0.5)',
          }
        );
        triggerRainbow(el);
      },
      [triggerRainbow]
    );

    /**
     * Authentic Mana full cascading wave across all letters:
     * Synchronizes 70ms letter stagger with 70ms color step for diagonal rainbow wave!
     */
    const play = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const letters = container.querySelectorAll<HTMLElement | SVGElement>('.lettre');
      if (!letters || letters.length === 0) return;

      // Kill any running letter tweens and timeouts
      gsap.killTweensOf(letters);
      letters.forEach(clearElementTimeouts);

      letters.forEach((letter, i) => {
        // Reset to initial state
        letter.classList.remove(...RAINBOW_CLASSES);
        letter.classList.add('c-beige');
        gsap.set(letter, { scale: 0.8, transformOrigin: 'center center' });

        // Staggered elastic spring bounce from scale 0.8 to 1.0
        gsap.to(letter, {
          scale: 1,
          duration: 0.6,
          delay: i * 0.07,
          ease: 'elastic.out(2, 0.5)',
        });

        // Cascading rainbow colors at exact stagger time
        const t = setTimeout(() => {
          triggerRainbow(letter);
        }, i * 70);

        const activeTimers = timeoutsMap.current.get(letter) || [];
        activeTimers.push(t);
        timeoutsMap.current.set(letter, activeTimers);
      });
    }, [clearElementTimeouts, triggerRainbow]);

    useImperativeHandle(ref, () => ({
      play,
    }));

    // ScrollTrigger: automatically triggers the rainbow wave on entering viewport
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const letters = container.querySelectorAll<HTMLElement | SVGElement>('.lettre');
      if (!letters.length) return;

      // Initialize all letters to c-beige (matching the page background) and scale 0.8
      letters.forEach((el) => {
        el.classList.remove(...RAINBOW_CLASSES);
        el.classList.add('c-beige');
      });
      gsap.set(letters, { scale: 0.8, transformOrigin: 'center center' });

      if (!triggerOnScroll) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: scrollStart || 'top 80%',
          once: scrollOnce,
          onEnter: () => {
            hasAnimatedRef.current = true;
            play();
          },
          onEnterBack: () => {
            if (!scrollOnce) {
              play();
            }
          },
        });
      }, container);

      // Force a ScrollTrigger refresh after initial render to account for pinned sections above
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimer);
        ctx.revert();
        clearAllTimeouts();
      };
    }, [text, curved, triggerOnScroll, scrollStart, scrollOnce, play, clearAllTimeouts]);

    // Split text into words and characters
    const words = text.split(' ');

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        className={`rainbow-text-wrapper relative select-none w-full flex items-center justify-center cursor-default ${className}`}
      >
        {curved ? (
          /* ========================================================
             CURVED SVG TEXT ALONG AN ARCHED PATH
             ======================================================== */
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
                fontFamily: fontFamily || 'var(--font-main)',
                fontSize: fontSize || 'clamp(46px, 5.8vw, 88px)',
                fontWeight: fontWeight ?? 400,
                textTransform: 'uppercase',
                letterSpacing: letterSpacing || '0.1em',
              }}
            >
              <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {Array.from(text).map((char, index) => {
                  const letterClass = `l${char.toLowerCase()}`;
                  return (
                    <tspan
                      key={index}
                      className={`lettre c-beige ${letterClass} inline-block`}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </tspan>
                  );
                })}
              </textPath>
            </text>
          </svg>
        ) : (
          /* ========================================================
             AUTHENTIC MANA STRAIGHT RAINBOW HEADLINE
             Strictly matching: <h2 class="grosTitre grosTitreSpe rainbow">
             ======================================================== */
          <Tag
            className="grosTitre grosTitreSpe rainbow flex items-center justify-center whitespace-nowrap overflow-visible m-0 p-0 cursor-default"
            style={{
              fontFamily: fontFamily || 'var(--font-main)',
              fontSize: fontSize || undefined,
              fontWeight: fontWeight ?? 300,
              letterSpacing: letterSpacing || '-0.02em',
            }}
          >
            {words.map((word, wIdx) => (
              <span key={wIdx} className="mot inline-block whitespace-nowrap">
                {Array.from(word).map((char, cIdx) => {
                  const charCode = char.toLowerCase();
                  const letterClass = `l${charCode}`;
                  return (
                    <span
                      key={cIdx}
                      className={`lettre c-beige ${letterClass} inline-block`}
                    >
                      {char}
                    </span>
                  );
                })}
                {wIdx < words.length - 1 ? (
                  <span className="espace inline-block w-[0.25em]">&nbsp;</span>
                ) : null}
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
