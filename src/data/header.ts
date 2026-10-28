export const NAV_KEYS = ["shop", "learn", "subscription"] as const;

export interface HeaderIconAction {
  id: string;
  ariaKey: string;
  iconSrc: string;
  className?: string;
  iconClassName?: string;
}

export const HEADER_ICON_ACTIONS: HeaderIconAction[] = [
  {
    id: "account",
    ariaKey: "header.accountAria",
    iconSrc: "/svg/i_account.svg",
  },
  {
    id: "cart",
    ariaKey: "header.cartAria",
    iconSrc: "/svg/i_cart.svg",
  },
  {
    id: "menu",
    ariaKey: "header.menuAria",
    iconSrc: "/svg/i_menu.svg",
    className: "flex md:hidden",
    iconClassName: "w-6 h-auto pointer-events-none",
  },
];
