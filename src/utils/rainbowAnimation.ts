import { useRef, useCallback } from "react";
import gsap from "gsap";

export const RAINBOW_CLASSES = [
  "c-orange",
  "c-bleu2",
  "c-rouge",
  "c-rose",
  "c-bleu",
  "c-jaune",
  "c-noir",
] as const;

const RAINBOW_SEQUENCE = [
  "c-bleu2",
  "c-rouge",
  "c-rose",
  "c-bleu",
  "c-jaune",
  "c-noir",
] as const;

const RAINBOW_DELAYS = [70, 140, 210, 280, 350, 420] as const;

export interface CascadeWaveOptions {
  fromScale?: number;
  fromY?: number;
  duration?: number;
  ease?: string;
  staggerSec?: number;
}

export function useRainbowCascade<T extends Element = HTMLElement | SVGElement>(
  containerRef: React.RefObject<Element | null>,
  options: CascadeWaveOptions = {},
) {
  const {
    fromScale = 0.8,
    fromY,
    duration = 0.6,
    ease = "elastic.out(2, 0.5)",
    staggerSec = 0.07,
  } = options;

  const timeoutsMap = useRef<Map<T, ReturnType<typeof setTimeout>[]>>(
    new Map(),
  );
  const hasAnimatedRef = useRef(false);

  const clearElementTimeouts = useCallback((el: T) => {
    const active = timeoutsMap.current.get(el);
    if (active) {
      active.forEach(clearTimeout);
      timeoutsMap.current.delete(el);
    }
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsMap.current.forEach((timers) => timers.forEach(clearTimeout));
    timeoutsMap.current.clear();
  }, []);

  const triggerRainbow = useCallback(
    (el: T) => {
      clearElementTimeouts(el);

      el.classList.remove("c-beige", ...RAINBOW_CLASSES);
      el.classList.add("c-orange");

      const timers: ReturnType<typeof setTimeout>[] = [];
      RAINBOW_SEQUENCE.forEach((cls, i) => {
        const prevCls = i === 0 ? "c-orange" : RAINBOW_SEQUENCE[i - 1];
        const timer = setTimeout(() => {
          el.classList.remove(prevCls);
          el.classList.add(cls);
        }, RAINBOW_DELAYS[i]);
        timers.push(timer);
      });

      timeoutsMap.current.set(el, timers);
    },
    [clearElementTimeouts],
  );

  const resetLettersToBeige = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const letters = container.querySelectorAll<T>(".lettre");
    letters.forEach((el) => {
      el.classList.remove(...RAINBOW_CLASSES);
      el.classList.add("c-beige");
    });
  }, [containerRef]);

  const play = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll<T>(".lettre");
    if (!letters.length) return;

    hasAnimatedRef.current = true;
    gsap.killTweensOf(letters);
    letters.forEach(clearElementTimeouts);

    const staggerMs = staggerSec * 1000;

    letters.forEach((letter, i) => {
      letter.classList.remove(...RAINBOW_CLASSES);
      letter.classList.add("c-beige");

      const initialVars: gsap.TweenVars = {
        scale: fromScale,
        transformOrigin: "center center",
      };
      const targetVars: gsap.TweenVars = {
        scale: 1,
        duration,
        delay: i * staggerSec,
        ease,
      };

      if (fromY !== undefined) {
        initialVars.y = fromY;
        targetVars.y = 0;
      }

      gsap.set(letter, initialVars);
      gsap.to(letter, targetVars);

      const timer = setTimeout(() => {
        triggerRainbow(letter);
      }, i * staggerMs);

      const activeTimers = timeoutsMap.current.get(letter) || [];
      activeTimers.push(timer);
      timeoutsMap.current.set(letter, activeTimers);
    });
  }, [
    containerRef,
    clearElementTimeouts,
    triggerRainbow,
    fromScale,
    fromY,
    duration,
    ease,
    staggerSec,
  ]);

  return {
    play,
    hasAnimatedRef,
    resetLettersToBeige,
    clearAllTimeouts,
  };
}
