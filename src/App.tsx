import React, { useState } from "react";
import { FLAVORS, PRODUCTS, Flavor } from "./data/flavors.ts";
import Header from "./components/Header.tsx";
import Can3DViewer from "./components/Can3DViewer.tsx";
import HeroSection from "./components/HeroSection.tsx";
import FeaturesCircle from "./components/FeaturesCircle.tsx";
import ImageDuoSection from "./components/ImageDuoSection.tsx";
import FlavourTextSection from "./components/FlavourTextSection.tsx";
import ProductShopGrid from "./components/ProductShopGrid.tsx";
import NewsletterSection from "./components/NewsletterSection.tsx";
import InstagramMarquee from "./components/InstagramMarquee.tsx";
import CartDrawer, { CartItem } from "./components/CartDrawer.tsx";
import Footer from "./components/Footer.tsx";

export function App() {
  const [currentFlavorId, setCurrentFlavorId] =
    useState<Flavor["id"]>("grapefruit");
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
    },
  ]);
  const [cartOpen, setCartOpen] = useState(false);

  const currentFlavor =
    FLAVORS.find((f) => f.id === currentFlavorId) || FLAVORS[0];

  const handleSelectFlavor = (flavorId: Flavor["id"]) => {
    setCurrentFlavorId(flavorId);
  };

  const handleAddToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-clip selection:bg-neutral-900 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        activeColor={currentFlavor.bg}
      />

      {/* Global Fixed 3D WebGL Can Canvas (Turns 360 vertically on scroll & opens with bubbles) */}
      <Can3DViewer currentFlavor={currentFlavor.id} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Unified Hero & Curved Features Container matching authentic .c-HomeHero-fond */}
        <div
          id="hero-circle-wrapper"
          className="w-full transition-colors duration-700 ease-in-out relative overflow-hidden"
          style={{ backgroundColor: currentFlavor.bg }}
        >
          <HeroSection
            currentFlavor={currentFlavor}
            flavors={FLAVORS}
            onSelectFlavor={handleSelectFlavor}
            onAddToCart={handleAddToCart}
          />

          {/* Core Benefits Wheel along Curved Arc */}
          <FeaturesCircle currentFlavorId={currentFlavor.id} />
        </div>

        {/* Content sections scrolling OVER the 3D can (can sits behind the images) */}
        <div className="relative z-20 bg-[#FEF7E6]">
          {/* 1. Full-width Editorial Photo Duo with Parallax & Center Divider */}
          <ImageDuoSection />

          {/* 2. Big Animated Rainbow Flavors Title & Editorial Paragraph */}
          <FlavourTextSection />

          {/* 3. Recommended Products Carousel */}
          <ProductShopGrid onAddToCart={handleAddToCart} />

          {/* 4. Delivery Subscription & Space Rocket Club */}
          <NewsletterSection />

          {/* 5. Floating Instagram Cards Showcase with Parallax */}
          <InstagramMarquee />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

export default App;
