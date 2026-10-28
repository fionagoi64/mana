import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAVOR_MAP, FlavorId } from "../../../data/flavors.ts";
import { FEATURE_CARDS } from "../../../data/features.ts";
import { ArcDivider } from "../../shared/ArcDivider.tsx";
import { CurvedSvgHeadingRef } from "../../shared/CurvedSvgHeading.tsx";
import { FeatureIntro } from "./FeatureIntro.tsx";
import { FeatureCard } from "./FeatureCard.tsx";
import { FeatureOnlyBest } from "./FeatureOnlyBest.tsx";

gsap.registerPlugin(ScrollTrigger);

export interface FeaturesSectionProps {
  currentFlavorId: FlavorId;
}

const MOBILE_CARD_TILTS = [-1.5, 2.5, -2, -2.5];
const MOBILE_CARD_X = [-6, 6, -5, 5];

interface WheelSlideProps {
  angle: number;
  innerClassName?: string;
  children: React.ReactNode;
}

const WheelSlide = ({
  angle,
  innerClassName = "",
  children,
}: WheelSlideProps) => (
  <div
    className="absolute top-0 left-0 w-full h-full text-center"
    style={{
      transform: `rotate(${angle}deg)`,
      transformOrigin: "50% 50%",
    }}
  >
    <div
      className={`h-screen w-full flex items-center justify-center ${innerClassName}`}
    >
      {children}
    </div>
  </div>
);

export const FeaturesSection = ({ currentFlavorId }: FeaturesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGSVGElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rainbowRef = useRef<CurvedSvgHeadingRef>(null);
  const allBullesRef = useRef<HTMLImageElement>(null);
  const bubblesLeftRef = useRef<HTMLDivElement>(null);
  const hasAnimatedOnlyBestRef = useRef(false);

  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRainbowRef = useRef<CurvedSvgHeadingRef>(null);
  const mobileOnlyBestRef = useRef<HTMLDivElement>(null);
  const mobileBullesRef = useRef<HTMLImageElement>(null);

  const activeFlavor = FLAVOR_MAP[currentFlavorId] || FLAVOR_MAP.grapefruit;
  const headerBg = activeFlavor.btnBg;
  const heroBgColor = activeFlavor.bg;

  useEffect(() => {
    const section = sectionRef.current;
    const arc = arcRef.current;
    const wheel = wheelRef.current;
    const allBulles = allBullesRef.current;
    const bubblesLeft = bubblesLeftRef.current;
    if (!section || !arc) return;

    const mm = gsap.matchMedia();

    gsap.fromTo(
      arc,
      { scaleY: 0, transformOrigin: "50% 100%" },
      {
        scaleY: 1,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: () => "top bottom-=" + 0.06 * window.innerWidth,
          end: "top top",
          scrub: true,
        },
      },
    );

    mm.add("(min-width: 768px)", () => {
      if (!wheel) return;

      if (bubblesLeft) {
        gsap.fromTo(
          bubblesLeft,
          { x: -120 },
          {
            x: 120,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + 3.0 * window.innerWidth,
              scrub: 1.2,
            },
          },
        );
      }

      if (allBulles) {
        gsap.fromTo(
          allBulles,
          { x: 80 },
          {
            x: -80,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + 3.0 * window.innerWidth,
              scrub: 0.8,
            },
          },
        );
      }

      gsap.set(wheel, { rotation: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + 3.0 * window.innerWidth,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.8 && !hasAnimatedOnlyBestRef.current) {
              hasAnimatedOnlyBestRef.current = true;
              rainbowRef.current?.play();
            }
          },
        },
      });

      tl.fromTo(
        wheel,
        { rotation: 0 },
        {
          keyframes: [
            { rotation: 0, duration: 0.6, ease: "none" },
            { rotation: -130, duration: 1.8, ease: "power1.inOut" },
            { rotation: -130, duration: 0.3, ease: "none" },
          ],
        },
      );
    });

    mm.add("(max-width: 767px)", () => {
      const mobileCards = mobileCardsRef.current.filter(Boolean);

      mobileCards.forEach((cardEl, index) => {
        const tilt = MOBILE_CARD_TILTS[index % MOBILE_CARD_TILTS.length];
        const xOffset = MOBILE_CARD_X[index % MOBILE_CARD_X.length];

        gsap.fromTo(
          cardEl,
          { y: 45, x: xOffset, rotation: tilt * 0.7 },
          {
            y: -35,
            x: -xOffset * 0.5,
            rotation: tilt * 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: cardEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      if (mobileBullesRef.current && mobileOnlyBestRef.current) {
        gsap.fromTo(
          mobileBullesRef.current,
          { x: 25 },
          {
            x: -25,
            ease: "none",
            scrollTrigger: {
              trigger: mobileOnlyBestRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }

      if (mobileOnlyBestRef.current) {
        ScrollTrigger.create({
          trigger: mobileOnlyBestRef.current,
          start: "top 80%",
          onEnter: () => {
            mobileRainbowRef.current?.play();
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-mana"
      className="relative w-full select-none min-h-screen md:h-screen md:overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: heroBgColor }}
    >
      <div
        className="absolute left-0 w-full pointer-events-none z-0 flex flex-col"
        style={{ top: "clamp(20px, 2.2vw, 30px)", bottom: 0 }}
      >
        <div className="relative w-full">
          <ArcDivider
            ref={arcRef}
            variant="top"
            color="#FEF7E6"
            className="w-full h-auto block -mb-0.75 z-10"
            style={{ transformOrigin: "50% 100%" }}
          />
        </div>
        <div className="w-full flex-1 bg-[#FEF7E6]" />
      </div>

      {/* //Desktop View */}
      <div
        ref={wheelRef}
        className="absolute pointer-events-auto z-10 hidden md:block"
        style={{
          width: "450vw",
          height: "450vw",
          borderRadius: "100%",
          top: 0,
          left: "calc(50% - 225vw)",
          transformOrigin: "50% 50%",
        }}
      >
        <WheelSlide angle={0} innerClassName="flex-col pt-24 pb-14">
          <FeatureIntro />
        </WheelSlide>

        {FEATURE_CARDS.map((card) => (
          <WheelSlide
            key={card.key}
            angle={card.angle}
            innerClassName="translate-y-4 sm:translate-y-6 md:translate-y-8"
          >
            <FeatureCard card={card} headerBg={headerBg} />
          </WheelSlide>
        ))}

        <WheelSlide angle={130}>
          <FeatureOnlyBest
            ref={rainbowRef}
            allBullesRef={allBullesRef}
            bubblesLeftRef={bubblesLeftRef}
            showFloatingBubbles
          />
        </WheelSlide>
      </div>

      {/* //Mobile View */}
      <div className="md:hidden relative z-10 w-full px-5 pt-36 pb-12 flex flex-col items-center overflow-visible">
        <FeatureIntro />

        <div className="w-full flex flex-col items-center space-y-10 sm:space-y-12">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={card.key}
              ref={(el) => {
                mobileCardsRef.current[i] = el;
              }}
              className="w-full flex justify-center will-change-transform"
            >
              <FeatureCard card={card} headerBg={headerBg} />
            </div>
          ))}
        </div>

        <div
          ref={mobileOnlyBestRef}
          className="w-full mt-16 sm:mt-20 relative flex flex-col items-center justify-center overflow-visible px-2"
        >
          <FeatureOnlyBest
            ref={mobileRainbowRef}
            allBullesRef={mobileBullesRef}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
