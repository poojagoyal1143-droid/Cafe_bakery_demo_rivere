import React from 'react';
import { StreetWalkthrough } from '@/components/hero/StreetWalkthrough';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-stone-950 text-stone-100 overflow-x-hidden">
      {/* SCENE 1: THE RAINY STREET GSAP SCROLL WALKTHROUGH */}
      <StreetWalkthrough />

      {/* SCENE 2 PLACEHOLDER ANCHOR: THE HEARTH OVEN */}
      <section
        id="scene-hearth-oven"
        className="relative min-h-screen w-full bg-stone-900 flex items-center justify-center border-t border-stone-800 px-6 py-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-amber-400/90 font-medium">
            Scene 2 Preview
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-stone-100 mt-3 mb-6">
            The Artisan Hearth Oven
          </h2>
          <p className="text-stone-400 font-light text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome inside Riverè. Smell the freshly baked 72-hour sourdough, blistering in our 500°F stone hearth oven.
          </p>
        </div>
      </section>
    </main>
  );
}
