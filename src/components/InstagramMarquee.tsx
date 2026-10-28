import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export const InstagramMarquee: React.FC = () => {
  const { i18n } = useTranslation();
  const isFrench = Boolean(i18n.language && i18n.language.startsWith('fr'));

  const containerRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLImageElement>(null);
  const card1Ref = useRef<HTMLImageElement>(null);
  const card2Ref = useRef<HTMLImageElement>(null);
  const card3Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      if (card0Ref.current) {
        gsap.to(card0Ref.current, {
          y: '-80%',
          x: '30%',
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          y: '0%',
          x: '-10%',
          rotation: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          y: '-80%',
          x: '-60%',
          rotation: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          y: '-100%',
          x: '10%',
          rotation: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="c-instagramPush w-full bg-[#FFD372] relative overflow-hidden select-none">
      <div
        ref={containerRef}
        className="innerInsta w-full min-h-[500px] sm:min-h-[640px] md:min-h-[720px] py-16 sm:py-24 relative flex items-center justify-center"
      >
        {/* Floating Card 0 (Top Left) */}
        <img
          ref={card0Ref}
          src="/images/insta_1.jpg"
          alt="Mana lifestyle"
          className="pushInsta pushInsta0 absolute top-[15%] left-[8%] w-[160px] sm:w-[220px] md:w-[260px] aspect-square object-cover rounded-2xl shadow-xl z-10 pointer-events-none"
        />

        {/* Floating Card 1 (Bottom Left) */}
        <img
          ref={card1Ref}
          src="/images/insta_2.jpg"
          alt="Mana vibe"
          className="pushInsta pushInsta1 absolute bottom-[10%] left-[16%] w-[150px] sm:w-[200px] md:w-[240px] aspect-square object-cover rounded-2xl shadow-xl z-10 pointer-events-none"
        />

        {/* Floating Card 2 (Top Right) */}
        <img
          ref={card2Ref}
          src="/images/insta_3.jpg"
          alt="Mana energy"
          className="pushInsta pushInsta2 absolute top-[10%] right-[10%] w-[170px] sm:w-[230px] md:w-[270px] aspect-square object-cover rounded-2xl shadow-xl z-10 pointer-events-none"
        />

        {/* Floating Card 3 (Bottom Right) */}
        <img
          ref={card3Ref}
          src="/images/insta_4.jpg"
          alt="Mana moment"
          className="pushInsta pushInsta3 absolute bottom-[12%] right-[18%] w-[160px] sm:w-[210px] md:w-[250px] aspect-square object-cover rounded-2xl shadow-xl z-10 pointer-events-none"
        />

        {/* Center Information Block */}
        <div className="datasInsta text-center z-20 px-6 max-w-[650px] flex flex-col items-center">
          <p className="text-lg sm:text-2xl font-light uppercase tracking-wider text-[#0E0E0E]/80 mb-3 sm:mb-4">
            @manayerbamate
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-tight text-[#0E0E0E] leading-tight mb-8">
            {isFrench
              ? 'Pour une dose d’énergie dans ton feed.'
              : 'For a dose of energy in your feed.'}
          </h2>

          {/* Instagram Button with 3D shadow (authentic coral red #F15B40) */}
          <a
            href="https://www.instagram.com/manayerbamate/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group cursor-pointer select-none transition-transform active:scale-95 inline-block"
            aria-label="Follow us on Instagram"
          >
            <div className="absolute inset-0 rounded-full translate-y-[3px] bg-[#0E0E0E] transition-transform group-hover:translate-y-[1px]" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f15b40] border border-[#0E0E0E] flex items-center justify-center transition-transform group-hover:translate-y-[1px]">
              <img src="/assets/i_ig.svg" alt="" className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Curved Arc Divider leading into Footer */}
      <svg
        className="arrondi w-full h-auto block pointer-events-none bg-[#FEF7E6] -mb-[1px]"
        viewBox="0 0 1517 93"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1516.89 0.182373C988.391 121.182 539.391 124.682 0.390633 0.18224L1516.89 0.182373Z"
          fill="#FFD372"
        />
      </svg>
    </section>
  );
};

export default InstagramMarquee;
