import React from 'react';
import { StreetWalkthrough } from '@/components/hero/StreetWalkthrough';
import { HearthOven } from '@/components/hearth/HearthOven';
import { ParchmentFlipbook } from '@/components/menu/ParchmentFlipbook';
import { BistroTable } from '@/components/reservation/BistroTable';
import { RecipeSpotlight } from '@/components/recipes/RecipeSpotlight';
import { SiteFooter } from '@/components/footer/SiteFooter';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-stone-950 text-stone-100 overflow-x-hidden">
      {/* SCENE 1: THE RAINY STREET GSAP SCROLL WALKTHROUGH */}
      <StreetWalkthrough />

      {/* SCENE 2: THE ARTISAN HEARTH OVEN SHOWCASE */}
      <HearthOven />

      {/* SCENE 3: THE PARCHMENT FLIPBOOK MENU */}
      <ParchmentFlipbook />

      {/* SCENE 4: THE BISTRO TABLE & INTERACTIVE RESERVATION SYSTEM */}
      <BistroTable />

      {/* SCENE 5: THE RECIPE SPOTLIGHT & BAKER'S JOURNAL */}
      <RecipeSpotlight />

      {/* CINEMATIC BRAND FOOTER & LEGAL COMPLIANCE LAYER */}
      <SiteFooter />
    </main>
  );
}


