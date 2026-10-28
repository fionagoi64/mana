import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flavor } from '../data/flavors.ts';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface HeroSectionProps {
  currentFlavor: Flavor;
  flavors: Flavor[];
  onSelectFlavor: (flavorId: Flavor['id']) => void;
  onAddToCart: (flavorId: string) => void;
}

const LottieItem: React.FC<{
  path: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ path, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path,
    });
    return () => {
      anim.destroy();
    };
  }, [path]);

  return <div ref={containerRef} className={className} style={style} />;
};

const StepContent: React.FC<{
  flavor: string;
}> = ({ flavor }) => {
  if (flavor === 'grapefruit') {
    return (
      <div className="absolute top-0 left-[calc(50%-50vw)] w-[100vw] h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="art-left absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <LottieItem
            path="/assets/lottie_pamp_1.json"
            className="absolute top-[48%] left-[-2vw] -translate-y-1/2 w-[38vw] max-w-[540px]"
          />
          <img
            src="/assets/home_bulles.svg"
            alt=""
            className="absolute top-[28%] left-[22vw] w-[5vw] max-w-[80px] opacity-90 animate-float-slow"
          />
          <LottieItem
            path="/assets/lottie_pamp_2.json"
            className="absolute bottom-[8vh] left-[7vw] w-[20vw] max-w-[280px]"
          />
        </div>
        <div className="art-right absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <img
            src="/assets/woman.svg"
            alt=""
            className="absolute top-[-8vh] right-[4vw] w-[30vw] max-w-[440px] object-contain animate-float-slow"
          />
          <LottieItem
            path="/assets/lottie_pamp_4.json"
            className="absolute bottom-[-6vh] right-[0vw] w-[28vw] max-w-[420px]"
          />
        </div>
      </div>
    );
  }

  if (flavor === 'hibiscus') {
    return (
      <div className="absolute top-0 left-[calc(50%-50vw)] w-[100vw] h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="art-left absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <LottieItem
            path="/assets/lottie_hibi_1.json"
            className="absolute top-[8vh] left-[3vw] w-[28vw] max-w-[420px]"
          />
          <img
            src="/assets/home_star.svg"
            alt=""
            className="absolute top-[22vh] left-[32vw] w-[3vw] max-w-[45px] animate-pulse-subtle"
          />
          <LottieItem
            path="/assets/lottie_hibi_2.json"
            className="absolute bottom-[6vh] left-[7vw] w-[18vw] max-w-[260px]"
          />
        </div>
        <div className="art-right absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <LottieItem
            path="/assets/lottie_hibi_3.json"
            className="absolute top-[2vh] right-[-2vw] w-[50vw] max-w-[700px]"
          />
          <img
            src="/assets/home_planet.svg"
            alt=""
            className="absolute bottom-[-4vh] right-[2vw] w-[22vw] max-w-[340px] animate-float-slow"
          />
        </div>
      </div>
    );
  }

  if (flavor === 'tropical') {
    return (
      <div className="absolute top-0 left-[calc(50%-50vw)] w-[100vw] h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="art-left absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <LottieItem
            path="/assets/lottie_trop_1.json"
            className="absolute bottom-[-6vh] left-[0vw] w-[36vw] max-w-[520px]"
          />
          <img
            src="/assets/home_eau.svg"
            alt=""
            className="absolute top-[12vh] left-[6vw] w-[26vw] max-w-[380px] animate-float-reverse"
          />
          <img
            src="/assets/mangue.svg"
            alt=""
            className="absolute top-[8vh] left-[20vw] w-[12vw] max-w-[180px] animate-float-slow"
          />
        </div>
        <div className="art-right absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
          <LottieItem
            path="/assets/lottie_trop_2.json"
            className="absolute top-[6vh] right-[0vw] w-[38vw] max-w-[560px]"
          />
          <LottieItem
            path="/assets/lottie_trop_4.json"
            className="absolute top-[44%] right-[16vw] w-[18vw] max-w-[260px]"
          />
        </div>
      </div>
    );
  }

  // melon
  return (
    <div className="absolute top-0 left-[calc(50%-50vw)] w-[100vw] h-screen overflow-hidden flex items-center justify-center pointer-events-none">
      <div className="art-left absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
        <LottieItem
          path="/assets/lottie_melo_1.json"
          className="absolute top-[46%] left-[2vw] -translate-y-1/2 w-[34vw] max-w-[500px]"
        />
        <img
          src="/assets/home_fleur.svg"
          alt=""
          className="absolute bottom-[-3%] left-[2vw] w-[25vw] max-w-[360px] animate-float-slow"
        />
      </div>
      <div className="art-right absolute inset-0 pointer-events-none transition-transform duration-100 ease-out">
        <LottieItem
          path="/assets/lottie_melo_2.json"
          className="absolute top-[6vh] right-[4vw] w-[26vw] max-w-[400px]"
        />
        <LottieItem
          path="/assets/lottie_melo_3.json"
          className="absolute bottom-[-2vh] right-[3vw] w-[30vw] max-w-[460px]"
        />
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
  const { t, i18n } = useTranslation();
  const currentIndex = flavors.findIndex((f) => f.id === currentFlavor.id);

  // Background color mapping matching the authentic site
  const slideConfigs: Record<
    string,
    {
      bg: string;
      btnBg: string;
      btnShadow: string;
      name: string;
    }
  > = {
    grapefruit: {
      bg: '#ffd372', // Authentic warm citrus yellow
      btnBg: '#f15b40', // Coral red
      btnShadow: '#2b3d73', // Navy shadow
      name: i18n.language === 'fr' ? 'Pamplemousse' : 'Grapefruit',
    },
    hibiscus: {
      bg: '#85baea', // Authentic soft sky blue
      btnBg: '#2b3d73', // Navy
      btnShadow: '#141d36', // Dark blue shadow
      name: i18n.language === 'fr' ? 'Mûre et Hibiscus' : 'Blackberry & Hibiscus',
    },
    tropical: {
      bg: '#f6b1cf', // Authentic rosy pink
      btnBg: '#e72f63', // Hot pink
      btnShadow: '#6b122c', // Wine shadow
      name: 'Tropical',
    },
    melon: {
      bg: '#acd084', // Authentic lime green
      btnBg: '#195e1c', // Forest green
      btnShadow: '#0e0e0e', // Dark shadow
      name: i18n.language === 'fr' ? 'Melon et Menthe' : 'Melon & Mint',
    },
  };

  const currentConfig = slideConfigs[currentFlavor.id] || slideConfigs.melon;

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
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flavors]);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const bgWheelRef = useRef<HTMLDivElement>(null);
  const rotationHomeRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const prevFlavorRef = useRef<string>(currentFlavor.id);

  // 8 steps placed at every 45 degrees on the 450vw wheel for seamless infinite spinning
  const EIGHT_STEPS = [
    { step: 0, flavor: 'grapefruit', angle: 0 },
    { step: 1, flavor: 'hibiscus', angle: 45 },
    { step: 2, flavor: 'tropical', angle: 90 },
    { step: 3, flavor: 'melon', angle: 135 },
    { step: 4, flavor: 'grapefruit', angle: 180 },
    { step: 5, flavor: 'hibiscus', angle: 225 },
    { step: 6, flavor: 'tropical', angle: 270 },
    { step: 7, flavor: 'melon', angle: 315 },
  ];

  // 1. Authentic circular background carousel rotation on flavor change
  useEffect(() => {
    const bgWheel = bgWheelRef.current;
    if (!bgWheel) return;

    const flavorOrder = ['grapefruit', 'hibiscus', 'tropical', 'melon'];
    const prevIdx = flavorOrder.indexOf(prevFlavorRef.current);
    const currIdx = flavorOrder.indexOf(currentFlavor.id);
    prevFlavorRef.current = currentFlavor.id;

    if (prevIdx !== -1 && currIdx !== -1 && prevIdx !== currIdx) {
      let diff = currIdx - prevIdx;
      if (diff > 2) diff -= 4;
      if (diff < -2) diff += 4;
      const dir = diff >= 0 ? 1 : -1;

      rotationHomeRef.current -= 45 * diff;
      currentStepRef.current += diff;

      gsap.killTweensOf(bgWheel);
      gsap.timeline()
        .to(bgWheel, {
          rotation: rotationHomeRef.current + 30 * dir,
          duration: 0.4,
          ease: 'power2.in',
        })
        .to(bgWheel, {
          rotation: rotationHomeRef.current,
          duration: 1.2,
          ease: 'elastic.out(0.34, 0.26)',
        });
    }
  }, [currentFlavor.id]);

  // 2. Scroll animations: art disperses outward, navigation sinks away, can turns 360 vertically
  useEffect(() => {
    const track = scrollTrackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: false,
      scrub: 1.2,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        const leftArts = bgWheelRef.current?.querySelectorAll<HTMLElement>('.art-left');
        const rightArts = bgWheelRef.current?.querySelectorAll<HTMLElement>('.art-right');

        if (leftArts) {
          const transform = `translate(${-p * 180}px, ${-p * 120}px) rotate(${-p * 20}deg)`;
          const opacity = `${Math.max(0, 1 - p * 2.2)}`;
          leftArts.forEach((el) => {
            el.style.transform = transform;
            el.style.opacity = opacity;
          });
        }

        if (rightArts) {
          const transform = `translate(${p * 220}px, ${-p * 120}px) rotate(${p * 20}deg)`;
          const opacity = `${Math.max(0, 1 - p * 2.2)}`;
          rightArts.forEach((el) => {
            el.style.transform = transform;
            el.style.opacity = opacity;
          });
        }

        if (navRef.current) {
          navRef.current.style.transform = `translateY(${p * 220}px)`;
          navRef.current.style.opacity = `${Math.max(0, 1 - p * 3.5)}`;
          if (p > 0.35) {
            navRef.current.style.display = 'none';
          } else {
            navRef.current.style.display = 'flex';
          }
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={scrollTrackRef}
      id="hero-scroll-container"
      className="relative w-full h-[180vh] transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: currentConfig.bg }}
    >
      {/* Fullscreen Hero Stage pinned by GSAP */}
      <section
        ref={stageRef}
        className="w-full h-screen min-h-[680px] flex flex-col justify-between overflow-hidden select-none transition-colors duration-700 ease-in-out relative"
        style={{ backgroundColor: currentConfig.bg }}
      >
        {/* ========================================================
            CIRCULAR CAROUSEL WHEEL (SPINS ON FLAVOR CHANGE)
            ======================================================== */}
        <div
          ref={bgWheelRef}
          className="innerCercle lotties absolute pointer-events-none"
          style={{
            width: '450vw',
            height: '450vw',
            borderRadius: '100%',
            top: 0,
            left: 'calc(50% - 225vw)',
            transformOrigin: '50% 50%',
            transform: 'rotate(0deg)',
          }}
        >
          {EIGHT_STEPS.map((s) => (
            <div
              key={s.step}
              className={`step step${s.step} absolute top-0 left-0 w-full h-full pointer-events-none`}
              style={{ transform: `rotate(${s.angle}deg)`, transformOrigin: '50% 50%' }}
            >
              <StepContent flavor={s.flavor} />
            </div>
          ))}
        </div>

        {/* Top spacing */}
        <div className="w-full h-24" />

        {/* Bottom spacing spacer */}
        <div className="w-full pb-8 sm:pb-12 pointer-events-none" />
      </section>

      {/* ========================================================
          AUTHENTIC SLIDER CONTROLS (PORTALED TO z-30 ABOVE 3D CAN)
          ======================================================== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={navRef}
            className="fixed bottom-8 sm:bottom-12 left-0 right-0 z-30 pointer-events-none flex items-center justify-center transition-transform duration-100 ease-out"
          >
            <div className="w-[92vw] max-w-[1000px] flex items-center justify-center gap-4 sm:gap-6 pointer-events-auto">
              {/* Previous White Circle Button */}
              <button
                id="hero-prev-btn"
                onClick={handlePrev}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Previous Flavor"
              >
                <img src="/assets/i_arrow.svg" alt="" className="w-4 sm:w-5 h-auto" />
              </button>

              {/* Single Flavor Name Button (matching authentic .btnOmbre) */}
              <button
                id="hero-flavor-btn"
                onClick={() => onAddToCart(currentFlavor.id)}
                className="relative group cursor-pointer select-none transition-transform active:scale-95 shrink-0"
                aria-label={`Select ${currentConfig.name}`}
              >
                {/* Authentic 3D shadow layer underneath */}
                <div
                  className="absolute inset-0 rounded-full translate-y-[4px] transition-transform group-hover:translate-y-[2px]"
                  style={{ backgroundColor: currentConfig.btnShadow }}
                />
                {/* Pill button content */}
                <div
                  className="relative px-8 sm:px-12 py-3 sm:py-3.5 rounded-full font-bold text-white text-base sm:text-lg md:text-xl tracking-wide flex items-center justify-center min-w-[200px] sm:min-w-[260px] border border-black/20 transition-transform group-hover:translate-y-[2px]"
                  style={{ backgroundColor: currentConfig.btnBg }}
                >
                  <span>{currentConfig.name}</span>
                </div>
              </button>

              {/* Next White Circle Button */}
              <button
                id="hero-next-btn"
                onClick={handleNext}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Next Flavor"
              >
                <img src="/assets/i_arrow.svg" alt="" className="w-4 sm:w-5 h-auto rotate-180" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HeroSection;
