import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAVORS, FLAVOR_MAP, FlavorId } from "./data/flavors.ts";
import { Can3DViewer } from "./components/sections/Can3DViewer.tsx";
import { FeaturesSection } from "./components/sections/feature/FeaturesSection.tsx";
import { FlavourTextSection } from "./components/sections/FlavourTextSection.tsx";
import { Footer } from "./components/sections/Footer.tsx";
import { Header } from "./components/sections/header/Header.tsx";
import { HeroSection } from "./components/sections/HeroSection.tsx";
import { ImageDuoSection } from "./components/sections/ImageDuoSection.tsx";
import { InstagramParallaxSection } from "./components/sections/InstagramParallaxSection.tsx";
import { NewsletterSection } from "./components/sections/NewsletterSection.tsx";
import { ProductShopGrid } from "./components/sections/ProductShopGrid.tsx";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.clearScrollMemory("manual");

export function App() {
  const [currentFlavorId, setCurrentFlavorId] =
    useState<FlavorId>("grapefruit");
  const [cartCount, setCartCount] = useState(1);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  const currentFlavor = FLAVOR_MAP[currentFlavorId] || FLAVORS[0];

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-clip selection:bg-neutral-900 selection:text-white">
      <Header cartCount={cartCount} />

      <Can3DViewer currentFlavor={currentFlavor.id} />

      <main className="flex-1">
        <div
          id="hero-circle-wrapper"
          className="w-full transition-colors duration-700 ease-in-out relative z-0 overflow-hidden"
          style={{ backgroundColor: currentFlavor.bg }}
        >
          <HeroSection
            currentFlavor={currentFlavor}
            flavors={FLAVORS}
            onSelectFlavor={setCurrentFlavorId}
            onAddToCart={handleAddToCart}
          />

          <FeaturesSection currentFlavorId={currentFlavor.id} />
        </div>

        <div className="relative z-20 bg-[#FEF7E6]">
          <ImageDuoSection />
          <FlavourTextSection />
          <ProductShopGrid onAddToCart={handleAddToCart} />
          <NewsletterSection />
          <InstagramParallaxSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
