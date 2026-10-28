import { Flavor, FlavorId } from "../types/types.ts";

export type { Flavor, FlavorId };

export const FLAVOR_ORDER: FlavorId[] = [
  "grapefruit",
  "hibiscus",
  "tropical",
  "melon",
];

export const FLAVORS: Flavor[] = [
  {
    id: "grapefruit",
    bg: "#ffd372",
    sliderBg: "#ffd372",
    btnBg: "#f15b40",
    btnShadow: "#2b3d73",
    texturePath: "/models/MANA_canette_pamp_color_for_mat_v2.png",
    sliderBaseImg: "/images/slider/pamp-01.jpg",
    sliderHoverImg: "/images/slider/pamp-02.jpg",
    heroArt: {
      left: [
        {
          type: "lottie",
          src: "/lottie/lottie_pamp_1.json",
          className:
            "absolute top-[48%] left-[-10vw] -translate-y-1/2 w-[50vw] max-w-[780px]",
        },
        {
          type: "image",
          src: "/svg/home_bulles.svg",
          className:
            "absolute top-[15%] left-[25vw] w-[5vw] max-w-[80px] opacity-90 animate-float-slow",
        },
        {
          type: "lottie",
          src: "/lottie/lottie_pamp_2.json",
          className:
            "absolute bottom-[12vh] left-[18vw] w-[30vw] max-w-[500px] rotate-20",
        },
      ],
      right: [
        {
          type: "image",
          src: "/svg/woman.svg",
          className:
            "absolute top-[-22vh] right-[18vw] w-[30vw] max-w-[480px] object-contain animate-float-slow",
        },
        {
          type: "lottie",
          src: "/lottie/lottie_pamp_4.json",
          className:
            "absolute bottom-[-20vh] right-[-8vw] w-[40vw] max-w-[750px]",
        },
      ],
    },
  },
  {
    id: "hibiscus",
    bg: "#85baea",
    sliderBg: "#88c1f8",
    btnBg: "#2b3d73",
    btnShadow: "#0e0e0e",
    texturePath: "/models/MANA_canette_hibiscus_color_for_mat.png",
    sliderBaseImg: "/images/slider/mure-01.jpg",
    sliderHoverImg: "/images/slider/mure-02.jpg",
    heroArt: {
      left: [
        {
          type: "lottie",
          src: "/lottie/lottie_hibi_1.json",
          className:
            "absolute top-[6vh] left-[3vw] w-[30vw] max-w-[720px]",
        },
        {
          type: "image",
          src: "/svg/home_star.svg",
          className:
            "absolute top-[12vh] left-[35vw] w-[3vw] max-w-[80px]",
        },
        {
          type: "lottie",
          src: "/lottie/lottie_hibi_2.json",
          className:
            "absolute bottom-[6vh] left-[7vw] w-[18vw] max-w-[360px]",
        },
        {
          type: "image",
          src: "/svg/home_star.svg",
          className:
            "absolute top-[60vh] left-[5vw] w-[3vw] max-w-[45px]",
        },
      ],
      right: [
        {
          type: "lottie",
          src: "/lottie/lottie_hibi_3.json",
          className:
            "absolute top-[2vh] right-[-2vw] w-[50vw] max-w-[800px]",
        },
        {
          type: "image",
          src: "/svg/home_planet.svg",
          className:
            "absolute bottom-[-4vh] right-[2vw] w-[22vw] max-w-[340px]",
        },
      ],
    },
  },
  {
    id: "tropical",
    bg: "#f6b1cf",
    sliderBg: "#f6b1cf",
    btnBg: "#e72f63",
    btnShadow: "#2b3d73",
    texturePath: "/models/MANA_canette_tropical_color_for_mat.png",
    sliderBaseImg: "/images/slider/trop-01.jpg",
    sliderHoverImg: "/images/slider/trop-02.jpg",
    heroArt: {
      left: [
        {
          type: "lottie",
          src: "/lottie/lottie_trop_1.json",
          className:
            "absolute bottom-[-6vh] left-[0vw] w-[40vw] max-w-[720px]",
        },
        {
          type: "image",
          src: "/svg/home_eau.svg",
          className:
            "absolute top-[-38vh] left-[6vw] w-[26vw] max-w-[480px]",
        },
        {
          type: "image",
          src: "/svg/mangue.svg",
          className:
            "absolute top-[-4vh] left-[36vw] w-[11vw] max-w-[280px]",
        },
      ],
      right: [
        {
          type: "lottie",
          src: "/lottie/lottie_trop_2.json",
          className:
            "absolute top-[6vh] right-[-10vw] w-[50vw] max-w-[860px]",
        },
        {
          type: "lottie",
          src: "/lottie/lottie_trop_4.json",
          className:
            "absolute top-[44%] right-[20vw] w-[20vw] max-w-[460px]",
        },
      ],
    },
  },
  {
    id: "melon",
    bg: "#acd084",
    sliderBg: "#acd084",
    btnBg: "#195e1c",
    btnShadow: "#0e0e0e",
    texturePath: "/models/MANA_canette_melon_mint_mat.png",
    sliderBaseImg: "/images/slider/melon-01.jpg",
    sliderHoverImg: "/images/slider/melon-02.jpg",
    heroArt: {
      left: [
        {
          type: "lottie",
          src: "/lottie/lottie_melo_1.json",
          className:
            "absolute top-[40%] left-[5vw] -translate-y-1/2 w-[40vw] max-w-[700px] z-10",
        },
        {
          type: "image",
          src: "/svg/home_fleur.svg",
          className:
            "absolute bottom-[-3%] left-[18vw] w-[30vw] max-w-[800px] animate-float-slow",
        },
      ],
      right: [
        {
          type: "lottie",
          src: "/lottie/lottie_melo_2.json",
          className:
            "absolute top-[6vh] right-[4vw] w-[26vw] max-w-[700px]",
        },
        {
          type: "lottie",
          src: "/lottie/lottie_melo_3.json",
          className:
            "absolute bottom-[-2vh] right-[2vw] w-[35vw] max-w-[800px] z-10",
        },
      ],
    },
  },
];

