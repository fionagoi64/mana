import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import {
  Flavor,
  SLIDER_FLAVORS,
  SLIDER_MASK_CIRCLES,
} from "../../data/flavors.ts";
import { ArrowButton } from "../shared/ArrowButton.tsx";

export interface ProductShopGridProps {
  onAddToCart: (productId: string) => void;
}

interface ProductCardProps {
  prod: Flavor;
  index: number;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  prod,
  index,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pos = SLIDER_MASK_CIRCLES[index % SLIDER_MASK_CIRCLES.length];
  const clipId = `svgMaskThumb-${prod.id}`;
  const name = t(`flavors.${prod.id}.sliderName`);

  useEffect(() => {
    const circles = circlesRef.current.filter(Boolean) as SVGCircleElement[];
    if (!circles.length) return;

    gsap.set(circles, {
      transformOrigin: "center center",
      scale: 0,
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(circles, {
      scale: 1,
      stagger: 0.07,
      duration: 0.95,
      ease: "power3.inOut",
    });

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <article
      onMouseEnter={() => tlRef.current?.play()}
      onMouseLeave={() => tlRef.current?.reverse()}
      className="shrink-0 w-1/2 md:w-1/3 aspect-[505/690] relative flex flex-col justify-between group overflow-hidden border-r border-[#0E0E0E] last:border-r-0 cursor-pointer select-none"
      style={{ backgroundColor: prod.sliderBg }}
    >
      <div className="relative z-10 pt-6 sm:pt-8 md:pt-10 px-2 sm:px-4 text-center">
        <span
          className="block font-light uppercase tracking-tight"
          style={{
            fontSize: "clamp(18px, 2.77vw, 53px)",
            lineHeight: 1,
            padding: "0.64em clamp(10px, 2.7vw, 40px) 0.2em",
          }}
        >
          {name}
        </span>
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src={prod.sliderBaseImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId}>
              {pos.map(([cx, cy], i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    circlesRef.current[i] = el;
                  }}
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r="65%"
                />
              ))}
            </clipPath>
          </defs>
        </svg>

        <img
          src={prod.sliderHoverImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8 mt-auto pointer-events-auto">
        <span
          className="hidden lg:inline-flex items-center justify-center rounded-full bg-white uppercase tracking-wider font-normal opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform translate-y-6 group-hover:translate-y-0 select-none"
          style={{
            fontSize: "clamp(15px, 1.31vw, 25px)",
            height: "clamp(55px, 4.96vw, 95px)",
            padding: "0 clamp(24px, 2.6vw, 50px)",
          }}
        >
          {t("shop.discover")}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(prod.id);
          }}
          className="hidden lg:flex items-center justify-center aspect-square rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 shadow-md hover:scale-105 active:scale-95 ml-auto transform translate-y-6 group-hover:translate-y-0 cursor-pointer shrink-0"
          style={{
            width: "clamp(55px, 4.96vw, 95px)",
            height: "clamp(55px, 4.96vw, 95px)",
            minWidth: "55px",
            minHeight: "55px",
            maxWidth: "95px",
            maxHeight: "95px",
          }}
          aria-label={t("shop.addToCart", { name })}
        >
          <img
            src="/svg/i_plus.svg"
            alt=""
            className="w-[clamp(20px,1.8vw,32px)] h-[clamp(20px,1.8vw,32px)] pointer-events-none"
          />
        </button>
      </div>
    </article>
  );
};

