import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import lottie, { AnimationItem } from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAVORS, FLAVOR_ORDER, FlavorId } from "../../data/flavors.ts";

gsap.registerPlugin(ScrollTrigger);

export interface Can3DViewerProps {
  currentFlavor: FlavorId;
  className?: string;
}

const LIGHT_CONFIGS: { pos: [number, number, number]; intensity: number }[] = [
  { pos: [5, 12, 10], intensity: 1.8 },
  { pos: [-8, -4, 5], intensity: 0.9 },
  { pos: [0, 5, -8], intensity: 1.1 },
];

export const Can3DViewer = ({
  currentFlavor = "grapefruit",
  className = "",
}: Can3DViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scrollGroupRef = useRef<THREE.Group | null>(null);
  const floatGroupRef = useRef<THREE.Group | null>(null);
  const tiltGroupRef = useRef<THREE.Group | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const canSceneRef = useRef<THREE.Group | null>(null);
  const texturesRef = useRef<Record<string, THREE.Texture>>({});
  const rotationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const currentFlavorRef = useRef(currentFlavor);
  const prevFlavorRef = useRef(currentFlavor);
  const scrollProgressRef = useRef(0);
  const canWrapperRef = useRef<HTMLDivElement>(null);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const bubblesAnimRef = useRef<AnimationItem | null>(null);
  // GLTF animation keyframe timeline position: 2.48s = pull-tab closed, 2.72s = pull-tab popped open
  const animTimeRef = useRef({ time: 2.48 });
  const isOpenRef = useRef(false);

  const applyFlavorTexture = (flavor: string) => {
    const tex = texturesRef.current[flavor];
    if (!tex || !canSceneRef.current) return;
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    canSceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.map = tex;
          mat.needsUpdate = true;
        }
      }
    });
  };

  /**
   * HOW TO OPEN / CLOSE THE 3D CAN TAB:
   * - Tween `animTimeRef.current.time` between 2.48s (closed) and 2.72s (open) on `gltf.animations[1]`.
   * - When opening (`open = true`), play the Lottie fizz bubbles (`/lottie/bubbles.json`) above the can.
   * - Sync `mixerRef.current.setTime(...)` on each GSAP frame update.
   */
  const animateCanTab = (open: boolean, delay = 0.05) => {
    isOpenRef.current = open;
    if (open) {
      bubblesAnimRef.current?.goToAndPlay(0, true);
    } else {
      bubblesAnimRef.current?.stop();
    }

    gsap.killTweensOf(animTimeRef.current);
    gsap.to(animTimeRef.current, {
      time: open ? 2.72 : 2.48,
      ease: open ? "elastic.out(1, 0.75)" : "power4.in",
      duration: open ? 0.7 : 0.5,
      delay,
      onUpdate: () => {
        if (mixerRef.current && actionRef.current) {
          mixerRef.current.setTime(animTimeRef.current.time);
          actionRef.current.play();
        }
      },
    });
  };

  const setContainerVisible = (visible: boolean, withTransition = false) => {
    const el = containerRef.current;
    if (!el) return;
    if (withTransition) {
      el.style.transition = "opacity 0.25s ease, visibility 0.25s ease";
    }
    el.style.opacity = visible ? "1" : "0";
    el.style.visibility = visible ? "visible" : "hidden";
    el.style.pointerEvents = visible ? "auto" : "none";
  };

  useEffect(() => {
    currentFlavorRef.current = currentFlavor;
  }, [currentFlavor]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;
    const size =
      W >= 650
        ? Math.min(960, Math.max(620, Math.floor(Math.min(W * 0.58, H * 0.88))))
        : Math.floor(W * 0.92);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, W >= 650 ? 74.5 : 64);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    LIGHT_CONFIGS.forEach(({ pos, intensity }) => {
      const dirLight = new THREE.DirectionalLight(0xffffff, intensity);
      dirLight.position.set(...pos);
      scene.add(dirLight);
    });

    const scrollGroup = new THREE.Group();
    scene.add(scrollGroup);
    scrollGroupRef.current = scrollGroup;

    const floatGroup = new THREE.Group();
    scrollGroup.add(floatGroup);
    floatGroupRef.current = floatGroup;

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.set(0.04, 0, 0);
    floatGroup.add(tiltGroup);
    tiltGroupRef.current = tiltGroup;

    const modelGroup = new THREE.Group();
    tiltGroup.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const textureLoader = new THREE.TextureLoader();
    const loadedTextures: Record<string, THREE.Texture> = {};
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    FLAVORS.forEach(({ id, texturePath }) => {
      const tex = textureLoader.load(texturePath, (loadedTex) => {
        loadedTex.flipY = false;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.anisotropy = maxAnisotropy;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = true;
        loadedTex.needsUpdate = true;
      });
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAnisotropy;
      tex.minFilter = THREE.LinearFilter;
      loadedTextures[id] = tex;
    });
    texturesRef.current = loadedTextures;

    const hdrLoader = new HDRLoader();
    hdrLoader.load(
      "/models/MANA_hdr.hdr",
      (hdrTexture) => {
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrTexture;
      },
      undefined,
      (err) => {
        console.warn("HDR environment map fallback:", err);
      },
    );

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/models/MANA_canettes__v5_WEBGL.gltf",
      (gltf) => {
        const canScene = gltf.scene;
        canSceneRef.current = canScene;
        const meshes: THREE.Mesh[] = [];

        canScene.traverse((child) => {
          child.frustumCulled = false;
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            meshes.push(mesh);
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 2.02;
              mat.needsUpdate = true;
            }
          }
        });

        // Initialize GLTF pull-tab animation mixer at 2.48s (closed state)
        const mixer = new THREE.AnimationMixer(canScene);
        mixerRef.current = mixer;
        if (gltf.animations && gltf.animations.length > 1) {
          const action = mixer.clipAction(gltf.animations[1]);
          action.play();
          actionRef.current = action;
          mixer.setTime(2.48);
        }

        const gltfMap = meshes.find(
          (m) => (m.material as THREE.MeshStandardMaterial)?.map,
        )?.material as THREE.MeshStandardMaterial;
        if (gltfMap?.map) {
          loadedTextures.grapefruit = gltfMap.map;
        }

        applyFlavorTexture(currentFlavorRef.current);

        const box = new THREE.Box3().setFromObject(canScene);
        const center = box.getCenter(new THREE.Vector3());
        canScene.position.sub(center);

        const scale = window.innerWidth >= 650 ? 242 : 222;
        canScene.scale.set(scale, scale, scale);

        modelGroup.add(canScene);

        gsap.fromTo(
          modelGroup.scale,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1, 0.65)" },
        );
        gsap.fromTo(
          modelGroup.rotation,
          { y: -Math.PI * 1.5 },
          { y: 0.25, duration: 1.4, ease: "power3.out" },
        );
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF can:", error);
      },
    );

    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      if (floatGroupRef.current) {
        const factor = Math.max(0, 1 - scrollProgressRef.current * 2);
        floatGroupRef.current.position.y =
          Math.sin(elapsedTime * 1.8) * 0.8 * factor;
      }

      if (mixerRef.current) {
        mixerRef.current.setTime(animTimeRef.current.time);
      }

      renderer.render(scene, camera);
    };
    animate();

    if (bubblesContainerRef.current) {
      bubblesAnimRef.current = lottie.loadAnimation({
        container: bubblesContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/lottie/bubbles.json",
      });
    }

    let currentSize = size;
    let currentMarge = (window.innerHeight - size) / 2;
    let heroTrigger: ScrollTrigger | null = null;
    let circleTrigger: ScrollTrigger | null = null;

    /**
     * WHEN & HOW THE 3D CAN SCROLLS AND OPENS:
     * Controlled by two ScrollTriggers synced to page sections:
     * 1. `heroTrigger` (#hero-scroll-container):
     *    - Mobile (< 768px): Translates the can upward with scroll (`-self.scroll()`) and hides it past the Hero section.
     *    - Desktop (>= 768px): Scrubs 3D tumbling (`scrollGroup.rotation.x/y/z`), pushes `position.z` forward,
     *      and translates `canWrapperRef` downward (`targetY`) so the can lands at the bottom-center of the viewport.
     * 2. `circleTrigger` (#why-mana - Desktop only):
     *    - Triggered when `#why-mana` reaches `top top` for a scroll distance of `3.0 * window.innerWidth`.
     *    - WHEN TO OPEN: Pops open the pull-tab (`animateCanTab(true)`) on `onEnter` / `self.progress > 0.005`,
     *      and closes it (`animateCanTab(false)`) when scrolling back up (`onLeaveBack` / `self.progress <= 0`).
     *    - HOW IT SPINS ON SCROLL: Keeps the can parked at `bottomY` and rotates `canScene.rotation.y` a full 360° (0 -> 2π)
     *      between scroll progress 0.22 and 0.89, then hides the 3D canvas (`onLeave`) when leaving `#why-mana`.
     */
    const setupScrollAnimation = () => {
      const heroContainer = document.getElementById("hero-scroll-container");
      if (!heroContainer) return;

      heroTrigger?.kill();
      circleTrigger?.kill();

      if (window.innerWidth < 768) {
        // Mobile: keep upright and scroll up naturally with the Hero section
        const initialScrollY = window.scrollY;
        const heroHeight = heroContainer.offsetHeight || window.innerHeight;
        setContainerVisible(initialScrollY < heroHeight);

        if (scrollGroupRef.current) {
          scrollGroupRef.current.rotation.set(0, 0, 0);
          scrollGroupRef.current.position.set(0, 0, 0);
        }

        heroTrigger = ScrollTrigger.create({
          trigger: heroContainer,
          start: "top top",
          end: "bottom top",
          onEnter: () => setContainerVisible(true, true),
          onLeave: () => setContainerVisible(false, true),
          onEnterBack: () => setContainerVisible(true, true),
          onLeaveBack: () => setContainerVisible(true),
          onUpdate: (self) => {
            if (scrollGroupRef.current) {
              scrollGroupRef.current.rotation.set(0, 0, 0);
              scrollGroupRef.current.position.set(0, 0, 0);
            }
            if (canWrapperRef.current) {
              canWrapperRef.current.style.transform = `translate3d(0, ${-self.scroll()}px, 0)`;
            }
          },
        });
      } else {
        // Desktop Phase 1 (Hero -> Features transition): tumble the can in 3D and move it down to bottom-center
        heroTrigger = ScrollTrigger.create({
          trigger: heroContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onEnter: () => setContainerVisible(true),
          onEnterBack: () => setContainerVisible(true),
          onUpdate: (self) => {
            if (!scrollGroupRef.current) return;
            const p = self.progress;
            scrollProgressRef.current = p;

            scrollGroupRef.current.rotation.x = p * (1.12 * Math.PI);
            scrollGroupRef.current.rotation.y = p * -Math.PI;
            scrollGroupRef.current.rotation.z = p * -Math.PI;
            scrollGroupRef.current.position.z = p * 20;
            if (cameraRef.current) {
              cameraRef.current.position.y = p * 8;
            }

            const targetY = p * (0.58 * currentSize + currentMarge);
            if (canWrapperRef.current) {
              canWrapperRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
            }
          },
        });

        // Desktop Phase 2 (Features wheel section): open the can tab, spin 360° during card rotation, hide on leave
        const circleSection = document.getElementById("why-mana");
        if (circleSection) {
          circleTrigger = ScrollTrigger.create({
            trigger: circleSection,
            start: "top top",
            end: () => "+=" + 3.0 * window.innerWidth,
            scrub: true,
            onEnter: () => {
              setContainerVisible(true);
              if (!isOpenRef.current) animateCanTab(true);
            },
            onLeave: () => setContainerVisible(false, true),
            onEnterBack: () => setContainerVisible(true, true),
            onLeaveBack: () => {
              if (isOpenRef.current) animateCanTab(false);
            },
            onUpdate: (self) => {
              // Lock the can at the bottom-center position reached at the end of heroTrigger
              const bottomY = 0.58 * currentSize + currentMarge;
              if (canWrapperRef.current) {
                canWrapperRef.current.style.transform = `translate3d(0, ${bottomY}px, 0)`;
              }

              // Spin the can 360° around Y-axis between 22% and 89% of the #why-mana pinned scroll
              if (canSceneRef.current) {
                if (self.progress <= 0.22) {
                  canSceneRef.current.rotation.y = 0;
                } else if (self.progress >= 0.89) {
                  canSceneRef.current.rotation.y = Math.PI * 2;
                } else {
                  const subProgress = (self.progress - 0.22) / (0.89 - 0.22);
                  canSceneRef.current.rotation.y = subProgress * (Math.PI * 2);
                }
              }

              // Pop open the pull-tab right as the section pins; close it when scrolling back to 0
              if (self.progress > 0.005 && !isOpenRef.current) {
                animateCanTab(true);
              } else if (self.progress <= 0 && isOpenRef.current) {
                animateCanTab(false);
              }
            },
          });
        }
      }
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || window.innerHeight;
      currentSize =
        curW >= 650
          ? Math.min(
              960,
              Math.max(620, Math.floor(Math.min(curW * 0.58, curH * 0.88))),
            )
          : Math.floor(curW * 0.92);
      currentMarge = (curH - currentSize) / 2;

      camera.aspect = 1;
      camera.position.z = curW >= 650 ? 74.5 : 64;
      camera.updateProjectionMatrix();
      renderer.setSize(currentSize, currentSize);

      if (canSceneRef.current) {
        const s = curW >= 650 ? 242 : 222;
        canSceneRef.current.scale.set(s, s, s);
      }

      setupScrollAnimation();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const timeoutId = setTimeout(() => {
      setupScrollAnimation();
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      heroTrigger?.kill();
      circleTrigger?.kill();
      bubblesAnimRef.current?.destroy();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canSceneRef.current) return;

    const prevIdx = FLAVOR_ORDER.indexOf(prevFlavorRef.current);
    const currIdx = FLAVOR_ORDER.indexOf(currentFlavor);
    prevFlavorRef.current = currentFlavor;

    let dir = 1;
    if (prevIdx !== -1 && currIdx !== -1) {
      if (currIdx < prevIdx && !(prevIdx === 3 && currIdx === 0)) {
        dir = -1;
      } else if (prevIdx === 0 && currIdx === 3) {
        dir = -1;
      }
    }

    rotationTimelineRef.current?.kill();

    const tl = gsap.timeline();
    rotationTimelineRef.current = tl;

    tl.fromTo(
      canSceneRef.current.rotation,
      { y: 0 },
      {
        y: 0.3 * dir * 2 * Math.PI,
        duration: 0.3,
        ease: "power2.in",
      },
    ).to(canSceneRef.current.rotation, {
      y: 2 * dir * Math.PI,
      duration: 1.3,
      ease: "elastic.out(0.34, 0.26)",
    });

    gsap.fromTo(
      canSceneRef.current.position,
      { x: 0 },
      {
        x: -3 * dir,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
    );

    gsap.delayedCall(0.3, () => {
      applyFlavorTexture(currentFlavor);
    });
  }, [currentFlavor]);

  const handlePointerMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (isDragging || !tiltGroupRef.current || !containerRef.current) return;

    const clientX = "clientX" in e ? e.clientX : (e.touches?.[0]?.clientX ?? 0);
    const clientY = "clientY" in e ? e.clientY : (e.touches?.[0]?.clientY ?? 0);

    const rect = containerRef.current.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width - 0.5;
    const relY = (clientY - rect.top) / rect.height - 0.5;

    gsap.to(tiltGroupRef.current.rotation, {
      x: relY * 0.25,
      y: relX * 0.35,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  // Manual click trigger: open the pull-tab on first click, or replay fizz bubbles if already open
  const handleCanClick = () => {
    if (!isOpenRef.current) {
      animateCanTab(true, 0);
    } else {
      bubblesAnimRef.current?.goToAndPlay(0, true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-15 flex items-center justify-center select-none overflow-hidden ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handlePointerMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchMove={handlePointerMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div
        ref={canWrapperRef}
        className="relative flex items-center justify-center pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanClick}
          className="block max-w-none pointer-events-auto"
        />

        <div
          ref={bubblesContainerRef}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-65px] sm:top-[-85px] w-[220px] sm:w-[280px] aspect-square z-30"
        />
      </div>
    </div>
  );
};

export default Can3DViewer;