export const FLAVOR_MAP: Record<FlavorId, Flavor> = FLAVORS.reduce(
  (acc, flavor) => {
    acc[flavor.id] = flavor;
    return acc;
  },
  {} as Record<FlavorId, Flavor>,
);

export const SLIDER_FLAVOR_ORDER: FlavorId[] = [
  "melon",
  "grapefruit",
  "hibiscus",
  "tropical",
];

export const SLIDER_FLAVORS: Flavor[] = SLIDER_FLAVOR_ORDER.map(
  (id) => FLAVOR_MAP[id],
);

export const HERO_WHEEL_STEPS = Array.from({ length: 8 }, (_, step) => ({
  step,
  flavorId: FLAVOR_ORDER[step % FLAVOR_ORDER.length],
  angle: step * 45,
}));

export const SLIDER_MASK_CIRCLES: [number, number][][] = [
  [
    [80, 50],
    [60, 80],
    [40, 20],
  ],
  [
    [30, 80],
    [80, 65],
    [50, 30],
  ],
  [
    [50, 40],
    [80, 60],
    [30, 80],
  ],
  [
    [30, 20],
    [65, 80],
    [80, 40],
  ],
];

export const FLAVOR_STAR_LAYERS: string[][] = [
  [
    "left-[22.5%] top-[58%] w-[2.8vw] min-w-[22px] max-w-[42px]",
    "left-[65.5%] top-[16%] w-[2.4vw] min-w-[20px] max-w-[36px]",
    "left-[75%] top-[19%] w-[2.5vw] min-w-[20px] max-w-[38px]",
    "left-[94%] top-[38%] w-[2.6vw] min-w-[22px] max-w-[40px]",
  ],
  [
    "left-[5%] top-[24%] w-[2.3vw] min-w-[18px] max-w-[34px]",
    "left-[45.2%] top-[62%] w-[1.8vw] min-w-[16px] max-w-[28px]",
    "left-[47.8%] top-[57%] w-[2.2vw] min-w-[18px] max-w-[32px]",
    "left-[78%] top-[60%] w-[2.6vw] min-w-[22px] max-w-[40px]",
  ],
];
