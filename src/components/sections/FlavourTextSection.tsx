import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { FLAVOR_STAR_LAYERS } from "../../data/flavors.ts";
import { RainbowBouncingText } from "../shared/RainbowBouncingText.tsx";

gsap.registerPlugin(ScrollTrigger);

export const FlavourTextSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  const word = t("flavorsSection.heading");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const [layer1, layer2] = layersRef.current;
    const tweens: gsap.core.Tween[] = [];

    if (layer1) {
      tweens.push(
        gsap.fromTo(
          layer1,
          { y: -90 },
          {
            y: 90,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom+=90px",
              end: "bottom top-=90px",
              scrub: true,
            },
          },
        ),
      );
    }

    if (layer2) {
      tweens.push(
        gsap.fromTo(
          layer2,
          { y: -40, rotate: -12 },
          {
            y: 120,
            rotate: 15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom+=60px",
              end: "bottom top-=60px",
              scrub: true,
            },
          },
        ),
      );
    }

    return () => {
      tweens.forEach((tw) => tw.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flavors-heading-section"
      className="w-full bg-[#FEF7E6] pt-10 pb-2 sm:pt-20 sm:pb-8 relative overflow-hidden select-none"
    >
      <div className="w-full relative flex flex-col items-center justify-center">
        {FLAVOR_STAR_LAYERS.map((stars, layerIdx) => (
          <div
            key={layerIdx}
            ref={(el) => {
              layersRef.current[layerIdx] = el;
            }}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            {stars.map((posClass, starIdx) => (
              <img
                key={starIdx}
                src="/svg/etoile.svg"
                alt=""
                className={`absolute ${posClass}`}
              />
            ))}
          </div>
        ))}

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

export default FlavourTextSection;
