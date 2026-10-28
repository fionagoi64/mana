import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import lottie, { AnimationItem } from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShadowButton } from "./ShadowButton.tsx";

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isFrench = Boolean(i18n.language && i18n.language.startsWith("fr"));

  const containerRef = useRef<HTMLElement>(null);
  const paysageRef = useRef<HTMLDivElement>(null);
  const walkRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const sadRef = useRef<HTMLDivElement>(null);
  const happyRef = useRef<HTMLDivElement>(null);
  const denreeRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLDivElement>(null);

  // Animations references
  const animWalkRef = useRef<AnimationItem | null>(null);
  const animJumpRef = useRef<AnimationItem | null>(null);
  const animSadRef = useRef<AnimationItem | null>(null);
  const animHappyRef = useRef<AnimationItem | null>(null);
  const animPaysageRef = useRef<AnimationItem | null>(null);

  const [gameState, setGameState] = useState<"idle" | "running" | "gameover">(
    "idle",
  );
  const [activeChar, setActiveChar] = useState<
    "walk" | "jump" | "sad" | "happy"
  >("walk");
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentObstacle, setCurrentObstacle] = useState<{
    isCan: boolean;
    src: string;
  }>({
    isCan: false,
    src: "/assets/obs1.svg",
  });

  const isJumpingRef = useRef(false);
  const gameRunningRef = useRef(false);
  const obstacleTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const cloudTl1Ref = useRef<gsap.core.Timeline | null>(null);
  const cloudTl2Ref = useRef<gsap.core.Timeline | null>(null);

  // 1. Initialize Lottie animations
  useEffect(() => {
    if (walkRef.current) {
      animWalkRef.current = lottie.loadAnimation({
        container: walkRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/assets/jeu_walk.json",
      });
    }

    if (jumpRef.current) {
      animJumpRef.current = lottie.loadAnimation({
        container: jumpRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/jeu_jump.json",
      });
    }

    if (sadRef.current) {
      animSadRef.current = lottie.loadAnimation({
        container: sadRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/jeu_sad.json",
      });
    }

    if (happyRef.current) {
      animHappyRef.current = lottie.loadAnimation({
        container: happyRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/jeu_happy.json",
      });
    }

    if (paysageRef.current) {
      animPaysageRef.current = lottie.loadAnimation({
        container: paysageRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/assets/jeu_paysage.json",
      });
    }

    // Clouds infinite drifting
    const cloud1 = containerRef.current?.querySelector(".nuage1");
    const cloud2 = containerRef.current?.querySelector(".nuage2");

    if (cloud1) {
      cloudTl1Ref.current = gsap.timeline({ repeat: -1 });
      cloudTl1Ref.current.fromTo(
        cloud1,
        { x: "100vw" },
        { x: "-120vw", duration: 14, ease: "none" },
      );
    }

    if (cloud2) {
      cloudTl2Ref.current = gsap.timeline({ repeat: -1 });
      cloudTl2Ref.current.fromTo(
        cloud2,
        { x: "100vw" },
        { x: "-120vw", duration: 18, delay: 4, ease: "none" },
      );
    }

    return () => {
      animWalkRef.current?.destroy();
      animJumpRef.current?.destroy();
      animSadRef.current?.destroy();
      animHappyRef.current?.destroy();
      animPaysageRef.current?.destroy();
      cloudTl1Ref.current?.kill();
      cloudTl2Ref.current?.kill();
      obstacleTimelineRef.current?.kill();
    };
  }, []);

  // 2. Character jump action
  const jump = () => {
    if (isJumpingRef.current || !gameRunningRef.current) return;
    isJumpingRef.current = true;

    // Switch to jump animation
    setActiveChar("jump");
    if (animWalkRef.current) animWalkRef.current.pause();
    if (animJumpRef.current) {
      animJumpRef.current.goToAndPlay(0, true);
    }

    // Jump duration is 0.95s matching authentic site
    gsap.delayedCall(0.95, () => {
      isJumpingRef.current = false;
      setActiveChar("walk");
      if (animJumpRef.current) animJumpRef.current.pause();
      if (animWalkRef.current) {
        animWalkRef.current.goToAndPlay(0, true);
      }
    });
  };

  // 3. Play happy "BOOST" animation on catching canette
  const triggerHappy = () => {
    setActiveChar("happy");
    setCurrentWord("BOOST");

    if (animWalkRef.current) animWalkRef.current.pause();
    if (animHappyRef.current) {
      animHappyRef.current.goToAndPlay(0, true);
    }

    // Speed up background landscape temporarily
    if (animPaysageRef.current) {
      animPaysageRef.current.setSpeed(2.5);
      gsap.delayedCall(1.2, () => {
        animPaysageRef.current?.setSpeed(1.0);
      });
    }

    gsap.delayedCall(1.5, () => {
      setActiveChar("walk");
      setCurrentWord(null);
      if (animHappyRef.current) animHappyRef.current.pause();
      if (animWalkRef.current) {
        animWalkRef.current.goToAndPlay(0, true);
      }
    });
  };

  // 4. Play sad "ark..." animation on colliding with obstacle
  const triggerSad = () => {
    setActiveChar("sad");
    setCurrentWord("ark...");

    if (animWalkRef.current) animWalkRef.current.pause();
    if (animSadRef.current) {
      animSadRef.current.goToAndPlay(0, true);
    }

    // Wobble clouds down on crash
    gsap.to(".nuage", {
      y: "60%",
      stagger: 0.08,
      duration: 0.6,
      ease: "elastic.inOut(1, 1)",
      yoyo: true,
      repeat: 1,
    });

    gsap.delayedCall(2.2, () => {
      setActiveChar("walk");
      setCurrentWord(null);
      if (animSadRef.current) animSadRef.current.pause();
      if (animWalkRef.current) {
        animWalkRef.current.goToAndPlay(0, true);
      }
    });
  };

  // 5. Spawn obstacles / canettes in a loop
  const spawnNextObstacle = () => {
    if (!gameRunningRef.current || !denreeRef.current) return;

    const isCan = Math.random() >= 0.7;
    let obstacleSrc = "/assets/canette.svg";
    if (!isCan) {
      const idx = Math.floor(Math.random() * 7) + 1;
      obstacleSrc = `/assets/obs${idx}.svg`;
    }

    setCurrentObstacle({ isCan, src: obstacleSrc });

    let collisionHandled = false;
    const dur = window.innerWidth > 768 ? 2.8 : 2.4;

    obstacleTimelineRef.current = gsap.timeline({
      onComplete: () => {
        if (gameRunningRef.current) {
          spawnNextObstacle();
        }
      },
    });

    gsap.set(denreeRef.current, { x: "105vw", opacity: 1, scale: 1 });

    obstacleTimelineRef.current.to(denreeRef.current, {
      x: "-20vw",
      duration: dur,
      ease: "none",
      onUpdate: function () {
        const p = this.progress();

        // Hit-window when obstacle passes character (p between 0.46 and 0.58)
        if (p > 0.46 && p < 0.58 && !collisionHandled) {
          collisionHandled = true;

          if (isCan) {
            // Player collects can
            triggerHappy();
            gsap.to(denreeRef.current, {
              opacity: 0,
              scale: 1.4,
              duration: 0.2,
            });
          } else {
            if (!isJumpingRef.current) {
              // Collision! Player hit obstacle
              triggerSad();
              gsap.to(denreeRef.current, {
                y: "40px",
                rotation: -25,
                opacity: 0,
                duration: 0.4,
              });
            }
          }
        }
      },
    });
  };

  // 6. Start game
  const startGame = () => {
    if (gameRunningRef.current) {
      jump();
      return;
    }

    gameRunningRef.current = true;
    setGameState("running");

    // Hide start button
    if (startBtnRef.current) {
      gsap.to(startBtnRef.current, {
        y: "100px",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }

    // Initial obstacle spawn
    gsap.delayedCall(0.5, () => {
      spawnNextObstacle();
    });
  };

  // 7. Keyboard Space listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        // Prevent default window scrolling when pressing spacebar
        e.preventDefault();
        if (!gameRunningRef.current) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <footer
      ref={containerRef}
      id="shopify-section-footer"
      onClick={() => {
        if (!gameRunningRef.current) {
          startGame();
        } else {
          jump();
        }
      }}
      className="relative z-20 w-full h-screen min-h-[640px] max-h-[1080px] bg-[#FEF7E6] overflow-hidden flex flex-col justify-between select-none cursor-pointer"
    >
      {/* ========================================================
          TOP SOCIAL ICONS (AUTHENTIC SITE: FB, LI, IG YELLOW CIRCLES)
          ======================================================== */}
      <div className="relative z-20 w-full pt-8 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          {/* Facebook circular 3D button */}
          <ShadowButton
            variant="icon"
            size="circle"
            rounded="full"
            bg="#ffd372"
            shadowColor="#2b3d73"
            borderColor="#0e0e0e"
            shadowOffset={2.5}
            href="https://www.facebook.com/manayerbamate/"
            target="_blank"
            aria-label="Facebook"
            onClick={(e) => e.stopPropagation()}
            icon={
              <img
                src="/assets/i_fb.svg"
                alt="Facebook"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            }
          />

          {/* LinkedIn circular 3D button */}
          <ShadowButton
            variant="icon"
            size="circle"
            rounded="full"
            bg="#ffd372"
            shadowColor="#2b3d73"
            borderColor="#0e0e0e"
            shadowOffset={2.5}
            href="https://www.linkedin.com/company/mana-yerba-mate/"
            target="_blank"
            aria-label="LinkedIn"
            onClick={(e) => e.stopPropagation()}
            icon={
              <img
                src="/assets/i_li.svg"
                alt="LinkedIn"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            }
          />

          {/* Instagram circular 3D button */}
          <ShadowButton
            variant="icon"
            size="circle"
            rounded="full"
            bg="#ffd372"
            shadowColor="#2b3d73"
            borderColor="#0e0e0e"
            shadowOffset={2.5}
            href="https://www.instagram.com/manayerbamate/"
            target="_blank"
            aria-label="Instagram"
            onClick={(e) => e.stopPropagation()}
            icon={
              <img
                src="/assets/i_ig.svg"
                alt="Instagram"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            }
          />
        </div>
      </div>

      {/* ========================================================
          BACKGROUND FLOATING CLOUDS (AUTHENTIC SIZING)
          ======================================================== */}
      <img
        className="nuage nuage1 absolute top-[20vh] h-[14vh] sm:h-[18vh] w-auto opacity-90 pointer-events-none z-10"
        src="/assets/nuage.svg"
        alt=""
      />
      <img
        className="nuage nuage2 absolute top-[35vh] h-[12vh] sm:h-[16vh] w-auto opacity-80 pointer-events-none z-10 scale-x-[-1]"
        src="/assets/nuage.svg"
        alt=""
      />

      {/* ========================================================
          BIG FLOATING REACTION WORDS ("BOOST" / "ark...")
          ======================================================== */}
      {currentWord && (
        <div className="absolute top-[28vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center select-none">
          <h2
            className={`text-7xl sm:text-9xl md:text-[14rem] font-black uppercase tracking-tight leading-none animate-bounce-subtle ${
              currentWord === "BOOST" ? "text-black" : "text-neutral-700"
            }`}
            style={{
              textShadow:
                currentWord === "BOOST"
                  ? "4px 4px 0px #ffd372, 8px 8px 0px #f15b40"
                  : "4px 4px 0px #d4c5a9",
            }}
          >
            {currentWord}
          </h2>
        </div>
      )}

      {/* ========================================================
          GROUND HORIZONTAL LINE (AFTER ELEMENT IN AUTHENTIC SITE)
          ======================================================== */}
      <div className="absolute bottom-[20%] left-0 w-full h-[1.5px] bg-[#0e0e0e] z-10" />

      {/* ========================================================
          LOOPING LANDSCAPE ROLLING HILLS (LOTTIE PAYSAGE)
          ======================================================== */}
      <div
        ref={paysageRef}
        className="innerPaysage absolute bottom-0 left-0 w-full pointer-events-none z-5"
      />

      {/* ========================================================
          MAIN CHARACTER (AUTHENTIC 150vh GIANT SCALING)
          ======================================================== */}
      <div className="innerJeu absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] pointer-events-none z-15 flex items-center justify-center">
        {/* Walking State */}
        <div
          ref={walkRef}
          className={`w-full h-full ${activeChar === "walk" ? "block" : "hidden"}`}
        />

        {/* Jumping State */}
        <div
          ref={jumpRef}
          className={`w-full h-full ${activeChar === "jump" ? "block" : "hidden"}`}
        />

        {/* Happy BOOST State */}
        <div
          ref={happyRef}
          className={`w-full h-full ${activeChar === "happy" ? "block" : "hidden"}`}
        />

        {/* Sad ARK State */}
        <div
          ref={sadRef}
          className={`w-full h-full ${activeChar === "sad" ? "block" : "hidden"}`}
        />
      </div>

      {/* ========================================================
          SPAWNED MOVING OBSTACLE / CANETTE (AUTHENTIC 28vh x 34vh)
          ======================================================== */}
      <div
        ref={denreeRef}
        className="denree absolute bottom-[20%] left-0 w-[24vh] sm:w-[28vh] h-[28vh] sm:h-[34vh] pointer-events-none z-15 flex items-end justify-center"
      >
        <img
          src={currentObstacle.src}
          alt="Obstacle"
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {/* ========================================================
          START BUTTON ("Press Space to jump" / "Jump key")
          ======================================================== */}
      {gameState === "idle" && (
        <div
          ref={startBtnRef}
          className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
        >
          <ShadowButton
            variant="text"
            size="lg"
            rounded="xl"
            bg="#ffd372"
            shadowColor="#0e0e0e"
            borderColor="#0e0e0e"
            textColor="#0e0e0e"
            shadowOffset={3}
            onClick={(e) => {
              e?.stopPropagation();
              startGame();
            }}
            className="tracking-wide"
            innerClassName="px-8 sm:px-10 py-3 sm:py-4"
            aria-label="Press Space to jump"
          >
            <span className="hidden sm:inline">
              {isFrench
                ? "Appuie sur Espace pour sauter"
                : "Press Space to jump"}
            </span>
            <span className="inline sm:hidden">
              {isFrench ? "Touche pour sauter" : "Touch to jump"}
            </span>
          </ShadowButton>
        </div>
      )}

      {/* ========================================================
          BOTTOM COPYRIGHT & LEGAL LINKS (MATCHING AUTHENTIC SIZING)
          ======================================================== */}
      <div className="relative z-20 w-full pb-8 px-6 sm:px-14 flex flex-col sm:flex-row items-center justify-between text-sm sm:text-base font-medium text-[#0e0e0e] pointer-events-auto">
        <p className="order-2 sm:order-1 mt-3 sm:mt-0">
          2026 © Mana Yerba Maté
        </p>

        <div className="order-1 sm:order-2 flex items-center gap-6 sm:gap-8">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:underline transition-colors"
          >
            Terms of use
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:underline transition-colors"
          >
            Refund policy
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert("Mana Yerba Maté - Montreal, Quebec");
            }}
            className="hover:underline cursor-pointer"
          >
            Credits
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
