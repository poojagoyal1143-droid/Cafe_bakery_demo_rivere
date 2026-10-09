import React from 'react';
import { StreetWalkthrough } from '@/components/hero/StreetWalkthrough';
import { HearthOven } from '@/components/hearth/HearthOven';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-stone-950 text-stone-100 overflow-x-hidden">
      {/* SCENE 1: THE RAINY STREET GSAP SCROLL WALKTHROUGH */}
      <StreetWalkthrough />

      {/* SCENE 2: THE ARTISAN HEARTH OVEN SHOWCASE */}
      <HearthOven />

      {/* SCENE 3 PLACEHOLDER ANCHOR: THE PARCHMENT FLIPBOOK MENU */}
      <section
        id="scene-flipbook"
        className="relative min-h-screen w-full bg-stone-950 flex items-center justify-center border-t border-stone-800 px-6 py-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-amber-400/90 font-medium">
            Scene 3 Preview
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-stone-100 mt-3 mb-6 amber-glow-text">
            The Interactive Parchment Flipbook
          </h2>
          <p className="text-stone-400 font-light text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Turn the pages of our 3D artisan menu containing 13 modern viennoiserie, pâtisserie, sourdoughs, and ceremonial roasts.
          </p>
        </div>
      </section>
    </main>
  );
}
