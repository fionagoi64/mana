import { FeatureCardConfig } from "../types/types.ts";

export const FEATURE_CARDS: FeatureCardConfig[] = [
  { key: "crash", lottiePath: "/lottie/carte_crash.json", angle: 25 },
  { key: "caffeine", lottiePath: "/lottie/carte_caf.json", angle: 50 },
  {
    key: "antioxidant",
    lottiePath: "/lottie/carte_antiox.json",
    angle: 75,
  },
  { key: "vegan", lottiePath: "/lottie/carte_vege.json", angle: 100 },
];

export const FEATURE_FLOATING_BUBBLES: string[] = [
  "left-[6%] top-[16%] w-[2.8vw] min-w-[22px] max-w-[42px]",
  "left-[46%] top-[6%] w-[1.9vw] min-w-[16px] max-w-[28px]",
  "left-[86%] top-[22%] w-[3.2vw] min-w-[26px] max-w-[46px]",
  "left-[22%] top-[78%] w-[2.2vw] min-w-[18px] max-w-[32px]",
];
