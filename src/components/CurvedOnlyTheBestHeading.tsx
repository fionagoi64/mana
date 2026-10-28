import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ONLY_THE_BEST_PATHS_EN, ONLY_THE_BEST_PATHS_FR } from './curvedOnlyTheBestPaths.ts';

const RAINBOW_CLASSES = [
  'c-orange',
  'c-bleu2',
  'c-rouge',
  'c-rose',
  'c-bleu',
  'c-jaune',
  'c-noir',
];

export interface CurvedOnlyTheBestHeadingRef {
  play: () => void;
}

interface CurvedOnlyTheBestHeadingProps {
  isFrench: boolean;
  className?: string;
}

export const CurvedOnlyTheBestHeading = forwardRef<
  CurvedOnlyTheBestHeadingRef,
  CurvedOnlyTheBestHeadingProps
>(({ isFrench, className = '' }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const paths = isFrench ? ONLY_THE_BEST_PATHS_FR : ONLY_THE_BEST_PATHS_EN;
  const headingText = isFrench ? 'Que du bon' : 'Only the best';

  // Authentic rainbow color cascading function matching live site global.js
  const triggerRainbowLetter = useCallback((el: SVGPathElement) => {
    el.classList.remove('c-beige', ...RAINBOW_CLASSES);
    el.classList.add('c-orange');

    const delays = [70, 140, 210, 280, 350, 420];
    const sequence = ['c-bleu2', 'c-rouge', 'c-rose', 'c-bleu', 'c-jaune', 'c-noir'];

    sequence.forEach((cls, i) => {
      const prevCls = i === 0 ? 'c-orange' : sequence[i - 1];
      const timer = setTimeout(() => {
        el.classList.remove(prevCls);
        el.classList.add(cls);
      }, delays[i]);
      timeoutsRef.current.push(timer);
    });
  }, []);

  const bounceSingleLetter = useCallback(
    (el: SVGPathElement) => {
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
      triggerRainbowLetter(el);
    },
    [triggerRainbowLetter]
  );

  const play = useCallback(() => {
    if (!svgRef.current) return;
    const letters = svgRef.current.querySelectorAll<SVGPathElement>('.lettre');
    if (!letters.length) return;

    gsap.killTweensOf(letters);
    gsap.set(letters, { scale: 0.8, transformOrigin: 'center center' });

    gsap.to(letters, {
      scale: 1,
      stagger: {
        each: 0.07,
        onComplete: function () {
          const target = this.targets()[0] as SVGPathElement;
          if (target) {
            triggerRainbowLetter(target);
          }
        },
      },
      duration: 0.6,
      ease: 'elastic.out(2, 0.5)',
    });
  }, [triggerRainbowLetter]);

  useImperativeHandle(ref, () => ({
    play,
  }));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const letters = svg.querySelectorAll<SVGPathElement>('.lettre');
    letters.forEach((el) => {
      el.classList.remove(...RAINBOW_CLASSES);
      el.classList.add('c-beige');
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isFrench]);

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Semantic hidden heading for SEO & accessibility */}
      <h3 className="sr-only">{headingText}</h3>

      {/* Authentic Mana Curved "ONLY THE BEST" / "QUE DU BON" Typography SVG */}
      <svg
        ref={svgRef}
        className={`rainbow rainbowSpe ${isFrench ? 'visibleFR' : 'visibleEN'} w-full h-auto max-w-[1397px] block mx-auto cursor-pointer`}
        fill="none"
        height="256"
        viewBox="0 0 1397 256"
        width="1397"
        xmlns="http://www.w3.org/2000/svg"
        onClick={play}
      >
        <g fill="#0e0e0e">
          {paths.map((d, index) => (
            <path
              key={`${isFrench ? 'fr' : 'en'}-${index}`}
              className="lettre c-beige"
              d={d}
              onMouseEnter={(e) => bounceSingleLetter(e.currentTarget)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

CurvedOnlyTheBestHeading.displayName = 'CurvedOnlyTheBestHeading';
export default CurvedOnlyTheBestHeading;
