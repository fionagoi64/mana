import { InstaCardConfig } from "../types/types.ts";

export const INSTA_CARDS: InstaCardConfig[] = [
  {
    src: "/images/insta_1.jpg",
    alt: "Mana lifestyle",
    className:
      "absolute -top-[50px] sm:-top-[90px] md:-top-[130px] left-[3%] sm:left-[5%] md:left-[7%] w-[210px] sm:w-[280px] md:w-[340px] lg:w-[380px] aspect-square object-cover rounded-[22px] sm:rounded-[28px] shadow-2xl z-20 pointer-events-none",
    from: { yPercent: 30, xPercent: 0, rotation: 10 },
    to: { yPercent: -40, xPercent: 18, rotation: 0 },
  },
  {
    src: "/images/insta_2.jpg",
    alt: "Mana vibe",
    className:
      "absolute -top-[80px] sm:-top-[130px] md:-top-[170px] right-[4%] sm:right-[6%] md:right-[8%] w-[230px] sm:w-[300px] md:w-[370px] lg:w-[420px] aspect-square object-cover rounded-[22px] sm:rounded-[28px] shadow-2xl z-20 pointer-events-none",
    from: { yPercent: 20, xPercent: 0, rotation: -15 },
    to: { yPercent: -30, xPercent: -10, rotation: -10 },
  },
  {
    src: "/images/insta_3.jpg",
    alt: "Mana energy",
    className:
      "absolute -bottom-[100px] sm:-bottom-[150px] md:-bottom-[200px] left-[6%] sm:left-[9%] md:left-[12%] w-[210px] sm:w-[280px] md:w-[340px] lg:w-[380px] aspect-square object-cover rounded-[22px] sm:rounded-[28px] shadow-2xl z-20 pointer-events-none",
    from: { yPercent: 40, xPercent: 15, rotation: 0 },
    to: { yPercent: -40, xPercent: -20, rotation: -10 },
  },
  {
    src: "/images/insta_4.jpg",
    alt: "Mana moment",
    className:
      "absolute -bottom-[120px] sm:-bottom-[170px] md:-bottom-[220px] right-[4%] sm:right-[6%] md:right-[8%] w-[200px] sm:w-[270px] md:w-[330px] lg:w-[370px] aspect-square object-cover rounded-[22px] sm:rounded-[28px] shadow-2xl z-20 pointer-events-none",
    from: { yPercent: 50, xPercent: -15, rotation: 15 },
    to: { yPercent: -30, xPercent: 10, rotation: 5 },
  },
];
