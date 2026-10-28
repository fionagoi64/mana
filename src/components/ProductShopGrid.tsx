import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

export interface ProductShopGridProps {
  onAddToCart: (productId: string) => void;
}

interface SliderFlavor {
  id: string;
  name: string;
  frenchName: string;
  bg: string;
  baseImg: string;
  hoverImg: string;
}

const POS_CIRCLES: [number, number][][] = [
  [[80, 50], [60, 80], [40, 20]],
  [[30, 80], [80, 65], [50, 30]],
  [[50, 40], [80, 60], [30, 80]],
  [[30, 20], [65, 80], [80, 40]],
];

const SLIDER_FLAVORS: SliderFlavor[] = [
  {
    id: 'melon',
    name: 'Melon & Mint',
    frenchName: 'Melon & Menthe',
    bg: '#acd084',
    baseImg: '/images/slider/melon-01.jpg',
    hoverImg: '/images/slider/melon-02.jpg',
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    frenchName: 'Pamplemousse',
    bg: '#ffd372',
    baseImg: '/images/slider/pamp-01.jpg',
    hoverImg: '/images/slider/pamp-02.jpg',
  },
  {
    id: 'hibiscus',
    name: 'Blackberry & Hibiscus',
    frenchName: 'Mûre & Hibiscus',
    bg: '#88c1f8',
    baseImg: '/images/slider/mure-01.jpg',
    hoverImg: '/images/slider/mure-02.jpg',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    frenchName: 'Punch Tropical',
    bg: '#f6b1cf',
    baseImg: '/images/slider/trop-01.jpg',
    hoverImg: '/images/slider/trop-02.jpg',
  },
];

interface ProductCardProps {
  prod: SliderFlavor;
  index: number;
  isFrench: boolean;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ prod, index, isFrench, onAddToCart }) => {
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pos = POS_CIRCLES[index % POS_CIRCLES.length];
  const clipId = `svgMaskThumb-${prod.id}`;

  useEffect(() => {
    const circles = circlesRef.current.filter(Boolean) as SVGCircleElement[];
    if (circles.length === 0) return;

    // Set initial scale of circles to 0 centered around each circle's position
    gsap.set(circles, {
      transformOrigin: 'center center',
      scale: 0,
    });

    // Authentic Mana Yerba Maté bubble wave expansion timeline
    const tl = gsap.timeline({ paused: true });
    tl.to(circles, {
      scale: 1,
      stagger: 0.07,
      duration: 0.95,
      ease: 'power3.inOut',
    });

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    tlRef.current?.play();
  };

  const handleMouseLeave = () => {
    tlRef.current?.reverse();
  };

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="productThumb shrink-0 w-full sm:w-1/2 lg:w-1/3 aspect-[505/690] relative flex flex-col justify-between group overflow-hidden border-r border-[#0E0E0E] last:border-r-0 cursor-pointer select-none"
      style={{ backgroundColor: prod.bg }}
    >
      {/* Top Flavor Title */}
      <div className="relative z-10 pt-8 sm:pt-10 px-4 text-center">
        <span className="sousTitre block font-light text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#0E0E0E]">
          {isFrench ? prod.frenchName : prod.name}
        </span>
      </div>

      {/* Realistic 3D Can Render & Expanding SVG Bubble Mask */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Base Image (Solid colored background + authentic can) */}
        <img
          src={prod.baseImg}
          alt={prod.name}
          className="base absolute inset-0 w-full h-full object-cover"
        />

        {/* SVG ClipPath with 3 expanding bubble circles (Matching live site svgMaskThumb) */}
        <svg
          className="svgMaskThumb absolute inset-0 w-full h-full pointer-events-none"
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

        {/* Hover Image (Rich illustrated background + can) revealed through the bubble clip-path */}
        <img
          src={prod.hoverImg}
          alt={`${prod.name} hover`}
          className="hover absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        />
      </div>

      {/* Bottom Actions (Discover Pill & Circle Plus Button) */}
      <div className="relative z-10 flex items-center justify-between p-6 sm:p-8 mt-auto pointer-events-auto">
        {/* Discover Pill */}
        <span className="px-6 py-2.5 rounded-full bg-white text-[#0E0E0E] text-xs sm:text-sm uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform translate-y-3 group-hover:translate-y-0">
          {isFrench ? 'Découvrir' : 'Discover this product'}
        </span>

        {/* Add to Cart Plus Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(prod.id);
          }}
          className="w-12 h-12 rounded-full bg-white text-[#0E0E0E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 active:scale-95 ml-auto transform translate-y-3 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Add ${prod.name} to cart`}
        >
          <svg
            fill="none"
            height="20"
            viewBox="0 0 27 27"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#0E0E0E" strokeLinecap="round" strokeWidth="2">
              <path d="M0.625 13.6691H26.375" />
              <path d="M13.6699 26.375V0.625" />
            </g>
          </svg>
        </button>
      </div>
    </article>
  );
};

export const ProductShopGrid: React.FC<ProductShopGridProps> = ({ onAddToCart }) => {
  const { i18n } = useTranslation();
  const isFrench = Boolean(i18n.language && i18n.language.startsWith('fr'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setVisibleCount(3);
      } else if (w >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, SLIDER_FLAVORS.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Translation percentage based on visible columns
  const translatePercent = (currentIndex * 100) / visibleCount;

  return (
    <section id="shop-products" className="c-productsSlider w-full bg-[#FEF7E6] select-none">
      {/* 1. Authentic Header Control Bar (matching Screenshot 4 & live site .infosProducts) */}
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 pt-4 pb-12 flex flex-col md:flex-row items-start md:items-end justify-between relative gap-6">
        {/* Left Side: 2-line uppercase description & See All products black pill */}
        <div className="flex flex-col items-start gap-5 max-w-[480px]">
          <p className="text-sm sm:text-base font-normal uppercase tracking-wider text-[#0e0e0e] leading-snug">
            {isFrench
              ? 'Fraîche, fruitée, pétillante, de belles couleurs, de quoi éveiller tes papilles.'
              : 'Fresh, fruity, sparkling, beautiful colours, awaken your taste buds.'}
          </p>
          <a
            href="#shop-products"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[#0E0E0E] text-[#FEF7E6] font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all hover:scale-102 active:scale-98"
          >
            {isFrench ? 'Voir tous nos produits' : 'See all our products'}
          </a>
        </div>

        {/* Center: Recommended Products Title */}
        <h2 className="md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-12 text-sm sm:text-base md:text-lg font-light uppercase tracking-wider text-[#0E0E0E] text-center">
          {isFrench ? 'Produits recommandés' : 'Recommended products'}
        </h2>
      </div>

      {/* 2. Full-bleed Vertical Colored Panels Slider (matching Screenshot 5) */}
      <div className="relative w-full overflow-hidden border-t border-b border-[#0E0E0E]">
        {/* Floating Circular Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center justify-between px-4 sm:px-8 pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#0E0E0E]/15 shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous products"
          >
            <img src="/assets/i_arrow.svg" alt="" className="w-4 h-auto" />
          </button>
          <button
            onClick={handleNext}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#0E0E0E]/15 shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next products"
          >
            <img src="/assets/i_arrow.svg" alt="" className="w-4 h-auto rotate-180" />
          </button>
        </div>

        {/* Panels Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${translatePercent}%)` }}
        >
          {SLIDER_FLAVORS.map((prod, index) => (
            <ProductCard
              key={prod.id}
              prod={prod}
              index={index}
              isFrench={isFrench}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShopGrid;
