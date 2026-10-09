'use client';

/**
 * Riverè Cafe & Bakery - Scene 2: The Hearth Oven Showcase
 * File: components/hearth/HearthOven.tsx
 * Description: Pinned horizontal scroll showcase featuring the 250°C stone hearth oven, ember particles, and artisan breads & pastries.
 */

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Thermometer, Clock, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HearthCardItem {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  tastingNotes: string;
  specs: { label: string; value: string }[];
  imageUrl: string;
}

const HEARTH_SHOWCASE_ITEMS: HearthCardItem[] = [
  {
    id: 'hearth-1',
    title: 'Rustic Country Sourdough',
    category: 'Artisan Bread',
    price: '$9.00',
    description: 'Naturally fermented 36-hour sourdough loaf with a blistered crust and tangy, open crumb.',
    tastingNotes: 'Deep caramelization, subtle hazelnut aroma, vibrant lactic acidity.',
    specs: [
      { label: 'Stone Heat', value: '250°C' },
      { label: 'Hydration', value: '82%' },
      { label: 'Ferment', value: '36 Hours' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'hearth-2',
    title: 'Roasted Garlic & Rosemary Focaccia',
    category: 'Artisan Bread',
    price: '$7.50',
    description: 'Extra virgin olive oil dough topped with caramelized garlic cloves, flaky sea salt, and fresh garden rosemary.',
    tastingNotes: 'Sweet confit garlic, sea salt crunch, fragrant aromatic rosemary.',
    specs: [
      { label: 'Stone Heat', value: '240°C' },
      { label: 'Hydration', value: '85%' },
      { label: 'Olive Oil', value: 'Genovese EVOO' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'hearth-3',
    title: 'Butter Flake Croissant',
    category: 'Viennoiserie',
    price: '$4.75',
    description: 'Classic hand-laminated 27-layer croissant with a shattered honeycombed crumb.',
    tastingNotes: 'Rich Normandy butter, crisp shatter, delicate honeycomb texture.',
    specs: [
      { label: 'Bake Temp', value: '200°C' },
      { label: 'Butter', value: '84% Fat' },
      { label: 'Layers', value: '27 Folded' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'hearth-4',
    title: 'Dark Chocolate Croissant',
    category: 'Viennoiserie',
    price: '$5.50',
    description: 'Flaky pastry wrapped around double batons of 70% dark Belgian chocolate.',
    tastingNotes: 'Molten dark cacao, flaky butter layers, subtle vanilla undertone.',
    specs: [
      { label: 'Bake Temp', value: '205°C' },
      { label: 'Cacao', value: '70% Valrhona' },
      { label: 'Baking', value: 'Steam Injection' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
  },
];

interface EmberParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export function HearthOven() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ---------------------------------------------------------------------------
  // 1. OVEN HEAT & EMBER CANVAS ANIMATION
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

    // Dynamic ember particles rising from bottom hearth opening
    const embers: EmberParticle[] = Array.from({ length: 70 }, () => ({
      x: width * 0.4 + (Math.random() - 0.5) * (width * 0.4),
      y: height * 0.6 + Math.random() * (height * 0.3),
      size: Math.random() * 2.5 + 1,
      speedY: -(Math.random() * 1.8 + 0.8),
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? '#E2A855' : '#C46D3B',
    }));

    let step = 0;

    const renderHeatEffect = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      // Draw rising embers
      for (let i = 0; i < embers.length; i++) {
        const ember = embers[i];
        ctx.beginPath();
        ctx.arc(ember.x + Math.sin(step + i) * 1.5, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = ember.color;
        ctx.globalAlpha = ember.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ember.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        ember.y += ember.speedY;
        ember.x += ember.speedX;
        ember.opacity -= 0.006;

        if (ember.y < height * 0.1 || ember.opacity <= 0) {
          ember.y = height * 0.6 + Math.random() * (height * 0.3);
          ember.x = width * 0.4 + (Math.random() - 0.5) * (width * 0.4);
          ember.opacity = Math.random() * 0.7 + 0.3;
        }
      }

      animId = requestAnimationFrame(renderHeatEffect);
    };

    renderHeatEffect();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. HORIZONTAL SCROLL SHOWCASE (GSAP SCROLLTRIGGER)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.hearth-card');

      // 2.1 Pin container and scroll track horizontally along X-axis
      const horizontalTween = gsap.to(trackRef.current, {
        x: () => -(trackRef.current!.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // 2.2 Scale & highlight each card as it passes the viewport center
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.94, opacity: 0.75 },
          {
            scale: 1.04,
            opacity: 1,
            duration: 0.5,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: 'left 80%',
              end: 'right 20%',
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll handler to jump directly to Scene 3 (Parchment Flipbook Menu)
  const scrollToMenuScene = () => {
    const nextScene = document.getElementById('scene-flipbook') || document.getElementById('menu-section');
    if (nextScene) {
      nextScene.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight * 5.5,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hearth-section"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-stone-950 text-stone-100 select-none"
      aria-label="Scene 2: The Hearth Oven Showcase"
    >
      {/* 1. OVEN BACKGROUND LAYER */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/hearth-oven.png"
          alt="Riverè Stone Hearth Bake Chamber with glowing embers"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.75] contrast-[1.1]"
        />
        {/* Dark radial and gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-transparent to-stone-950/90" />
      </div>

      {/* 2. DYNAMIC FIRE & HEAT OVERLAY */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(226,168,85,0.4) 0%, rgba(196,109,59,0.25) 50%, transparent 80%)',
        }}
      />

      {/* 3. CANVAS EMBERS & HEAT DUST OVERLAY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80"
      />

      {/* 4. SCENE NARRATIVE OVERLAY HEADER */}
      <div className="absolute top-10 left-8 md:left-16 z-30 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-semibold">
            The Artisan Hearth
          </span>
        </div>
        <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-amber-100 font-semibold tracking-tight amber-glow-text">
          From the Hearth
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-300 font-light tracking-wide max-w-md">
          Hand-crafted loaves pulled at daybreak at 250°C stone heat.
        </p>
      </div>

      {/* 5. HORIZONTAL TRACK SHOWCASE */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-center gap-8 md:gap-12 pl-8 md:pl-20 pr-16 md:pr-32 z-20 will-change-transform"
      >
        {/* Intro Spacing Spacer */}
        <div className="w-72 sm:w-96 flex-shrink-0" />

        {/* CARDS LIST */}
        {HEARTH_SHOWCASE_ITEMS.map((item) => (
          <article
            key={item.id}
            className="hearth-card group relative w-[85vw] sm:w-[420px] md:w-[460px] h-[72vh] flex-shrink-0 rounded-3xl bg-stone-900/80 border border-amber-500/20 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(226,168,85,0.25)]"
          >
            {/* Card Header Tag & Price */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-[10px] uppercase tracking-widest text-amber-300 font-medium">
                  {item.category}
                </span>
                <span className="font-serif-luxury text-2xl font-bold text-amber-200">
                  {item.price}
                </span>
              </div>

              {/* Card Image Wrapper */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 border border-stone-800 shadow-lg">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 460px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-stone-100 font-semibold mb-2 group-hover:text-amber-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Tasting Notes & Technical Baking Specs */}
            <div className="pt-4 border-t border-stone-800/80">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-amber-400/90 font-medium mb-1">
                  Tasting Notes
                </p>
                <p className="text-xs text-stone-400 font-light italic">
                  &ldquo;{item.tastingNotes}&rdquo;
                </p>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-3 gap-2">
                {item.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-stone-950/60 border border-stone-800/80 text-center"
                  >
                    <p className="text-[9px] uppercase tracking-wider text-stone-400 font-medium">
                      {spec.label}
                    </p>
                    <p className="text-xs font-semibold text-amber-200 mt-0.5">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* 6. EXIT CUE CARD (CONTINUITY TO SCENE 3: THE FLIPBOOK MENU) */}
        <article className="hearth-card relative w-[80vw] sm:w-[380px] h-[72vh] flex-shrink-0 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900/90 to-stone-950 border border-amber-500/40 backdrop-blur-xl p-8 flex flex-col justify-between shadow-2xl text-center">
          <div className="my-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-6 shadow-xl">
              <BookOpen className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium">
              Explore Bakery Menu
            </span>

            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-stone-100 font-semibold mt-3 mb-4 amber-glow-text">
              Parchment Flipbook
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xs mx-auto mb-8">
              Step into our interactive 3D parchment menu. Browse all 13 artisan viennoiserie, pâtisserie, sourdoughs, and specialty cold brews.
            </p>

            <button
              onClick={scrollToMenuScene}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(226,168,85,0.5)] hover:shadow-[0_0_50px_rgba(226,168,85,0.8)] hover:bg-amber-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Explore Complete Menu</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-light">
            Scroll to continue &rarr;
          </p>
        </article>
      </div>

      {/* 7. SCROLL PROMPT FOOTER */}
      <div className="absolute bottom-6 left-12 z-30 pointer-events-none hidden sm:flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium">
          Horizontal Scrub &bull; Scroll to Reveal Loaves
        </span>
      </div>
    </section>
  );
}
