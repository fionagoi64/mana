import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web';
import CurvedNewsletterHeading from './CurvedNewsletterHeading.tsx';

export const NewsletterSection: React.FC = () => {
  const { i18n } = useTranslation();
  const isFrench = Boolean(i18n.language && i18n.language.startsWith('fr'));
  const fuseeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fuseeRef.current) return;
    const anim = lottie.loadAnimation({
      container: fuseeRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/lottie_hibi_3.json',
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <section className="c-newsletterSubscribe negativ w-full bg-[#FEF7E6] pt-12 sm:pt-16 md:pt-20 pb-0 relative overflow-hidden select-none z-10">
      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Authentic Mana Curved Vector Letter Heading (WOULD YOU DRINK IT EVERY DAY ?) */}
        <CurvedNewsletterHeading isFrench={isFrench} />

        {/* Authentic Tilted Flower Graphic ("WE HAVE WHAT YOU NEED") */}
        <div className="hidden md:flex absolute top-[28vw] lg:top-[26vw] right-[6vw] lg:right-[9vw] w-[18vw] max-w-[210px] items-center justify-center select-none pointer-events-none z-20">
          <img
            src="/assets/fleur.png"
            alt=""
            className="w-full h-auto block drop-shadow-sm"
          />
          <p className="absolute text-[clamp(11px,1.35vw,18px)] font-bold uppercase tracking-wider text-[#0E0E0E] text-center leading-[1.1] rotate-[17deg] translate-x-[-7%] translate-y-[5%]">
            {isFrench ? (
              <>
                On a<br />ce qu'il<br />te faut
              </>
            ) : (
              <>
                We have<br />what<br />you need
              </>
            )}
          </p>
        </div>

        {/* Subtitle (.inscrisToi) */}
        <p className="inscrisToi mt-3 sm:mt-5 text-lg sm:text-2xl font-normal text-[#0E0E0E] text-center max-w-[650px] z-10 relative">
          {isFrench
            ? 'Inscris-toi aux livraisons automatiques* et économise 10%.'
            : 'Sign up for automatic delivery* and save 10%.'}
        </p>

        {/* Authentic 3D Shadow Subscribe Button (.btnOmbre) */}
        <div className="mt-8 sm:mt-10 mb-20 md:mb-28 flex justify-center z-10 relative">
          <a
            href="#subscribe"
            className="btn btnOmbre relative group cursor-pointer select-none transition-transform active:scale-95 inline-block"
          >
            {/* 3D Navy Shadow Base */}
            <div className="absolute inset-0 rounded-full translate-y-[5px] bg-[#2b3d73] transition-transform group-hover:translate-y-[2px]" />
            {/* Top Coral Button */}
            <div className="relative px-12 sm:px-16 py-3.5 sm:py-4 rounded-full font-bold text-white text-base sm:text-lg tracking-wide flex items-center justify-center bg-[#f15b40] border border-[#2b3d73] transition-transform group-hover:translate-y-[2px]">
              <span>{isFrench ? "S'abonner" : 'Subscribe'}</span>
            </div>
          </a>
        </div>

        {/* Space Rocket Lottie (.lottieFusee) on Bottom Left */}
        <div
          ref={fuseeRef}
          className="absolute bottom-[-1vw] lg:bottom-[2vw] left-[-8vw] lg:left-[-3vw] w-[46vw] sm:w-[38vw] lg:w-[30vw] max-w-[460px] pointer-events-none z-10 rotate-[14deg]"
        />

        {/* Asterisk Footnote (.details) */}
        <small className="details block text-center text-xs sm:text-sm text-[#0E0E0E]/70 font-sans italic mb-8 sm:mb-12 z-10 relative">
          {isFrench
            ? "* On ne livre pas encore dans l'espace, mais qui sait..."
            : "* We don't deliver in space yet, but who knows..."}
        </small>
      </div>

      {/* Authentic Bottom Rounded Divider SVG (.arrondi) bridging into Instagram yellow section */}
      <svg
        className="arrondi w-full h-auto block pointer-events-none bg-[#FFD372]"
        viewBox="0 0 1517 93"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1516.89 0.182373C988.391 121.182 539.391 124.682 0.390633 0.18224L1516.89 0.182373Z"
          fill="#FEF7E6"
        />
      </svg>
    </section>
  );
};

export default NewsletterSection;
