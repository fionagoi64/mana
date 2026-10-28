import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { FEATURE_FLOATING_BUBBLES } from "../../../data/features.ts";
import {
  CurvedSvgHeading,
  CurvedSvgHeadingRef,
} from "../../shared/CurvedSvgHeading.tsx";

export interface FeatureOnlyBestProps {
  allBullesRef?: React.RefObject<HTMLImageElement | null>;
  bubblesLeftRef?: React.RefObject<HTMLDivElement | null>;
  showFloatingBubbles?: boolean;
}

export const FeatureOnlyBest = forwardRef<
  CurvedSvgHeadingRef,
  FeatureOnlyBestProps
>(({ allBullesRef, bubblesLeftRef, showFloatingBubbles = false }, ref) => {
  const { t } = useTranslation();

  const onlyBestPaths = t("features.onlyBestPaths", {
    returnObjects: true,
  }) as string[];
  const onlyBestText = t("features.onlyBestText");

  return (
    <div className="w-full md:w-[95vw] flex items-center justify-center relative overflow-visible">
      {showFloatingBubbles && (
        <div
          ref={bubblesLeftRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {FEATURE_FLOATING_BUBBLES.map((posClass, idx) => (
            <img
              key={idx}
              src="/svg/bulle.svg"
              alt=""
              className={`absolute ${posClass}`}
            />
          ))}
        </div>
      )}

      <CurvedSvgHeading
        ref={ref}
        paths={onlyBestPaths}
        headingText={onlyBestText}
        viewBox="0 0 1397 256"
        width={1397}
        height={256}
        as="h3"
        svgClassName="w-full md:w-[95vw]"
        className="w-full max-md:max-w-[600px] md:w-[95vw] z-5 relative"
      />

      <img
        ref={allBullesRef}
        src="/svg/all_bulles.svg"
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
});

export default FeatureOnlyBest;
