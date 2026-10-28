import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Flavor,
  FlavorId,
  FLAVOR_MAP,
  FLAVOR_ORDER,
  HERO_WHEEL_STEPS,
} from "../../data/flavors.ts";
import { HeroArtItem } from "../../types/types.ts";
import { ArrowButton } from "../shared/ArrowButton.tsx";
import { LottieBox } from "../shared/LottieBox.tsx";
import { ShadowButton } from "../shared/ShadowButton.tsx";

gsap.registerPlugin(ScrollTrigger);

export interface HeroSectionProps {
  currentFlavor: Flavor;
  flavors: Flavor[];
  onSelectFlavor: (flavorId: FlavorId) => void;
  onAddToCart: (flavorId: string) => void;
}

const renderArtItem = (item: HeroArtItem, index: number) =>
  item.type === "lottie" ? (
    <LottieBox key={index} path={item.src} className={item.className} />
  ) : (
    <img key={index} src={item.src} alt="" className={item.className} />
  );

const StepContent: React.FC<{ flavorId: FlavorId }> = ({ flavorId }) => {
  const flavor = FLAVOR_MAP[flavorId] || FLAVOR_MAP.grapefruit;

  return (
    <div className="absolute top-0 left-[calc(50%-50vw)] w-[100vw] h-screen overflow-hidden flex items-center justify-center pointer-events-none">
      <div className="art-left absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
        {flavor.heroArt.left.map(renderArtItem)}
      </div>
      <div className="art-right absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
        {flavor.heroArt.right.map(renderArtItem)}
      </div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentFlavor,
  flavors,
  onSelectFlavor,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const currentIndex = flavors.findIndex((f) => f.id === currentFlavor.id);

  const displayName = t(`flavors.${currentFlavor.id}.heroName`);

  const handlePrev = () => {
    const nextIndex = (currentIndex - 1 + flavors.length) % flavors.length;
    onSelectFlavor(flavors[nextIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % flavors.length;
    onSelectFlavor(flavors[nextIndex].id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, flavors]);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const bgWheelRef = useRef<HTMLDivElement>(null);
  const rotationHomeRef = useRef(0);
  const prevFlavorRef = useRef<FlavorId>(currentFlavor.id);

  useEffect(() => {
    const bgWheel = bgWheelRef.current;
    if (!bgWheel) return;

    const prevIdx = FLAVOR_ORDER.indexOf(prevFlavorRef.current);
    const currIdx = FLAVOR_ORDER.indexOf(currentFlavor.id);
    prevFlavorRef.current = currentFlavor.id;

    if (prevIdx !== -1 && currIdx !== -1 && prevIdx !== currIdx) {
      let diff = currIdx - prevIdx;
      if (diff > 2) diff -= 4;
      if (diff < -2) diff += 4;
      const dir = diff >= 0 ? 1 : -1;

      rotationHomeRef.current -= 45 * diff;

      gsap.killTweensOf(bgWheel);
      gsap
        .timeline()
        .to(bgWheel, {
          rotation: rotationHomeRef.current + 30 * dir,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(bgWheel, {
          rotation: rotationHomeRef.current,
          duration: 1.2,
          ease: "elastic.out(0.34, 0.26)",
        });
    }
  }, [currentFlavor.id]);

  useEffect(() => {
    const track = scrollTrackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const opacity = `${Math.max(0, 1 - p * 2.2)}`;

          const leftArts =
            bgWheelRef.current?.querySelectorAll<HTMLElement>(".art-left");
          const rightArts =
            bgWheelRef.current?.querySelectorAll<HTMLElement>(".art-right");

          if (leftArts) {
            const transform = `translate(${-p * 180}px, ${-p * 120}px) rotate(${-p * 20}deg)`;
            leftArts.forEach((el) => {
              el.style.transform = transform;
              el.style.opacity = opacity;
            });
          }

          if (rightArts) {
            const transform = `translate(${p * 220}px, ${-p * 120}px) rotate(${p * 20}deg)`;
            rightArts.forEach((el) => {
              el.style.transform = transform;
              el.style.opacity = opacity;
            });
          }

          if (navRef.current) {
            navRef.current.style.transform = `translateY(${p * 220}px)`;
            navRef.current.style.opacity = `${Math.max(0, 1 - p * 3.5)}`;
            navRef.current.style.display = p > 0.35 ? "none" : "flex";
          }
        },
      });

      return () => st.kill();
    });

    mm.add("(max-width: 767px)", () => {
      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const p = self.progress;
          if (navRef.current) {
            navRef.current.style.transform = `translateY(${p * 180}px)`;
            navRef.current.style.opacity = `${Math.max(0, 1 - p * 2.5)}`;
            navRef.current.style.display = p > 0.4 ? "none" : "flex";
          }
        },
      });

      return () => {
        st.kill();
        if (navRef.current) {
          navRef.current.style.transform = "";
          navRef.current.style.opacity = "";
          navRef.current.style.display = "flex";
        }
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={scrollTrackRef}
      id="hero-scroll-container"
      className="relative w-full h-screen min-h-[600px] md:h-[180vh] transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: currentFlavor.bg }}
    >
      <section
        ref={stageRef}
        className="w-full h-screen min-h-[600px] md:min-h-[680px] flex flex-col justify-between overflow-hidden select-none transition-colors duration-700 ease-in-out relative"
        style={{ backgroundColor: currentFlavor.bg }}
      >
        <div
          ref={bgWheelRef}
          className="absolute pointer-events-none"
          style={{
            width: "450vw",
            height: "450vw",
            borderRadius: "100%",
            top: 0,
            left: "calc(50% - 225vw)",
            transformOrigin: "50% 50%",
            transform: "rotate(0deg)",
          }}
        >
          {HERO_WHEEL_STEPS.map((s) => (
            <div
              key={s.step}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                transform: `rotate(${s.angle}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              <StepContent flavorId={s.flavorId} />
            </div>
          ))}
        </div>

        <div className="w-full h-24" />
        <div className="w-full pb-8 sm:pb-12 pointer-events-none" />
      </section>

      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={navRef}
            className="fixed bottom-6 sm:bottom-8 left-0 right-0 z-30 pointer-events-none flex items-center justify-center transition-transform duration-100 ease-out"
          >
            <div className="w-[92vw] max-w-[1000px] flex items-center justify-center gap-4 sm:gap-6 pointer-events-auto">
              <ArrowButton
                id="hero-prev-btn"
                direction="left"
                onClick={handlePrev}
                ariaLabel={t("hero.prevFlavor")}
              />

              <div className="w-[200px] sm:w-[380px] md:w-[420px] shrink-0 flex items-center justify-center">
                <ShadowButton
                  id="hero-flavor-btn"
                  variant="text"
                  size="lg"
                  rounded="full"
                  bg={currentFlavor.btnBg}
                  shadowColor={currentFlavor.btnShadow}
                  textColor="#ffffff"
                  borderColor="#0e0e0e"
                  shadowOffset={2.5}
                  onClick={() => onAddToCart(currentFlavor.id)}
                  aria-label={t("hero.selectFlavor", { name: displayName })}
                >
                  <span>{displayName}</span>
                </ShadowButton>
              </div>

              <ArrowButton
                id="hero-next-btn"
                direction="right"
                onClick={handleNext}
                ariaLabel={t("hero.nextFlavor")}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HeroSection;
