export interface Flavor {
  id: 'grapefruit' | 'hibiscus' | 'tropical' | 'melon';
  name: string;
  frenchName: string;
  colorName: string;
  bg: string;
  bgLight: string;
  accent: string;
  tagline: string;
  description: string;
  caffeine: string;
  sugar: string;
  calories: string;
  rating: number;
  reviews: number;
  price: number;
  packSize: string;
  thumb: string;
  hero1: string;
  hero2: string;
  tastingNotes: string[];
  metrics: {
    sweetness: number;
    tartness: number;
    energy: number;
    fizz: number;
  };
  quote: string;
  author: string;
}

export interface Product {
  id: string;
  name: string;
  frenchName: string;
  flavorId: string;
  price: number;
  rating: number;
  reviews: number;
  thumb: string;
  badge?: string;
  desc: string;
}

export const FLAVORS: Flavor[] = [
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    frenchName: 'Pamplemousse',
    colorName: 'yellow',
    bg: '#ffd372',
    bgLight: '#fff8db',
    accent: '#d9480f',
    tagline: 'Tart, sparkling and invigorating with every sip.',
    description:
      'Crisp organic pink grapefruit paired with shade-grown South American yerba mate. Delivers a clean, sustained lift without the afternoon slump.',
    caffeine: '120 mg',
    sugar: '8 g',
    calories: '45 kcal',
    rating: 4.9,
    reviews: 412,
    price: 39.99,
    packSize: '12 x 355 ml',
    thumb: '/images/pamplemousse_thumb.jpg',
    hero1: '/images/pamp_hero_1.jpg',
    hero2: '/images/pamp_hero_2.jpg',
    tastingNotes: ['Pink Grapefruit', 'Crushed Zest', 'Earthy Herbal', 'Crisp Fizz'],
    metrics: {
      sweetness: 35,
      tartness: 85,
      energy: 90,
      fizz: 80,
    },
    quote: 'The grapefruit punch is unbeatable for early morning deep work sessions.',
    author: 'Mathieu L., Montreal',
  },
  {
    id: 'hibiscus',
    name: 'Blackberry & Hibiscus',
    frenchName: 'Mûre & Hibiscus',
    colorName: 'blue',
    bg: '#85baea',
    bgLight: '#e0effd',
    accent: '#2b3d73',
    tagline: 'Deep berry richness balanced with delicate floral botanicals.',
    description:
      'Wild Canadian blackberries steeped with tart organic hibiscus flowers. A sophisticated, vibrant berry infusion that awakens the palate.',
    caffeine: '120 mg',
    sugar: '8 g',
    calories: '45 kcal',
    rating: 4.95,
    reviews: 520,
    price: 39.99,
    packSize: '12 x 355 ml',
    thumb: '/images/mure_thumb.jpg',
    hero1: '/images/mure_hero_1.jpg',
    hero2: '/images/mure_hero_2.jpg',
    tastingNotes: ['Wild Blackberry', 'Tart Hibiscus', 'Botanical Tannins', 'Smooth Finish'],
    metrics: {
      sweetness: 50,
      tartness: 75,
      energy: 90,
      fizz: 75,
    },
    quote: 'Tastes like an artisanal natural soda, but powers my whole afternoon.',
    author: 'Chloe D., Quebec City',
  },
  {
    id: 'tropical',
    name: 'Tropical Punch',
    frenchName: 'Punch Tropical',
    colorName: 'pink',
    bg: '#f6b1cf',
    bgLight: '#fde8f1',
    accent: '#e72f63',
    tagline: 'A sunny vacation in a can — passion fruit, mango & pineapple.',
    description:
      'Lush tropical fruit juices blended with energizing yerba mate. Naturally golden, intensely refreshing, and bursting with vibrant sunshine.',
    caffeine: '120 mg',
    sugar: '8 g',
    calories: '45 kcal',
    rating: 4.88,
    reviews: 380,
    price: 39.99,
    packSize: '12 x 355 ml',
    thumb: '/images/tropical_thumb.jpg',
    hero1: '/images/trop_hero_1.jpg',
    hero2: '/images/trop_hero_2.jpg',
    tastingNotes: ['Ripe Mango', 'Passion Fruit', 'Juicy Pineapple', 'Bright Mate'],
    metrics: {
      sweetness: 65,
      tartness: 50,
      energy: 90,
      fizz: 85,
    },
    quote: 'The tropical punch is literally summer in a can. Instant mood booster.',
    author: 'Alexandre G., Toronto',
  },
  {
    id: 'melon',
    name: 'Melon & Mint',
    frenchName: 'Melon & Menthe',
    colorName: 'lime',
    bg: '#acd084',
    bgLight: '#f0f8e4',
    accent: '#15803d',
    tagline: 'Sweet honeydew nectar kissed with icy, cool garden mint.',
    description:
      'Crisp green honeydew melon combined with brisk garden mint leaves. Exceptionally refreshing, restorative, and revitalizing on hot days.',
    caffeine: '120 mg',
    sugar: '8 g',
    calories: '45 kcal',
    rating: 4.92,
    reviews: 295,
    price: 39.99,
    packSize: '12 x 355 ml',
    thumb: '/images/melon_thumb.jpg',
    hero1: '/images/melon_hero_1.jpg',
    hero2: '/images/melon_hero_2.jpg',
    tastingNotes: ['Cool Mint', 'Honeydew Melon', 'Green Tea Notes', 'Effervescent'],
    metrics: {
      sweetness: 45,
      tartness: 40,
      energy: 90,
      fizz: 90,
    },
    quote: 'Super crisp and not too sweet. The mint finish is pure genius.',
    author: 'Sophie V., Montreal',
  },
];

export const PRODUCTS: Product[] = [
  ...FLAVORS.map((f) => ({
    id: f.id,
    name: `${f.name} 12-Pack`,
    frenchName: `Caisse 12x ${f.frenchName}`,
    flavorId: f.id,
    price: f.price,
    rating: f.rating,
    reviews: f.reviews,
    thumb: f.thumb,
    badge: 'Signature',
    desc: f.tagline,
  })),
  {
    id: 'discovery-box',
    name: 'Discovery Box (Variety 12-Pack)',
    frenchName: 'Boîte Découverte (12-Pack Mixte)',
    flavorId: 'discovery',
    price: 41.99,
    rating: 4.98,
    reviews: 864,
    thumb: '/images/box_thumb.jpg',
    badge: 'Best Seller',
    desc: '3 cans of each of our 4 signature flavours: Grapefruit, Hibiscus, Tropical & Melon Mint.',
  },
];
