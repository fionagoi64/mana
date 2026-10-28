import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { INSTA_CARDS } from "../../data/instagram.ts";
import { ArcDivider } from "../shared/ArcDivider.tsx";

gsap.registerPlugin(ScrollTrigger);

export const InstagramParallaxSection: React.FC = () => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      INSTA_CARDS.forEach((card, idx) => {
        const el = cardsRef.current[idx];
        if (!el) return;
        gsap.fromTo(el, card.from, {
          ...card.to,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full relative z-30 select-none pointer-events-none overflow-x-clip overflow-y-visible">
      <div
        ref={containerRef}
        className="w-full bg-[#FFD372] relative min-h-[580px] sm:min-h-[720px] md:min-h-[820px] py-28 sm:py-40 md:py-48 flex items-center justify-center pointer-events-auto overflow-visible"
      >
        {INSTA_CARDS.map((card, idx) => (
          <img
            key={card.src}
            ref={(el) => {
              cardsRef.current[idx] = el;
            }}
            src={card.src}
            alt={card.alt}
            className={card.className}
          />
        ))}

        <div className="text-center z-10 px-4 sm:px-6 w-full max-w-[1591px] flex flex-col items-center mx-auto relative pointer-events-auto">
          <p
            className="uppercase tracking-wider mb-4 sm:mb-8"
            style={{ fontSize: "clamp(20px, 2.2vw, 33px)" }}
          >
            {t("instagram.handle")}
          </p>
          <h2
            className="font-normal uppercase tracking-tight leading-[1] mb-8 sm:mb-12 mx-auto"
            style={{
              fontSize: "clamp(55px, 5.62vw, 107px)",
              maxWidth: "1100px",
              minWidth: "min(100%, 335px)",
              width: "100%",
            }}
          >
            {t("instagram.heading")}
          </h2>

          <a
            href="https://www.instagram.com/manayerbamate/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group cursor-pointer select-none transition-transform active:scale-95 inline-block z-30"
            aria-label={t("instagram.followAria")}
          >
            <div className="absolute inset-0 rounded-full translate-y-[3px] bg-[#0E0E0E] transition-transform group-hover:translate-y-[1px]" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f15b40] border border-[#0E0E0E] flex items-center justify-center transition-transform group-hover:translate-y-[1px]">
              <img
                src="/svg/i_ig.svg"
                alt=""
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </div>
          </a>
        </div>
      </div>

      <div className="relative z-0 pointer-events-none -mt-0.5">
        <ArcDivider
          variant="bottom"
          color="#FFD372"
          className="h-auto -mb-px"
        />
      </div>
    </section>
  );
};

export default InstagramParallaxSection;
