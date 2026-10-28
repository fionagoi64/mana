import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import lottie, { AnimationItem } from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Can3DViewerProps {
  currentFlavor: "grapefruit" | "hibiscus" | "tropical" | "melon";
  className?: string;
  onFlavorChange?: (
    flavor: "grapefruit" | "hibiscus" | "tropical" | "melon",
  ) => void;
}

export const Can3DViewer = ({
  currentFlavor = "grapefruit",
  className = "",
}: Can3DViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scrollGroupRef = useRef<THREE.Group | null>(null);
  const floatGroupRef = useRef<THREE.Group | null>(null);
  const tiltGroupRef = useRef<THREE.Group | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const canSceneRef = useRef<THREE.Group | null>(null);
  const texturesRef = useRef<Record<string, THREE.Texture>>({});
  const canMeshesRef = useRef<THREE.Mesh[]>([]);
  const rotationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const currentFlavorRef = useRef(currentFlavor);
  const prevFlavorRef = useRef(currentFlavor);
  const scrollProgressRef = useRef<number>(0);
  const canWrapperRef = useRef<HTMLDivElement>(null);

  // Can opening animation & bubbles references (matching authentic site)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const bubblesAnimRef = useRef<AnimationItem | null>(null);
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

  useEffect(() => {
    currentFlavorRef.current = currentFlavor;
  }, [currentFlavor]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;
    const size =
      W >= 650
        ? Math.min(840, Math.max(580, Math.floor(Math.min(W * 0.5, H * 0.82))))
        : Math.floor(W * 0.9);

    // 2. Camera with aspect ratio 1 matching authentic site (Z = 80 on desktop)
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, W >= 650 ? 80 : 70);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight2.position.set(-8, -4, 5);
    scene.add(dirLight2);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(0, 5, -8);
    scene.add(keyLight);

    // 5. Transform Hierarchy:
    // scene -> scrollGroup (controlled by ScrollTrigger for 360 vertical somersault turn)
    //       -> floatGroup (controlled by RAF loop for subtle breathing oscillation)
    //       -> tiltGroup (controlled by pointer mouse parallax)
    //       -> modelGroup (holds 3D can, handles flavor-swap spin & drag)
    const scrollGroup = new THREE.Group();
    scrollGroup.rotation.set(0, 0, 0);
    scene.add(scrollGroup);
    scrollGroupRef.current = scrollGroup;

    const floatGroup = new THREE.Group();
    floatGroup.rotation.set(0, 0, 0);
    scrollGroup.add(floatGroup);
    floatGroupRef.current = floatGroup;

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.set(0.04, 0, 0); // Subtle forward tilt so the metallic can lid is visible from above
    floatGroup.add(tiltGroup);
    tiltGroupRef.current = tiltGroup;

    const modelGroup = new THREE.Group();
    modelGroup.rotation.set(0, 0, 0);
    tiltGroup.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6. Preload All Flavor Textures with flipY = false matching authentic GLTF UV layout
    const textureLoader = new THREE.TextureLoader();
    const texturePaths: Record<string, string> = {
      grapefruit: "/models/MANA_canette_pamp_color_for_mat_v2.png",
      hibiscus: "/models/MANA_canette_hibiscus_color_for_mat.png",
      tropical: "/models/MANA_canette_tropical_color_for_mat.png",
      melon: "/models/MANA_canette_melon_mint_mat.png",
    };

    const loadedTextures: Record<string, THREE.Texture> = {};
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    Object.entries(texturePaths).forEach(([key, path]) => {
      const tex = textureLoader.load(path, (loadedTex) => {
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
      loadedTextures[key] = tex;
    });
    texturesRef.current = loadedTextures;

    // 7. Load HDR Environment Map for metal reflections
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

    // 8. Load GLTF 3D Can Model
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
              // Authentic site configuration: keep GLTF roughnessMap & metalnessMap intact
              mat.envMapIntensity = 2.02;
              mat.needsUpdate = true;
            }
          }
        });
        canMeshesRef.current = meshes;

        // Initialize AnimationMixer for authentic can tab opening animation (GLTF animation 1)
        const mixer = new THREE.AnimationMixer(canScene);
        mixerRef.current = mixer;
        if (gltf.animations && gltf.animations.length > 1) {
          const action = mixer.clipAction(gltf.animations[1]);
          action.play();
          actionRef.current = action;
          mixer.setTime(2.48); // Initial closed state
        }

        // Debug handle for browser inspection
        (window as any).__can = {
          mixer,
          action: actionRef.current,
          gltf,
          animTimeRef,
          isOpenRef,
          bubblesAnimRef,
        };

        // GLTF already contains the authentic grapefruit texture
        const gltfMap = meshes.find(
          (m) => (m.material as THREE.MeshStandardMaterial)?.map,
        )?.material as THREE.MeshStandardMaterial;
        if (gltfMap?.map) {
          loadedTextures.grapefruit = gltfMap.map;
        }

        applyFlavorTexture(currentFlavorRef.current);

        // Center can
        const box = new THREE.Box3().setFromObject(canScene);
        const center = box.getCenter(new THREE.Vector3());
        canScene.position.sub(center);

        // Scale can matching authentic en.manayerbamate.com proportion
        const scale = 220;
        canScene.scale.set(scale, scale, scale);

        modelGroup.add(canScene);
        setLoading(false);

        // Entrance animation
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
        setLoading(false);
      },
    );

    // 9. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      // Gentle floating breathing oscillation on floatGroup only
      if (floatGroupRef.current) {
        const factor = Math.max(0, 1 - scrollProgressRef.current * 2);
        floatGroupRef.current.position.y =
          Math.sin(elapsedTime * 1.8) * 0.8 * factor;
      }

      // Synchronize AnimationMixer with current animTime on every frame
      if (mixerRef.current) {
        mixerRef.current.setTime(animTimeRef.current.time);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Load authentic bubbles Lottie animation
    if (bubblesContainerRef.current) {
      bubblesAnimRef.current = lottie.loadAnimation({
        container: bubblesContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/bubbles.json",
      });
    }

    // 10. Responsive resize
    let currentSize = size;
    let currentMarge = (window.innerHeight - size) / 2;

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || window.innerHeight;
      currentSize =
        curW >= 650
          ? Math.min(
              840,
              Math.max(580, Math.floor(Math.min(curW * 0.5, curH * 0.82))),
            )
          : Math.floor(curW * 0.9);
      currentMarge = (curH - currentSize) / 2;

      camera.aspect = 1;
      camera.position.z = curW >= 650 ? 80 : 70;
      camera.updateProjectionMatrix();
      renderer.setSize(currentSize, currentSize);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // 11. Multi-section ScrollTriggers: 360 somersault, tab open, bubbles, and section transition
    let heroTrigger: ScrollTrigger | null = null;
    let circleTrigger: ScrollTrigger | null = null;
    let matrixTrigger: ScrollTrigger | null = null;

    const setupScrollAnimation = () => {
      const heroContainer = document.getElementById("hero-scroll-container");
      if (!heroContainer) return;

      if (heroTrigger) heroTrigger.kill();
      if (circleTrigger) circleTrigger.kill();
      if (matrixTrigger) matrixTrigger.kill();

      // Hero section: Can somersaults vertically 360 degrees and glides to bottom
      heroTrigger = ScrollTrigger.create({
        trigger: heroContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          if (!scrollGroupRef.current) return;
          const p = self.progress; // 0 to 1
          scrollProgressRef.current = p;

          // Authentic live site hero scroll rotation:
          // { x: 1.12 * Math.PI, y: -Math.PI, z: -Math.PI, zPos: 20, camY: 8 }
          scrollGroupRef.current.rotation.x = p * (1.12 * Math.PI);
          scrollGroupRef.current.rotation.y = p * -Math.PI;
          scrollGroupRef.current.rotation.z = p * -Math.PI;
          scrollGroupRef.current.position.z = p * 20;
          if (cameraRef.current) {
            cameraRef.current.position.y = p * 8;
          }

          // Glide can down to bottom center (0.58 * size + marge)
          const targetY = p * (0.58 * currentSize + currentMarge);
          if (canWrapperRef.current) {
            canWrapperRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
          }
        },
      });

      // Features circle section: can stays locked at bottom, tab pops open on scroll past title, 360 rotation
      const circleSection = document.getElementById("why-mana");
      if (circleSection) {
        circleTrigger = ScrollTrigger.create({
          trigger: circleSection,
          start: "top top",
          end: () => "+=" + 2.4 * window.innerWidth,
          scrub: true,
          onEnter: () => {
            // When reaching the bottom of the screen into the circle section, open the tab and burst bubbles
            if (!isOpenRef.current) {
              isOpenRef.current = true;
              if (bubblesAnimRef.current) {
                bubblesAnimRef.current.goToAndPlay(0, true);
              }
              gsap.killTweensOf(animTimeRef.current);
              gsap.to(animTimeRef.current, {
                time: 2.72,
                ease: "elastic.out(1, 0.75)",
                duration: 0.7,
                delay: 0.05,
                onUpdate: () => {
                  if (mixerRef.current && actionRef.current) {
                    mixerRef.current.setTime(animTimeRef.current.time);
                    actionRef.current.play();
                  }
                },
              });
            }
          },
          onLeaveBack: () => {
            // Returning to hero: smoothly close the pull tab
            if (isOpenRef.current) {
              isOpenRef.current = false;
              if (bubblesAnimRef.current) {
                bubblesAnimRef.current.stop();
              }
              gsap.killTweensOf(animTimeRef.current);
              gsap.to(animTimeRef.current, {
                time: 2.48,
                ease: "power4.in",
                duration: 0.5,
                delay: 0.05,
                onUpdate: () => {
                  if (mixerRef.current && actionRef.current) {
                    mixerRef.current.setTime(animTimeRef.current.time);
                    actionRef.current.play();
                  }
                },
              });
            }
          },
          onUpdate: (self) => {
            // Keep can locked at bottom during carousel pinning
            const bottomY = 0.58 * currentSize + currentMarge;
            if (canWrapperRef.current) {
              canWrapperRef.current.style.transform = `translate3d(0, ${bottomY}px, 0)`;
            }

            // Continuous 360 scrub rotation matching wheel progress
            if (canSceneRef.current) {
              canSceneRef.current.rotation.y = self.progress * (Math.PI * 2);
            }

            // Open can tab with bubbles when reaching the bottom / circle section
            if (self.progress > 0.005 && !isOpenRef.current) {
              isOpenRef.current = true;
              if (bubblesAnimRef.current) {
                bubblesAnimRef.current.goToAndPlay(0, true);
              }
              gsap.killTweensOf(animTimeRef.current);
              gsap.to(animTimeRef.current, {
                time: 2.72,
                ease: "elastic.out(1, 0.75)",
                duration: 0.7,
                delay: 0.05,
                onUpdate: () => {
                  if (mixerRef.current && actionRef.current) {
                    mixerRef.current.setTime(animTimeRef.current.time);
                    actionRef.current.play();
                  }
                },
              });
            } else if (self.progress <= 0 && isOpenRef.current) {
              isOpenRef.current = false;
              if (bubblesAnimRef.current) {
                bubblesAnimRef.current.stop();
              }
              gsap.killTweensOf(animTimeRef.current);
              gsap.to(animTimeRef.current, {
                time: 2.48,
                ease: "power4.in",
                duration: 0.5,
                delay: 0.05,
                onUpdate: () => {
                  if (mixerRef.current && actionRef.current) {
                    mixerRef.current.setTime(animTimeRef.current.time);
                    actionRef.current.play();
                  }
                },
              });
            }
          },
        });
      }
    };

    setupScrollAnimation();
    const timeoutId = setTimeout(() => {
      setupScrollAnimation();
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      if (heroTrigger) heroTrigger.kill();
      if (circleTrigger) circleTrigger.kill();
      if (matrixTrigger) matrixTrigger.kill();
      bubblesAnimRef.current?.destroy();
      renderer.dispose();
    };
  }, []);

  // Flavor Switch Animation matching authentic live site
  useEffect(() => {
    if (!canSceneRef.current) return;

    const flavorOrder = ["grapefruit", "hibiscus", "tropical", "melon"];
    const prevIdx = flavorOrder.indexOf(prevFlavorRef.current);
    const currIdx = flavorOrder.indexOf(currentFlavor);
    prevFlavorRef.current = currentFlavor;

    let dir = 1;
    if (prevIdx !== -1 && currIdx !== -1) {
      if (currIdx < prevIdx && !(prevIdx === 3 && currIdx === 0)) {
        dir = -1;
      } else if (prevIdx === 0 && currIdx === 3) {
        dir = -1;
      }
    }

    if (rotationTimelineRef.current) {
      rotationTimelineRef.current.kill();
    }

    const tl = gsap.timeline();
    rotationTimelineRef.current = tl;

    // Authentic live site 360 spin & bounce
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

    // Swap texture at 0.3s (midpoint of 360 spin when back faces camera)
    gsap.delayedCall(0.3, () => {
      applyFlavorTexture(currentFlavor);
    });
  }, [currentFlavor]);

  // Pointer drag & tilt handlers
  const dragStartRef = useRef<{ x: number; y: number; rotY: number }>({
    x: 0,
    y: 0,
    rotY: 0,
  });

  const getPointerPos = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ): { x: number; y: number } => {
    if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY };
    }
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: 0, y: 0 };
  };

  const handlePointerDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    setIsDragging(true);
    const pos = getPointerPos(e);

    dragStartRef.current = {
      x: pos.x,
      y: pos.y,
      rotY: modelGroupRef.current ? modelGroupRef.current.rotation.y : 0,
    };
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const pos = getPointerPos(e);
    const clientX = pos.x;
    const clientY = pos.y;

    // Subtle parallax tilt
    if (!isDragging && tiltGroupRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width - 0.5;
      const relY = (clientY - rect.top) / rect.height - 0.5;

      gsap.to(tiltGroupRef.current.rotation, {
        x: relY * 0.25,
        y: relX * 0.35,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleCanClick = () => {
    if (!isOpenRef.current) {
      isOpenRef.current = true;
      if (bubblesAnimRef.current) {
        bubblesAnimRef.current.goToAndPlay(0, true);
      }
      gsap.killTweensOf(animTimeRef.current);
      gsap.to(animTimeRef.current, {
        time: 2.72,
        ease: "elastic.out(1, 0.75)",
        duration: 0.7,
        onUpdate: () => {
          if (mixerRef.current && actionRef.current) {
            mixerRef.current.setTime(animTimeRef.current.time);
            actionRef.current.play();
          }
        },
      });
    } else {
      if (bubblesAnimRef.current) {
        bubblesAnimRef.current.goToAndPlay(0, true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-10 flex items-center justify-center select-none overflow-hidden ${className}`}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Moving wrapper that translates down on scroll */}
      <div
        ref={canWrapperRef}
        className="relative flex items-center justify-center pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanClick}
          className="block max-w-none pointer-events-auto"
        />

        {/* Floating bubbles popping out of the open can mouth (matching authentic site) */}
        <div
          ref={bubblesContainerRef}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-75px] sm:top-[-95px] w-[220px] sm:w-[280px] aspect-square z-30"
        />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm rounded-3xl z-20">
          <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-800">
            Loading 3D Can...
          </span>
        </div>
      )}
    </div>
  );
};

export default Can3DViewer;
