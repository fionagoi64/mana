import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { RainbowBouncingText } from './RainbowBouncingText';

gsap.registerPlugin(ScrollTrigger);

export const WordParagraph: React.FC = () => {
  const { i18n } = useTranslation();
  const isFrench = Boolean(i18n.language && i18n.language.startsWith('fr'));
  const sectionRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const word = isFrench ? 'Saveurs' : 'Flavors';

  useEffect(() => {
    const section = sectionRef.current;
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    if (!section) return;

    // 1. Authentic Multi-plane Parallax on Stars
    let tween1: gsap.core.Tween | null = null;
    let tween2: gsap.core.Tween | null = null;

    if (layer1) {
      tween1 = gsap.fromTo(
        layer1,
        { y: -90 },
        {
          y: 90,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom+=90px',
            end: 'bottom top-=90px',
            scrub: true,
          },
        }
      );
    }

    if (layer2) {
      tween2 = gsap.fromTo(
        layer2,
        { y: -40, rotate: -12 },
        {
          y: 120,
          rotate: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom+=60px',
            end: 'bottom top-=60px',
            scrub: true,
          },
        }
      );
    }

    return () => {
      tween1?.kill();
      tween2?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="c-wordParagraph w-full bg-[#FEF7E6] pt-14 pb-8 sm:pt-20 sm:pb-12 relative overflow-hidden select-none"
    >
      <div className="w-full relative flex flex-col items-center justify-center">
        {/* ========================================================
            PARALLAX STARS CONTAINER (Scattered exactly as on live site)
            ======================================================== */}
        {/* Parallax Layer 1: Moves smoothly from -90px to +90px */}
        <div
          ref={layer1Ref}
          className="parallaxEtoile absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Near bottom-left of 'A' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[22.5%] top-[58%] w-[2.8vw] min-w-[22px] max-w-[42px] opacity-85"
          />

          {/* Near top-right of 'V' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[65.5%] top-[16%] w-[2.4vw] min-w-[20px] max-w-[36px] opacity-80"
          />

          {/* Near top-right of 'O' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[75%] top-[19%] w-[2.5vw] min-w-[20px] max-w-[38px] opacity-85"
          />

          {/* Far right near 'S' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[94%] top-[38%] w-[2.6vw] min-w-[22px] max-w-[40px] opacity-80"
          />
        </div>

        {/* Parallax Layer 2: Counter/deeper movement from -40px to +120px with subtle rotation */}
        <div
          ref={layer2Ref}
          className="parallaxEtoile absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Far left near 'F' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[5%] top-[24%] w-[2.3vw] min-w-[18px] max-w-[34px] opacity-75"
          />

          {/* Double stars right at the bottom tip of 'V' */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[45.2%] top-[62%] w-[1.8vw] min-w-[16px] max-w-[28px] opacity-85"
          />
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[47.8%] top-[57%] w-[2.2vw] min-w-[18px] max-w-[32px] opacity-90"
          />

          {/* Right of 'R' (between R and S) */}
          <img
            src="/assets/etoile.svg"
            alt=""
            className="absolute left-[78%] top-[60%] w-[2.6vw] min-w-[22px] max-w-[40px] opacity-85"
          />
        </div>

        {/* ========================================================
            BIG TYPOGRAPHY: STRICTLY ONE LINE WITHOUT BREAK
            ======================================================== */}
        <div className="w-full flex items-center justify-center overflow-visible px-2 sm:px-4">
          <RainbowBouncingText
            text={word}
            as="h2"
            className="w-full text-center"
          />
        </div>
      </div>
    </section>
  );
};

export default WordParagraph;
