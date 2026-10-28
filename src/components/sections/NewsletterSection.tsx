import React from "react";
import { useTranslation } from "react-i18next";
import { ArcDivider } from "../shared/ArcDivider.tsx";
import { CurvedSvgHeading } from "../shared/CurvedSvgHeading.tsx";
import { LottieBox } from "../shared/LottieBox.tsx";
import { ShadowButton } from "../shared/ShadowButton.tsx";

export const NewsletterSection: React.FC = () => {
  const { t } = useTranslation();

  const paths = t("newsletter.curvePaths", {
    returnObjects: true,
  }) as string[];
  const headingText = t("newsletter.heading");
  const flowerLines = t("newsletter.flowerLines", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="w-full bg-[#FFD372] pb-1 -mb-1 relative overflow-hidden select-none z-10">
      <div className="relative w-full bg-[#FEF7E6] pt-12 sm:pt-16 md:pt-24 text-center flex flex-col items-center">
        <CurvedSvgHeading
          paths={paths}
          headingText={headingText}
          viewBox="0 0 1435 857"
          width={1435}
          height={857}
          as="h2"
          triggerOnScroll
          svgClassName="w-full"
        />

        <div className="hidden md:flex absolute top-[30vw] left-[69%] w-[14vw] items-center justify-center select-none pointer-events-none z-20">
          <img
            src="/images/fleur.png"
            alt=""
            className="w-full h-auto block drop-shadow-sm"
          />
          <p className="absolute text-[1.8vw] font-bold uppercase tracking-wider text-center leading-[1.08] rotate-[17deg] translate-x-[-7%] translate-y-[5%]">
            {flowerLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < flowerLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>

        <p
          className="mt-8 sm:mt-14 font-normal text-center max-w-[700px] min-w-[300px] z-10 relative leading-[1.2]"
          style={{ fontSize: "clamp(20px, 2.3vw, 42px)" }}
        >
          {t("newsletter.subtitle")}
        </p>

        <div className="mt-8 sm:mt-12 mb-32 md:mb-56 flex justify-center z-10 relative">
          <ShadowButton
            href="#subscribe"
            variant="text"
            size="lg"
            rounded="full"
            bg="#f15b40"
            shadowColor="#2b3d73"
            textColor="#ffffff"
            borderColor="#2b3d73"
            shadowOffset={3}
            aria-label={t("newsletter.subscribeAria")}
          >
            <span>{t("newsletter.subscribe")}</span>
          </ShadowButton>
        </div>

        <LottieBox
          path="/lottie/lottie_hibi_3.json"
          className="absolute bottom-0 left-[-8vw] max-md:left-[-24vw] w-[38vw] max-md:w-[78vw] max-md:max-w-[440px] pointer-events-none z-10 rotate-[15deg] [&>svg]:!w-full [&>svg]:!h-auto"
        />

        <small className="block text-center text-sm sm:text-base md:text-lg opacity-80 mb-12 sm:mb-20 z-10 relative">
          {t("newsletter.footnote")}
        </small>
      </div>

      <ArcDivider
        variant="bottom"
        color="#FEF7E6"
        className="h-auto -mt-0.5"
      />
    </section>
  );
};

export default NewsletterSection;
