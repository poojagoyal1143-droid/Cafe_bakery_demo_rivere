'use client';

/**
 * Riverè Cafe & Bakery - Scene 1: The Rainy Street GSAP Scroll Walkthrough
 * File: components/hero/StreetWalkthrough.tsx
 * Description: Immersive 3D depth walkthrough zooming from a rainy cobble street into the warm amber cafe storefront.
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles, Volume2, VolumeX, LogIn } from 'lucide-react';

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

export function StreetWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgStreetRef = useRef<HTMLDivElement>(null);
  const facadeRef = useRef<HTMLDivElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const brandEmblemRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doorPromptRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // ---------------------------------------------------------------------------
  // 1. CANVAS RAIN SYSTEM & GROUND SPLASHES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

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

    const animateRain = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain streaks
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(212, 212, 216, ${drop.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.wind * 2, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += drop.wind;

        // Ground collision & splash creation
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

      // Render ground splashes
      for (let j = splashes.length - 1; j >= 0; j--) {
        const splash = splashes[j];
        ctx.beginPath();
        ctx.ellipse(splash.x, splash.y, splash.radius, splash.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(226, 168, 85, ${splash.opacity * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        splash.radius += 0.4;
        splash.opacity -= 0.035;

        if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
          splashes.splice(j, 1);
        }
      }

      animId = requestAnimationFrame(animateRain);
    };

    animateRain();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. GSAP SCROLLTRIGGER WALKTHROUGH MECHANICS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Toggle scroll prompt visibility as camera approaches
            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 3));
            }
          },
        },
      });

      // 2.1 Zoom street background (Simulate walking down rainy cobbled street)
      tl.to(
        bgStreetRef.current,
        {
          scale: 1.38,
          filter: 'brightness(0.7) blur(1.5px)',
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      // 2.2 Zoom cafe storefront facade into camera foreground
      tl.to(
        facadeRef.current,
        {
          scale: 1.45,
          y: -25,
          filter: 'brightness(1.15)',
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      // 2.3 Fade out brand title emblem as camera approaches facade
      tl.to(
        brandEmblemRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.9,
          ease: 'power2.in',
          duration: 0.55,
        },
        0
      );

      // 2.4 Ramp up warm amber interior window glow behind storefront
      tl.to(
        amberGlowRef.current,
        {
          opacity: 0.95,
          scale: 1.25,
          ease: 'power2.out',
          duration: 1,
        },
        0.2
      );

      // 2.5 Fade out ambient rain canvas slightly as camera steps under awning
      tl.to(
        canvasRef.current,
        {
          opacity: 0.3,
          ease: 'power1.inOut',
          duration: 0.8,
        },
        0.3
      );

      // 2.6 Reveal interactive entrance door prompt when camera arrives at front door
      tl.to(
        doorPromptRef.current,
        {
          opacity: 1,
          scale: 1,
          pointerEvents: 'auto',
          ease: 'back.out(1.7)',
          duration: 0.35,
        },
        0.75
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---------------------------------------------------------------------------
  // 3. ENTRANCE DOOR CLICK HANDLER (Cinematic Transition to Scene 2)
  // ---------------------------------------------------------------------------
  const handleEnterBakery = () => {
    // Smooth scroll down to Scene 2 (The Hearth Oven)
    const nextScene = document.getElementById('scene-hearth-oven');
    if (nextScene) {
      nextScene.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight * 2.5,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-stone-950 select-none"
      aria-label="Scene 1: Rainy Street Walkthrough"
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
          sizes="100vw"
          className="object-cover object-center brightness-[0.85] contrast-[1.05]"
        />
        {/* Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/90" />
        <div className="absolute inset-0 radial-vignette pointer-events-none" />
      </div>

      {/* 2. FOREGROUND CAFE STOREFRONT FACADE LAYER */}
      <div
        ref={facadeRef}
        className="absolute inset-0 flex items-center justify-center transform-gpu will-change-transform"
      >
        <div className="relative w-full max-w-6xl h-[85vh] mx-auto px-4">
          <Image
            src="/assets/cafe-storefront.png"
            alt="Riverè Cafe & Bakery Warm Storefront Entrance"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />

          {/* Warm Amber Interior Window Glow Effect */}
          <div
            ref={amberGlowRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/25 blur-3xl opacity-20 pointer-events-none transition-opacity duration-700"
            style={{
              background: 'radial-gradient(circle, rgba(226,168,85,0.45) 0%, rgba(196,109,59,0.15) 60%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* 3. CANVAS AMBIENT RAIN OVERLAY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-90 transition-opacity duration-500"
      />

      {/* 4. BRAND EMBLEM (Glowing Serif Title & Subtitle) */}
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

      {/* 5. INTERACTIVE FRONT DOOR ENTRANCE PROMPT */}
      <div
        ref={doorPromptRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 opacity-0 scale-90 pointer-events-none transition-transform duration-300"
      >
        <button
          onClick={handleEnterBakery}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-semibold tracking-wider uppercase text-xs sm:text-sm shadow-[0_0_40px_rgba(226,168,85,0.6)] hover:shadow-[0_0_60px_rgba(226,168,85,0.9)] hover:bg-amber-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <LogIn className="w-4 h-4 text-stone-950 transition-transform group-hover:translate-x-0.5" />
          <span>Step Inside the Bakery</span>
          <span className="absolute -inset-1 rounded-full border border-amber-400/50 animate-ping pointer-events-none" />
        </button>
      </div>

      {/* 6. TOP AUDIO & AMBIENT CONTROLS */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-3 rounded-full bg-stone-900/70 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 backdrop-blur-md transition-all duration-300 shadow-lg"
          title={isAudioMuted ? 'Enable Ambient Cafe Audio' : 'Mute Audio'}
          aria-label="Toggle ambient rain audio"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

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
