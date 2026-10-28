import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ImageDuoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const tween = gsap.to(el, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="imgDuo w-full h-[68.5vw] md:h-screen border-t border-b border-[#0E0E0E] relative z-20 overflow-hidden bg-[#FEF7E6] select-none"
    >
      {/* 1px Center Vertical Line dividing the two photos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#0E0E0E] z-10 pointer-events-none" />

      {/* Parallax Image Duo */}
      <div
        ref={parallaxRef}
        className="parallax absolute top-0 left-0 w-full h-[calc(100%+120px)] flex -translate-y-[100px] pointer-events-none"
      >
        <img
          src="/images/lifestyle_left.jpg"
          alt="Mana yerba mate moment"
          className="w-1/2 h-full object-cover"
        />
        <img
          src="/images/lifestyle_right.jpg"
          alt="Mana yerba mate lifestyle"
          className="w-1/2 h-full object-cover"
        />
      </div>
    </section>
  );
};

export default ImageDuoSection;