export const ProductShopGrid: React.FC<ProductShopGridProps> = ({
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const lang = t("common.lang");
  const [flavorLeft, setFlavorLeft] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateFlavorLeft = () => {
      const motEl = (document.querySelector("#flavors-heading-section .mot") ||
        document.querySelector(".grosTitre .mot")) as HTMLElement | null;

      if (motEl) {
        const rect = motEl.getBoundingClientRect();
        if (rect.left > 0) {
          setFlavorLeft(rect.left);
        }
      }
    };

    updateFlavorLeft();
    window.addEventListener("resize", updateFlavorLeft);

    let ro: ResizeObserver | null = null;
    const wordSection = document.querySelector("#flavors-heading-section");
    if (wordSection && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateFlavorLeft);
      ro.observe(wordSection);
    }

    if (document.fonts) {
      document.fonts.ready.then(updateFlavorLeft);
    }

    const timers = [50, 250, 600].map((ms) => setTimeout(updateFlavorLeft, ms));

    return () => {
      window.removeEventListener("resize", updateFlavorLeft);
      ro?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [lang]);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= 1024 ? 3 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const touchStartX = useRef<number | null>(null);
  const maxIndex = Math.max(0, SLIDER_FLAVORS.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) handlePrev();
    else if (diff < -45) handleNext();
    touchStartX.current = null;
  };

  const translatePercent = (currentIndex * 100) / visibleCount;
  const introCopy = t("shop.intro");
  const seeAllLabel = t("shop.seeAll");
  const recommendedTitle = t("shop.recommended");
  const prevAria = t("shop.prevProducts");
  const nextAria = t("shop.nextProducts");

  return (
    <section
      id="shop-products"
      className="w-full bg-[#FEF7E6] select-none"
    >
      <div
        className="w-full pt-1 pb-6 sm:pb-12 flex flex-col justify-between relative px-5 sm:px-8 md:px-[2.7vw]"
        style={{
          paddingLeft: flavorLeft !== null ? `${flavorLeft}px` : undefined,
          paddingRight: flavorLeft !== null ? `${flavorLeft}px` : undefined,
        }}
      >
        <div className="hidden md:flex items-end justify-between w-full relative">
          <div className="flex flex-col items-start gap-5 max-w-[min(640px,36vw)]">
            <p
              className="font-normal uppercase tracking-wider leading-[1.2]"
              style={{ fontSize: "clamp(15px, 1.98vw, 38px)" }}
            >
              {introCopy}
            </p>
            <a
              href="#shop-products"
              className="inline-flex items-center justify-center rounded-full bg-[#0E0E0E] text-[#FEF7E6] tracking-wider hover:bg-neutral-800 transition-all hover:scale-102 active:scale-98 shrink-0 whitespace-nowrap"
              style={{
                fontSize: "clamp(15px, 1.31vw, 25px)",
                height: "clamp(48px, 4vw, 75px)",
                padding: "0 clamp(24px, 2vw, 42px)",
              }}
            >
              {seeAllLabel}
            </a>
          </div>

          <h2
            className="absolute left-1/2 -translate-x-1/2 bottom-0 tracking-wider text-center whitespace-nowrap"
            style={{ fontSize: "clamp(18px, 2.6vw, 38px)" }}
          >
            {recommendedTitle}
          </h2>
        </div>

        <div className="flex md:hidden flex-col w-full">
          <p
            className="font-normal uppercase tracking-wider leading-[1.2] max-w-[340px]"
            style={{ fontSize: "clamp(15px, 1.98vw, 38px)" }}
          >
            {introCopy}
          </p>

          <div className="w-full flex items-center justify-center relative mt-10 mb-6">
            <div className="relative inline-flex items-center justify-center">
              <h2
                className="font-light tracking-wide text-center"
                style={{ fontSize: "clamp(18px, 2.6vw, 38px)" }}
              >
                {recommendedTitle}
              </h2>
              <img
                src="/svg/etoile.svg"
                alt=""
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 opacity-75 pointer-events-none"
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ArrowButton
                direction="left"
                onClick={handlePrev}
                ariaLabel={prevAria}
              />
              <ArrowButton
                direction="right"
                onClick={handleNext}
                ariaLabel={nextAria}
              />
            </div>

            <a
              href="#shop-products"
              className="inline-flex items-center justify-center rounded-full bg-[#0E0E0E] text-[#FEF7E6] font-normal tracking-wide hover:bg-neutral-800 transition-all active:scale-98 shrink-0 whitespace-nowrap"
              style={{
                fontSize: "clamp(13px, 3.4vw, 17px)",
                height: "clamp(46px, 11vw, 55px)",
                padding: "0 clamp(16px, 4vw, 24px)",
              }}
            >
              {seeAllLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden border-t border-b border-[#0E0E0E]">
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 w-full items-center justify-between px-4 sm:px-8 pointer-events-none z-20">
          <ArrowButton
            direction="left"
            onClick={handlePrev}
            ariaLabel={prevAria}
            className="pointer-events-auto"
          />
          <ArrowButton
            direction="right"
            onClick={handleNext}
            ariaLabel={nextAria}
            className="pointer-events-auto"
          />
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${translatePercent}%)` }}
        >
          {SLIDER_FLAVORS.map((prod, index) => (
            <ProductCard
              key={prod.id}
              prod={prod}
              index={index}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShopGrid;
