import React, { ReactNode } from "react";

export type FlavorId = "grapefruit" | "hibiscus" | "tropical" | "melon";

export interface HeroArtItem {
  type: "lottie" | "image";
  src: string;
  className: string;
}

export interface Flavor {
  id: FlavorId;
  bg: string;
  sliderBg: string;
  btnBg: string;
  btnShadow: string;
  texturePath: string;
  sliderBaseImg: string;
  sliderHoverImg: string;
  heroArt: {
    left: HeroArtItem[];
    right: HeroArtItem[];
  };
}

export interface FeatureCardConfig {
  key: "crash" | "caffeine" | "antioxidant" | "vegan";
  lottiePath: string;
  angle: number;
}

export interface InstaCardConfig {
  src: string;
  alt: string;
  className: string;
  from: { yPercent: number; xPercent: number; rotation: number };
  to: { yPercent: number; xPercent: number; rotation: number };
}

export interface SocialLinkItem {
  name: string;
  href: string;
  icon: string;
}

export interface CloudConfig {
  className: string;
  duration: number;
  delay?: number;
}

export type CharacterStateKey = "walk" | "jump" | "sad" | "happy";

export interface CharacterAnimConfig {
  key: CharacterStateKey;
  path: string;
  loop: boolean;
  autoplay: boolean;
}

export interface RainbowPlayableRef {
  play: () => void;
}

export type ShadowButtonVariant = "text" | "icon" | "both";
export type ShadowButtonSize = "circle" | "lg";
export type ShadowButtonRounded = "full" | "xl";

export interface ShadowButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  bg?: string;
  shadowColor?: string;
  textColor?: string;
  borderColor?: string;
  shadowOffset?: number;
  rounded?: ShadowButtonRounded;
  size?: ShadowButtonSize;
  variant?: ShadowButtonVariant;
  className?: string;
  innerClassName?: string;
}
