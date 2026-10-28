import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CURVE_PATHS_EN, CURVE_PATHS_FR } from './curvedNewsletterPaths.ts';

gsap.registerPlugin(ScrollTrigger);

const RAINBOW_CLASSES = [
  'c-orange',
  'c-bleu2',
  'c-rouge',
  'c-rose',
  'c-bleu',
  'c-jaune',
  'c-noir',
];

interface CurvedNewsletterHeadingProps {
  isFrench: boolean;
}

export const CurvedNewsletterHeading: React.FC<CurvedNewsletterHeadingProps> = ({ isFrench }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef(false);

  const paths = isFrench ? CURVE_PATHS_FR : CURVE_PATHS_EN;
  const headingText = isFrench ? 'Tu en boirais tous les jours ?' : 'Would you drink it every day?';

  // Authentic rainbow color cascading function matching live site global.js
  const triggerRainbowLetter = useCallback((el: SVGPathElement) => {
    // Clear any previous class colors
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

  const bounceSingleLetter = useCallback((el: SVGPathElement) => {
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
  }, [triggerRainbowLetter]);

  const playCascadeWave = useCallback(() => {
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

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const letters = svg.querySelectorAll<SVGPathElement>('.lettre');
    if (!letters.length) return;

    // Reset initial appearance
    letters.forEach((el) => {
      el.classList.remove(...RAINBOW_CLASSES);
      el.classList.add('c-beige');
    });

    const ctx = gsap.context(() => {
      // Authentic GSAP ScrollTrigger stagger bounce
      ScrollTrigger.create({
        trigger: svg,
        start: 'top 70%',
        once: false,
        onEnter: () => {
          hasAnimatedRef.current = true;
          playCascadeWave();
        },
      });
    }, svg);

    return () => {
      ctx.revert();
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isFrench, playCascadeWave]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Accessible semantic heading for SEO & screen readers */}
      <h2 className="sr-only">{headingText}</h2>

      {/* Authentic Mana Artistic Curved Vector Typography SVG */}
      <svg
        ref={svgRef}
        className={`tenBoirais rainbow ${isFrench ? 'visibleFR' : 'visibleEN'} w-[95%] max-w-[1435px] h-auto block mx-auto cursor-pointer`}
        fill="none"
        height="857"
        viewBox="0 0 1435 857"
        width="1435"
        xmlns="http://www.w3.org/2000/svg"
        onClick={playCascadeWave}
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
};

export default CurvedNewsletterHeading;
