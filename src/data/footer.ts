import {
  CharacterAnimConfig,
  CloudConfig,
  SocialLinkItem,
} from "../types/types.ts";

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/manayerbamate/",
    icon: "/svg/i_fb.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/mana-yerba-mate/",
    icon: "/svg/i_li.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/manayerbamate/",
    icon: "/svg/i_ig.svg",
  },
];

export const FOOTER_CLOUDS: CloudConfig[] = [
  {
    className:
      "absolute top-[13vh] sm:top-[20vh] h-[13vh] sm:h-[18vh] w-auto opacity-90 pointer-events-none z-10",
    duration: 14,
  },
  {
    className:
      "absolute top-[29vh] sm:top-[35vh] h-[11vh] sm:h-[16vh] w-auto opacity-80 pointer-events-none z-10 scale-x-[-1]",
    duration: 18,
    delay: 4,
  },
];

export interface FooterGameItem {
  src: string;
  isCan: boolean;
}

export const FOOTER_GAME_ITEMS: FooterGameItem[] = [
  { src: "/svg/canette.svg", isCan: true },
  { src: "/svg/obs2.svg", isCan: false },
  { src: "/svg/obs3.svg", isCan: false },
  { src: "/svg/obs5.svg", isCan: false },
  { src: "/svg/obs6.svg", isCan: false },
  { src: "/svg/obs7.svg", isCan: false },
];

export const CHARACTER_ANIMS: CharacterAnimConfig[] = [
  {
    key: "walk",
    path: "/lottie/jeu_walk.json",
    loop: true,
    autoplay: true,
  },
  {
    key: "jump",
    path: "/lottie/jeu_jump.json",
    loop: false,
    autoplay: false,
  },
  {
    key: "happy",
    path: "/lottie/jeu_happy.json",
    loop: false,
    autoplay: false,
  },
  {
    key: "sad",
    path: "/lottie/jeu_sad.json",
    loop: false,
    autoplay: false,
  },
];
