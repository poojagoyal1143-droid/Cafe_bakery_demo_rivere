'use client';

/**
 * Riverè Cafe & Bakery - Scene 1: The Rainy Street Walkthrough
 * File: components/hero/StreetWalkthrough.tsx
 * Description: Multi-plane 3D camera parallax, procedural rain & rolling ground fog, amber god-ray beams, and spatial soundscape synchronization.
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, LogIn } from 'lucide-react';

import { triggerDoorChime } from '@/components/audio/SoundscapeManager';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  wind: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface FogParticle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  opacity: number;
}

export function StreetWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);
  const perspectiveWrapperRef = useRef<HTMLDivElement>(null);
  const bgStreetRef = useRef<HTMLDivElement>(null);
  const facadeRef = useRef<HTMLDivElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const godRayRef = useRef<HTMLDivElement>(null);
  const brandEmblemRef = useRef<HTMLDivElement>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const doorPromptRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 1. MOUSE PARALLAX 3D DRIFT LISTENER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!perspectiveWrapperRef.current) return;
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(perspectiveWrapperRef.current, {
        rotationY: mouseX * 4,
        rotationX: -mouseY * 4,
        ease: 'power1.out',
        duration: 1.2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ---------------------------------------------------------------------------
  // 2. CANVAS RAIN & ROLLING GROUND FOG SYSTEM
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    const fogCanvas = fogCanvasRef.current;
    if (!rainCanvas || !fogCanvas) return;

    const rainCtx = rainCanvas.getContext('2d');
    const fogCtx = fogCanvas.getContext('2d');
    if (!rainCtx || !fogCtx) return;

    let animId: number;
    let width = (rainCanvas.width = fogCanvas.width = window.innerWidth);
    let height = (rainCanvas.height = fogCanvas.height = window.innerHeight);

    const handleResize = () => {
      if (!rainCanvas || !fogCanvas) return;
      width = rainCanvas.width = fogCanvas.width = window.innerWidth;
      height = rainCanvas.height = fogCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Rain Drops
    const dropCount = Math.floor((width * height) / 9000);
    const drops: Drop[] = Array.from({ length: Math.min(dropCount, 160) }, () => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      length: Math.random() * 15 + 12,
      speed: Math.random() * 8 + 14,
      opacity: Math.random() * 0.35 + 0.15,
      wind: -(Math.random() * 1.5 + 1.2),
    }));

    const splashes: Splash[] = [];

    // Rolling Fog Particles
    const fogParticles: FogParticle[] = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: height - Math.random() * 180 - 20,
      radius: Math.random() * 140 + 80,
      speedX: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.12 + 0.04,
    }));

    const animateSensoryCanvas = () => {
      rainCtx.clearRect(0, 0, width, height);
      fogCtx.clearRect(0, 0, width, height);

      // A. Render Rain Streaks & Splashes
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        rainCtx.beginPath();
        rainCtx.strokeStyle = `rgba(212, 212, 216, ${drop.opacity})`;
        rainCtx.lineWidth = 1.2;
        rainCtx.lineCap = 'round';
        rainCtx.moveTo(drop.x, drop.y);
        rainCtx.lineTo(drop.x + drop.wind * 2, drop.y + drop.length);
        rainCtx.stroke();

        drop.y += drop.speed;
        drop.x += drop.wind;

        if (drop.y > height - 40) {
          if (Math.random() > 0.65) {
            splashes.push({
              x: drop.x,
              y: height - Math.random() * 30,
              radius: 1,
              maxRadius: Math.random() * 4 + 2,
              opacity: 0.5,
            });
          }
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * (width + 200) - 100;
        }
      }

      for (let j = splashes.length - 1; j >= 0; j--) {
        const splash = splashes[j];
        rainCtx.beginPath();
        rainCtx.ellipse(splash.x, splash.y, splash.radius, splash.radius * 0.4, 0, 0, Math.PI * 2);
        rainCtx.strokeStyle = `rgba(226, 168, 85, ${splash.opacity * 0.6})`;
        rainCtx.lineWidth = 0.8;
        rainCtx.stroke();

        splash.radius += 0.4;
        splash.opacity -= 0.035;

        if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
          splashes.splice(j, 1);
        }
      }

      // B. Render Rolling Ground Fog
      for (let k = 0; k < fogParticles.length; k++) {
        const p = fogParticles[k];
        const gradient = fogCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(226, 168, 85, ${p.opacity})`);
        gradient.addColorStop(0.6, `rgba(180, 140, 90, ${p.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        fogCtx.fillStyle = gradient;
        fogCtx.beginPath();
        fogCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        fogCtx.fill();

        p.x += p.speedX;
        if (p.x - p.radius > width) {
          p.x = -p.radius;
        }
      }

      animId = requestAnimationFrame(animateSensoryCanvas);
    };

    animateSensoryCanvas();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. GSAP SCROLLTRIGGER MULTI-PLANE CAMERA WALKTHROUGH
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set explicit initial GSAP states to prevent initial black screen flicker or asset jumps
      if (bgStreetRef.current) gsap.set(bgStreetRef.current, { scale: 1.0, autoAlpha: 1 });
      if (facadeRef.current) gsap.set(facadeRef.current, { scale: 0.85, autoAlpha: 1 });
      if (brandEmblemRef.current) gsap.set(brandEmblemRef.current, { autoAlpha: 1, y: 0 });
      if (doorPromptRef.current) gsap.set(doorPromptRef.current, { autoAlpha: 0, scale: 0.9, pointerEvents: 'none' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            // Toggle scroll prompt visibility
            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 3));
            }
          },
        },
      });

      // 3.1 Zoom street background (Scale 1.0 -> 1.4 with progressive depth blur)
      tl.to(
        bgStreetRef.current,
        {
          scale: 1.4,
          filter: 'brightness(0.65) blur(3px)',
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      // 3.2 Zoom cafe facade from 0.85 to 1.5 with sharp clarity
      tl.to(
        facadeRef.current,
        {
          scale: 1.5,
          y: -20,
          filter: 'brightness(1.15)',
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      // 3.3 Fade out brand title emblem using autoAlpha
      tl.to(
        brandEmblemRef.current,
        {
          autoAlpha: 0,
          y: -50,
          scale: 0.9,
          ease: 'power2.in',
          duration: 0.55,
        },
        0
      );

      // 3.4 Expand volumetric god-ray beam through front windows
      tl.to(
        godRayRef.current,
        {
          autoAlpha: 0.85,
          scale: 1.4,
          ease: 'power2.out',
          duration: 1,
        },
        0.15
      );

      // 3.5 Ramp up interior window glow
      tl.to(
        amberGlowRef.current,
        {
          autoAlpha: 0.95,
          scale: 1.3,
          ease: 'power2.out',
          duration: 1,
        },
        0.2
      );

      // 3.6 Fade rain canvas slightly under awning
      tl.to(
        rainCanvasRef.current,
        {
          autoAlpha: 0.25,
          ease: 'power1.inOut',
          duration: 0.8,
        },
        0.3
      );

      // 3.7 Reveal door entrance prompt at threshold
      tl.to(
        doorPromptRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          pointerEvents: 'auto',
          ease: 'back.out(1.7)',
          duration: 0.35,
        },
        0.72
      );

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---------------------------------------------------------------------------
  // 4. CINEMATIC RUSH-FORWARD DOOR CLICK HANDLER
  // ---------------------------------------------------------------------------
  const handleEnterBakery = () => {
    // Play brass shop door chime
    triggerDoorChime();

    const executeScrollNavigation = () => {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo('#hearth-section', { duration: 1.5 });
      } else {
        const hearthSection = document.getElementById('hearth-section');
        if (hearthSection) {
          hearthSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({
            top: window.innerHeight * 2.5,
            behavior: 'smooth',
          });
        }
      }
    };

    // Golden camera rush-forward flash animation
    if (flashOverlayRef.current && perspectiveWrapperRef.current) {
      gsap.to(perspectiveWrapperRef.current, {
        scale: 1.8,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.in',
      });

      gsap.fromTo(
        flashOverlayRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.45,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
          onComplete: executeScrollNavigation,
        }
      );
    } else {
      executeScrollNavigation();
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#0d0c0a] select-none perspective-1400"
      aria-label="Rainy Street Walkthrough"
    >
      {/* 3D PERSPECTIVE WRAPPER FOR MOUSE TILT */}
      <div
        ref={perspectiveWrapperRef}
        className="relative h-full w-full transform-style-3d will-change-transform"
      >
        {/* 1. BACKGROUND STREET DEPTH LAYER */}
        <div
          ref={bgStreetRef}
          className="absolute inset-0 h-full w-full transform-gpu will-change-transform"
        >
          <Image
            src="/assets/street-walkthrough.png"
            alt="Rainy Parisian cobblestone street leading to Riverè Cafe"
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover object-center brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/90" />
          <div className="absolute inset-0 radial-vignette pointer-events-none" />
        </div>

        {/* 2. FOREGROUND CAFE STOREFRONT FACADE LAYER */}
        <div
          ref={facadeRef}
          className="absolute inset-0 flex items-center justify-center transform-gpu will-change-transform scale-[0.85]"
        >
          <div className="relative w-full max-w-6xl h-[85vh] mx-auto px-4">
            <Image
              src="/assets/cafe-storefront.png"
              alt="Riverè Cafe & Bakery Warm Storefront Entrance"
              fill
              priority
              loading="eager"
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain object-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            />

            {/* Volumetric Amber God-Ray Window Beam */}
            <div
              ref={godRayRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-0 transition-opacity duration-700 blur-2xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(226,168,85,0.45) 0%, rgba(196,109,59,0.18) 50%, transparent 80%)',
              }}
            />

            {/* Warm Amber Interior Glow */}
            <div
              ref={amberGlowRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/25 blur-3xl opacity-20 pointer-events-none transition-opacity duration-700"
            />
          </div>
        </div>

        {/* 3. ROLLING GROUND FOG CANVAS */}
        <canvas
          ref={fogCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        />

        {/* 4. CANVAS AMBIENT RAIN OVERLAY */}
        <canvas
          ref={rainCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-90 transition-opacity duration-500"
        />

        {/* 5. BRAND EMBLEM TITLE */}
        <div
          ref={brandEmblemRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none px-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/70 border border-amber-500/30 backdrop-blur-md mb-4 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.35em] text-amber-200/90 font-medium">
              Artisan Parisien
            </span>
          </div>

          <h1 className="font-serif-luxury text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight amber-glow-text">
            Riverè
          </h1>

          <p className="mt-2 text-sm sm:text-base md:text-lg tracking-[0.4em] uppercase text-stone-300 font-light drop-shadow-md">
            Boulangerie &amp; Café
          </p>

          <p className="mt-4 text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-light leading-relaxed drop-shadow">
            Slow sourdough fermentation, 84% Normandy butter, and hand-crafted roasts.
          </p>
        </div>

        {/* 6. INTERACTIVE FRONT DOOR ENTRANCE PROMPT */}
        <div
          ref={doorPromptRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 opacity-0 scale-90 pointer-events-auto transition-transform duration-300"
        >
          <button
            type="button"
            onClick={handleEnterBakery}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-semibold tracking-wider uppercase text-xs sm:text-sm shadow-[0_0_50px_rgba(226,168,85,0.7)] hover:shadow-[0_0_70px_rgba(226,168,85,0.95)] hover:bg-amber-400 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer pointer-events-auto z-40"
            aria-label="Step Inside the Bakery"
          >
            <LogIn className="w-4 h-4 text-stone-950 transition-transform group-hover:translate-x-0.5" />
            <span>Step Inside the Bakery</span>
            <span className="absolute -inset-1 rounded-full border border-amber-400/50 animate-ping pointer-events-none" />
          </button>
        </div>
      </div>

      {/* GOLDEN CAMERA RUSH-FORWARD FLASH OVERLAY */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 z-50 bg-amber-400 pointer-events-none opacity-0"
      />

      {/* 7. BOTTOM SCROLL INDICATOR */}
      <div
        ref={scrollPromptRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center transition-opacity duration-500 pointer-events-none"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-2">
          Scroll to Approach
        </p>
        <div className="w-6 h-10 mx-auto rounded-full border border-amber-500/40 flex items-start justify-center p-1.5 backdrop-blur-sm bg-stone-900/40 shadow-lg">
          <div className="w-1.5 h-2.5 rounded-full bg-amber-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
