import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie, { AnimationItem } from 'lottie-web';
import { CurvedOnlyTheBestHeading, CurvedOnlyTheBestHeadingRef } from './CurvedOnlyTheBestHeading';

gsap.registerPlugin(ScrollTrigger);

export interface FeaturesCircleProps {
  currentFlavorId: string;
}

const FLAVOR_COLORS: Record<string, string> = {
  grapefruit: '#f15b40',
  hibiscus: '#2b3d73',
  tropical: '#e72f63',
  melon: '#195e1c',
};

export const FeaturesCircle: React.FC<FeaturesCircleProps> = ({ currentFlavorId }) => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGSVGElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lottieContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const animsRef = useRef<AnimationItem[]>([]);
  const rainbowRef = useRef<CurvedOnlyTheBestHeadingRef>(null);
  const allBullesRef = useRef<SVGSVGElement>(null);
  const bubblesLeftRef = useRef<HTMLDivElement>(null);
  const bubblesRightRef = useRef<HTMLDivElement>(null);
  const hasAnimatedOnlyBestRef = useRef(false);

  const FLAVOR_HERO_BG: Record<string, string> = {
    grapefruit: '#ffd372',
    hibiscus: '#85baea',
    tropical: '#f6b1cf',
    melon: '#acd084',
  };

  const headerBg = FLAVOR_COLORS[currentFlavorId] || '#f15b40';
  const heroBgColor = FLAVOR_HERO_BG[currentFlavorId] || '#ffd372';
  const isFrench = Boolean(i18n.language && i18n.language.startsWith('fr'));

  const cards = [
    {
      title: t('features.crash_title', 'WITHOUT THE CRASH'),
      desc: t('features.crash_desc', 'A gentle wave of energy. To get you going without the crash.'),
      lottiePath: '/assets/carte_crash.json',
      angle: 25,
    },
    {
      title: t('features.caffeine_title', 'NATURAL CAFFEINE'),
      desc: t('features.caffeine_desc', 'This certified organic caffeine comes from the plant. A gift from Mother Nature.'),
      lottiePath: '/assets/carte_caf.json',
      angle: 50,
    },
    {
      title: t('features.antioxidant_title', 'ANTIOXIDANT'),
      desc: t('features.antioxidant_desc', 'Richer in antioxidants than tea. Not bad.'),
      lottiePath: '/assets/carte_antiox.json',
      angle: 75,
    },
    {
      title: t('features.vegan_title', 'VEGAN'),
      desc: t('features.vegan_desc', 'A plant-based drink that tastes like heaven. Who could ask for more?'),
      lottiePath: '/assets/carte_vege.json',
      angle: 100,
    },
  ];

  // Initialize Lottie animations on the cards
  useEffect(() => {
    animsRef.current.forEach((anim) => anim.destroy());
    animsRef.current = [];

    cards.forEach((card, index) => {
      const container = lottieContainersRef.current[index];
      if (container) {
        const anim = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: card.lottiePath,
        });
        animsRef.current.push(anim);
      }
    });

    return () => {
      animsRef.current.forEach((anim) => anim.destroy());
      animsRef.current = [];
    };
  }, []);

  // Parallax Arc scaling & Wheel rotation animations
  useEffect(() => {
    const section = sectionRef.current;
    const arc = arcRef.current;
    const wheel = wheelRef.current;
    const allBulles = allBullesRef.current;
    const bubblesLeft = bubblesLeftRef.current;
    const bubblesRight = bubblesRightRef.current;
    if (!section || !arc || !wheel) return;

    const ctx = gsap.context(() => {
      // 1. Authentic Arc Parallax Reveal (scales up vertically as user approaches the section)
      gsap.fromTo(
        arc,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: () => 'top bottom-=' + 0.06 * window.innerWidth,
            end: 'top top',
            scrub: true,
          },
        }
      );

      // 2. Horizontal Left-Right Parallax on Bubbles as user scrolls through the section
      if (bubblesLeft) {
        gsap.fromTo(
          bubblesLeft,
          { x: -120 },
          {
            x: 120,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + 2.4 * window.innerWidth,
              scrub: 1.2,
            },
          }
        );
      }

      if (bubblesRight) {
        gsap.fromTo(
          bubblesRight,
          { x: 130 },
          {
            x: -130,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + 2.4 * window.innerWidth,
              scrub: 1.4,
            },
          }
        );
      }

      if (allBulles) {
        gsap.fromTo(
          allBulles,
          { x: 80 },
          {
            x: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + 2.4 * window.innerWidth,
              scrub: 0.8,
            },
          }
        );
      }

      // 3. Authentic Pinned Wheel Rotation from 0 to -130 degrees across 450vw circular path
      gsap.to(wheel, {
        rotation: -130,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + 2.4 * window.innerWidth,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onEnter: () => {
            animsRef.current.forEach((anim) => anim.play());
          },
          onLeave: () => {
            animsRef.current.forEach((anim) => anim.pause());
          },
          onEnterBack: () => {
            animsRef.current.forEach((anim) => anim.play());
          },
          onLeaveBack: () => {
            animsRef.current.forEach((anim) => anim.pause());
          },
          onUpdate: (self) => {
            // Trigger rainbow bounce when Slide 5 rotates into view
            if (self.progress >= 0.70 && !hasAnimatedOnlyBestRef.current) {
              hasAnimatedOnlyBestRef.current = true;
              rainbowRef.current?.play();
            } else if (self.progress < 0.60) {
              hasAnimatedOnlyBestRef.current = false;
            }
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-mana"
      className="sectionCercle relative w-full select-none h-screen overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: heroBgColor }}
    >
      {/* ========================================================
          1. TOP ARCHED SVG WITH PARALLAX EFFECT ANIMATION
          (Reaches top of viewport and stays at top when pinned)
          ======================================================== */}
      <svg
        ref={arcRef}
        className="arc absolute top-0 left-0 w-full h-[6.5vw] min-h-[55px] max-h-[115px] block pointer-events-none z-20 overflow-visible"
        style={{ transformOrigin: '0 100%' }}
        viewBox="0 0 1517 93"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 92.0674C528.5 -28.9327 977.5 -32.4328 1516.5 92.0674H0Z"
          fill="#FEF7E6"
        />
      </svg>

      {/* Solid Beige fill below the arc curve */}
      <div
        className="absolute left-0 w-full bg-[#FEF7E6] pointer-events-none z-0"
        style={{ top: 'max(52px, 6vw)', bottom: 0 }}
      />

      {/* ========================================================
          2. INNER PINNED SCREEN (Contains the 450vw Circular Wheel Path)
          ======================================================== */}
      <div
        ref={wheelRef}
        className="innerCercle innerCercleCartes absolute pointer-events-auto z-10"
        style={{
          width: '450vw',
          height: '450vw',
          borderRadius: '100%',
          top: 0,
          left: 'calc(50% - 225vw)',
          transformOrigin: '50% 50%',
        }}
      >
        {/* ----------------------------------------------------
            SLIDE 0: (0deg) - TITLE
            ---------------------------------------------------- */}
        <div
          className="cercle absolute top-0 left-0 w-full h-full text-center"
          style={{ transform: 'rotate(0deg)', transformOrigin: '50% 50%' }}
        >
          <div className="etape h-screen w-full flex flex-col items-center justify-start pt-24 sm:pt-36">
            <div className="max-w-[1050px] px-6 text-center">
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-light uppercase tracking-tight text-[#0e0e0e] leading-[0.96]">
                MANA ? YERBA MATÉ ?
                <br />
                <span className="font-normal">WHAT ARE WE TALKING ABOUT?</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-xl sm:text-2xl text-neutral-600 italic font-serif">
                (we're going to tell each other the real things)
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            SLIDES 1-4: (25deg, 50deg, 75deg, 100deg) - CARDS WITH LOTTIE
            ---------------------------------------------------- */}
        {cards.map((card, index) => (
          <div
            key={card.title}
            className="cercle absolute top-0 left-0 w-full h-full text-center"
            style={{
              transform: `rotate(${card.angle}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <div className="etape h-screen w-full flex items-center justify-center -translate-y-12 sm:-translate-y-16">
              <div className="data w-[86vw] max-w-[350px] sm:max-w-[400px] text-center">
                {/* Dynamic Pill Header */}
                <div
                  className="haut text-white uppercase font-bold text-lg sm:text-xl tracking-wider py-3.5 px-6 rounded-2xl shadow-sm transition-colors duration-500"
                  style={{ backgroundColor: headerBg }}
                >
                  {card.title}
                </div>

                {/* Card Body with Authentic Lottie Center Animation */}
                <div className="bas bg-white rounded-3xl mt-3 p-6 sm:p-8 flex flex-col items-center justify-between aspect-[0.95] shadow-xl border border-neutral-100/80 relative overflow-hidden">
                  <p className="text-sm sm:text-base text-neutral-800 font-normal leading-relaxed max-w-[280px]">
                    {card.desc}
                  </p>

                  <div
                    ref={(el) => {
                      lottieContainersRef.current[index] = el;
                    }}
                    className="w-[140px] h-[140px] sm:w-[175px] sm:h-[175px] my-auto flex items-center justify-center pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ----------------------------------------------------
            SLIDE 5: (130deg) - END ARCHED TEXT ("ONLY THE BEST" / "QUE DU BON")
            ---------------------------------------------------- */}
        <div
          className="cercle absolute top-0 left-0 w-full h-full text-center"
          style={{ transform: 'rotate(130deg)', transformOrigin: '50% 50%' }}
        >
          <div className="etape h-screen w-full flex items-center justify-center">
            <div className="w-[95vw] max-w-[1300px] flex items-center justify-center px-4 relative overflow-visible">
              
              {/* Parallax Bubbles Layer 1 (scrubs left-to-right) */}
              <div
                ref={bubblesLeftRef}
                className="parallaxBulles absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[6%] top-[16%] w-[2.8vw] min-w-[22px] max-w-[42px] opacity-85"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[46%] top-[6%] w-[1.9vw] min-w-[16px] max-w-[28px] opacity-75"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[86%] top-[22%] w-[3.2vw] min-w-[26px] max-w-[46px] opacity-90"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[22%] top-[78%] w-[2.2vw] min-w-[18px] max-w-[32px] opacity-80"
                />
              </div>

              {/* Parallax Bubbles Layer 2 (scrubs right-to-left) */}
              <div
                ref={bubblesRightRef}
                className="parallaxBulles absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[16%] top-[10%] w-[2vw] min-w-[16px] max-w-[30px] opacity-80"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[34%] top-[82%] w-[2.7vw] min-w-[22px] max-w-[38px] opacity-85"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[68%] top-[12%] w-[2.1vw] min-w-[17px] max-w-[30px] opacity-75"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[78%] top-[76%] w-[2.6vw] min-w-[20px] max-w-[36px] opacity-90"
                />
                <img
                  src="/assets/bulle.svg"
                  alt=""
                  className="absolute left-[94%] top-[66%] w-[1.6vw] min-w-[14px] max-w-[24px] opacity-70"
                />
              </div>

              {/* Curved Only The Best Heading */}
              <CurvedOnlyTheBestHeading
                ref={rainbowRef}
                isFrench={isFrench}
                className="w-full max-w-[1300px] z-5 relative"
              />

              {/* Authentic allBulles SVG with horizontal parallax scrub */}
              <svg
                ref={allBullesRef}
                className="allBulles absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 1456 363"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="1142.34" cy="146" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="411.344" cy="105" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="149.344" cy="196" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="649.344" cy="94" r="10.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="781.344" cy="32" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="1098.34" cy="76" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
                <circle cx="315.344" cy="7" r="6.375" fill="#FEF7E6" stroke="#0E0E0E" strokeWidth="1.25" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCircle;
