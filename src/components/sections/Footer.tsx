import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import lottie, { AnimationItem } from "lottie-web";
import gsap from "gsap";
import {
  CHARACTER_ANIMS,
  FOOTER_CLOUDS,
  FOOTER_GAME_ITEMS,
  SOCIAL_LINKS,
} from "../../data/footer.ts";
import { CharacterStateKey } from "../../types/types.ts";
import { RainbowBouncingText } from "../shared/RainbowBouncingText.tsx";
import { ShadowButton } from "../shared/ShadowButton.tsx";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLElement>(null);
  const paysageRef = useRef<HTMLDivElement>(null);
  const charContainersRef = useRef<Record<string, HTMLDivElement | null>>({});
  const charAnimsRef = useRef<Record<string, AnimationItem | null>>({});
  const cloudsRef = useRef<(HTMLImageElement | null)[]>([]);
  const denreeRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLDivElement>(null);
  const animPaysageRef = useRef<AnimationItem | null>(null);

  const [gameState, setGameState] = useState<"idle" | "running">("idle");
  const [activeChar, setActiveChar] = useState<CharacterStateKey>("walk");
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentObstacle, setCurrentObstacle] = useState<{
    isCan: boolean;
    src: string;
  }>({
    isCan: false,
    src: "",
  });

  const isJumpingRef = useRef(false);
  const gameRunningRef = useRef(false);
  const obstacleTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const consecutiveObstaclesRef = useRef(0);
  const lastObstacleSrcRef = useRef<string>("");

  useEffect(() => {
    CHARACTER_ANIMS.forEach(({ key, path, loop, autoplay }) => {
      const container = charContainersRef.current[key];
      if (!container) return;
      charAnimsRef.current[key] = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop,
        autoplay,
        path,
      });
    });

    if (paysageRef.current) {
      animPaysageRef.current = lottie.loadAnimation({
        container: paysageRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/jeu_paysage.json",
      });
    }

    const cloudTimelines = FOOTER_CLOUDS.map((cloud, idx) => {
      const el = cloudsRef.current[idx];
      if (!el) return null;
      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(
        el,
        { x: "100vw" },
        {
          x: "-120vw",
          duration: cloud.duration,
          delay: cloud.delay || 0,
          ease: "none",
        },
      );
      return tl;
    });

    if (denreeRef.current) {
      gsap.set(denreeRef.current, { x: "105vw", y: 0, opacity: 0 });
    }

    return () => {
      Object.values(charAnimsRef.current).forEach((anim) => anim?.destroy());
      animPaysageRef.current?.destroy();
      cloudTimelines.forEach((tl) => tl?.kill());
      obstacleTimelineRef.current?.kill();
    };
  }, []);

  const switchCharacterState = (
    nextState: CharacterStateKey,
    durationSec: number,
    word: string | null = null,
    onDone?: () => void,
  ) => {
    setActiveChar(nextState);
    if (word !== null) setCurrentWord(word);

    charAnimsRef.current.walk?.pause();
    charAnimsRef.current[nextState]?.goToAndPlay(0, true);

    gsap.delayedCall(durationSec, () => {
      setActiveChar("walk");
      if (word !== null) setCurrentWord(null);
      charAnimsRef.current[nextState]?.pause();
      charAnimsRef.current.walk?.goToAndPlay(0, true);
      onDone?.();
    });
  };

  const jump = () => {
    if (isJumpingRef.current || !gameRunningRef.current) return;
    isJumpingRef.current = true;
    switchCharacterState("jump", 0.95, null, () => {
      isJumpingRef.current = false;
    });
  };

  const triggerHappy = () => {
    if (animPaysageRef.current) {
      animPaysageRef.current.setSpeed(2.5);
      gsap.delayedCall(1.2, () => {
        animPaysageRef.current?.setSpeed(1.0);
      });
    }
    switchCharacterState("happy", 1.5, "BOOST");
  };

  const triggerSad = () => {
    switchCharacterState("sad", 2.2, "ark...");
  };

  const spawnNextObstacle = () => {
    if (!gameRunningRef.current || !denreeRef.current) return;

    const forceCan = consecutiveObstaclesRef.current >= 2;
    const candidates = forceCan
      ? FOOTER_GAME_ITEMS.filter((item) => item.isCan)
      : FOOTER_GAME_ITEMS.filter(
          (item) => item.src !== lastObstacleSrcRef.current,
        );

    const nextItem =
      candidates[Math.floor(Math.random() * candidates.length)] ||
      FOOTER_GAME_ITEMS[0];

    consecutiveObstaclesRef.current = nextItem.isCan
      ? 0
      : consecutiveObstaclesRef.current + 1;
    lastObstacleSrcRef.current = nextItem.src;

    setCurrentObstacle(nextItem);

    let collisionHandled = false;
    const baseDur = window.innerWidth > 768 ? 2.6 : 2.2;
    const dur = baseDur + Math.random() * 0.45;

    obstacleTimelineRef.current?.kill();
    obstacleTimelineRef.current = gsap.timeline({
      onComplete: () => {
        if (gameRunningRef.current) spawnNextObstacle();
      },
    });

    obstacleTimelineRef.current.fromTo(
      denreeRef.current,
      { x: "115vw", y: 0, opacity: 1, scale: 1 },
      {
        x: "-25vw",
        y: 0,
        duration: dur,
        ease: "none",
        onUpdate: function () {
          const p = this.progress();
          if (p > 0.46 && p < 0.58 && !collisionHandled) {
            collisionHandled = true;
            if (nextItem.isCan) {
              triggerHappy();
              gsap.to(denreeRef.current, { opacity: 0, duration: 0.2 });
            } else if (!isJumpingRef.current) {
              triggerSad();
              gsap.to(denreeRef.current, { opacity: 0, duration: 0.35 });
            }
          }
        },
      },
    );
  };

  const startGame = () => {
    if (gameRunningRef.current) {
      jump();
      return;
    }

    gameRunningRef.current = true;
    setGameState("running");
    consecutiveObstaclesRef.current = 0;
    lastObstacleSrcRef.current = "";

    jump();

    if (startBtnRef.current) {
      gsap.to(startBtnRef.current, {
        y: "100px",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }

    if (denreeRef.current) {
      gsap.set(denreeRef.current, { x: "120vw", y: 0, opacity: 0 });
    }

    gsap.delayedCall(1.2, spawnNextObstacle);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!gameRunningRef.current) startGame();
        else jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreditsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(t("footer.creditsAlert"));
  };

  const legalLinks = t("footer.legalLinks", {
    returnObjects: true,
  }) as string[];

  const renderLegalLinks = () =>
    legalLinks.map((label) => (
      <a
        key={label}
        href="#"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="cursor-pointer"
      >
        {label}
      </a>
    ));

  return (
    <footer
      ref={containerRef}
      id="shopify-section-footer"
      onClick={() => {
        if (!gameRunningRef.current) startGame();
        else jump();
      }}
      className="relative z-10 w-full h-[100dvh] min-h-[580px] sm:min-h-[640px] max-h-[1080px] bg-[#FEF7E6] overflow-hidden flex flex-col justify-between select-none cursor-pointer"
    >
      <div className="hidden sm:flex relative z-20 w-full pt-8 px-6 sm:px-12 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          {SOCIAL_LINKS.map((item) => (
            <ShadowButton
              key={item.name}
              variant="icon"
              size="circle"
              rounded="full"
              bg="#ffd372"
              shadowColor="#2b3d73"
              borderColor="#2b3d73"
              shadowOffset={2.5}
              href={item.href}
              target="_blank"
              aria-label={item.name}
              onClick={(e) => e.stopPropagation()}
              icon={
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              }
            />
          ))}
        </div>
      </div>

      <div className="sm:hidden w-full h-2" />

      {FOOTER_CLOUDS.map((cloud, idx) => (
        <img
          key={idx}
          ref={(el) => {
            cloudsRef.current[idx] = el;
          }}
          className={cloud.className}
          src="/svg/nuage.svg"
          alt=""
        />
      ))}

      {currentWord && (
        <div className="absolute top-[28vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center select-none">
          <RainbowBouncingText
            key={currentWord}
            autoPlay
            text={currentWord}
            triggerOnScroll={false}
            fontFamily="var(--font-main)"
            fontWeight={300}
            fontSize="clamp(70px, 14vw, 220px)"
            letterSpacing="-0.02em"
            className="uppercase tracking-tight leading-none"
          />
        </div>
      )}

      <div className="absolute bottom-[40%] sm:bottom-[25%] left-0 w-full h-[1.5px] bg-[#0E0E0E] z-10" />

      <div
        ref={paysageRef}
        className="absolute bottom-0 left-0 w-full pointer-events-none z-5"
      />

      <div className="absolute top-[52%] sm:top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vh] aspect-square sm:w-[150vh] pointer-events-none z-15 flex items-center justify-center">
        {CHARACTER_ANIMS.map(({ key }) => (
          <div
            key={key}
            ref={(el) => {
              charContainersRef.current[key] = el;
            }}
            className={`w-full h-full ${activeChar === key ? "block" : "hidden"}`}
          />
        ))}
      </div>

      <div
        ref={denreeRef}
        className="absolute bottom-[40%] sm:bottom-[20%] left-0 w-[24vh] sm:w-[32vh] h-[25vh] sm:h-[34vh] pointer-events-none z-15 flex items-end justify-center overflow-visible"
        style={{
          opacity: 0,
          transform: "translate3d(120vw, 0, 0)",
          willChange: "transform, opacity",
        }}
      >
        {currentObstacle.src && (
          <img
            src={currentObstacle.src}
            alt={
              currentObstacle.isCan
                ? t("footer.canAlt")
                : t("footer.obstacleAlt")
            }
            className={`filter drop-shadow-sm select-none pointer-events-none ${
              currentObstacle.isCan
                ? "h-[52%] w-auto self-end object-contain object-bottom"
                : "h-[85%] w-auto max-w-full self-end object-contain object-bottom"
            }`}
          />
        )}
      </div>

      {gameState === "idle" && (
        <div
          ref={startBtnRef}
          className="absolute top-[70%] sm:top-auto sm:bottom-[24%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-y-0 z-30 pointer-events-auto"
        >
          <ShadowButton
            variant="text"
            size="lg"
            rounded="xl"
            bg="#ffd372"
            shadowColor="#0e0e0e"
            borderColor="#0e0e0e"
            shadowOffset={2.5}
            onClick={(e) => {
              e?.stopPropagation();
              startGame();
            }}
            aria-label={t("footer.jumpAria")}
          >
            <span>{t("footer.jumpPrompt")}</span>
          </ShadowButton>
        </div>
      )}

      <div className="relative z-20 w-full pb-5 sm:pb-8 px-6 sm:px-14 flex flex-col items-center pointer-events-auto">
        <div className="flex sm:hidden flex-col items-center gap-1 text-[13.5px] mb-4">
          {renderLegalLinks()}
        </div>

        <div className="w-full flex items-center justify-between text-[13.5px] sm:text-base">
          <p className="whitespace-nowrap">{t("footer.copyright")}</p>

          <div className="hidden sm:flex items-center gap-8">
            {renderLegalLinks()}
            <button onClick={handleCreditsClick} className="cursor-pointer">
              {t("footer.credits")}
            </button>
          </div>

          <button
            onClick={handleCreditsClick}
            className="inline sm:hidden cursor-pointer"
          >
            {t("footer.credits")}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
