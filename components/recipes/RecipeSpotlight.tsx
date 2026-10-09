'use client';

/**
 * Riverè Cafe & Bakery - Scene 5: The Recipe Spotlight
 * File: components/recipes/RecipeSpotlight.tsx
 * Description: Interactive Baker's Journal showcasing signature recipes, temperature/hydration metrics, process timelines, and downloadable formula modals.
 */

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Clock,
  Flame,
  Droplets,
  Printer,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Thermometer,
  Layers,
  Scale,
  Share2,
} from 'lucide-react';

import { FALLBACK_RECIPES, FormattedRecipe } from '@/lib/data/recipes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Extra metadata per recipe for baker's metrics
const RECIPE_METRICS: Record<
  string,
  {
    hydration: string;
    targetTempC: number;
    targetTempF: number;
    fermentationHours: string;
    difficultyBadge: string;
    bakersPercentages: { ingredient: string; percentage: string }[];
  }
> = {
  'rustic-country-sourdough': {
    hydration: '78%',
    targetTempC: 260,
    targetTempF: 500,
    fermentationHours: '36 hrs',
    difficultyBadge: 'Master Artisan',
    bakersPercentages: [
      { ingredient: 'Bread Flour (12.7% protein)', percentage: '80.0%' },
      { ingredient: 'Whole Wheat Heritage Flour', percentage: '20.0%' },
      { ingredient: 'Filtered Water', percentage: '78.0%' },
      { ingredient: 'Active Levain', percentage: '20.0%' },
      { ingredient: 'Fine Sea Salt', percentage: '2.0%' },
    ],
  },
  'basque-burnt-cheesecake': {
    hydration: '65%',
    targetTempC: 220,
    targetTempF: 425,
    fermentationHours: 'N/A (Bake & Chill)',
    difficultyBadge: 'Classic Bistro',
    bakersPercentages: [
      { ingredient: 'Full-Fat Cream Cheese', percentage: '100.0%' },
      { ingredient: 'Granulated Caster Sugar', percentage: '35.0%' },
      { ingredient: 'Heavy Cream (36% fat)', percentage: '40.0%' },
      { ingredient: 'Farm Fresh Eggs', percentage: '30.0%' },
      { ingredient: 'All-Purpose Flour', percentage: '3.0%' },
    ],
  },
  'dark-chocolate-croissant': {
    hydration: '56%',
    targetTempC: 200,
    targetTempF: 390,
    fermentationHours: '24 hrs',
    difficultyBadge: 'Grand Viennoiserie',
    bakersPercentages: [
      { ingredient: 'T55 French Pastry Flour', percentage: '100.0%' },
      { ingredient: 'Beurre de Tourage (84% fat)', percentage: '50.0%' },
      { ingredient: 'Milk & Water Hydro-Mix', percentage: '56.0%' },
      { ingredient: '70% Dark Belgian Chocolate', percentage: '30.0%' },
      { ingredient: 'Fresh Baker Yeast', percentage: '4.0%' },
    ],
  },
};

export function RecipeSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeRecipe: FormattedRecipe = FALLBACK_RECIPES[activeRecipeIndex] || FALLBACK_RECIPES[0];
  const metrics = RECIPE_METRICS[activeRecipe.slug] || RECIPE_METRICS['rustic-country-sourdough'];

  // GSAP scroll trigger for timeline reveal
  useEffect(() => {
    if (!containerRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeRecipeIndex]);

  const handlePrintFormula = () => {
    window.print();
  };

  const handleCopyFormula = () => {
    const text = `${activeRecipe.title} Formula\n------------------\n` +
      metrics.bakersPercentages.map(b => `${b.ingredient}: ${b.percentage}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section
      id="recipes-section"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0E0C0B] text-stone-100 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      aria-label="Scene 5: The Recipe Spotlight"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none opacity-30 bg-amber-600/20" />

      {/* 1. SCENE HEADER */}
      <header className="relative z-10 text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 backdrop-blur-md mb-4 shadow-lg">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium">
            The Baker's Journal
          </span>
        </div>

        <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-amber-100 font-semibold tracking-tight amber-glow-text mb-4">
          Heritage Artisan Formulas
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light tracking-wide max-w-xl mx-auto">
          Time, temperature, and heritage grains. Explore our signature baking processes and baker's percentages.
        </p>
      </header>

      {/* 2. INTERACTIVE RECIPE TAB SWITCHER */}
      <div className="relative z-10 max-w-4xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 rounded-2xl bg-stone-950/80 border border-stone-800 backdrop-blur-xl">
          {FALLBACK_RECIPES.map((recipe, idx) => (
            <button
              key={recipe.id}
              onClick={() => setActiveRecipeIndex(idx)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 border ${
                activeRecipeIndex === idx
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_20px_rgba(226,168,85,0.5)] scale-[1.02]'
                  : 'bg-transparent text-stone-400 border-transparent hover:text-amber-200 hover:bg-stone-900/60'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeRecipeIndex === idx ? 'text-stone-950' : 'text-amber-400/70'}`} />
              <span>{recipe.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACTIVE RECIPE DISPLAY CARD */}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Image & Quick Specs */}
        <div className="lg:col-span-5 rounded-3xl bg-stone-950/70 border border-amber-500/25 p-6 backdrop-blur-xl shadow-2xl">
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 group">
            <Image
              src={activeRecipe.image_url}
              alt={activeRecipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-950/80 border border-amber-500/40 text-[10px] uppercase tracking-wider text-amber-300 font-bold backdrop-blur-md">
              {metrics.difficultyBadge}
            </span>
          </div>

          <h3 className="font-serif-luxury text-2xl text-amber-100 font-bold mb-2">
            {activeRecipe.title}
          </h3>
          <p className="text-xs text-stone-300 font-light leading-relaxed mb-6">
            {activeRecipe.excerpt}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Total</span>
              </div>
              <p className="text-xs font-bold text-stone-100">
                {activeRecipe.prep_time_minutes + activeRecipe.bake_time_minutes} mins
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Hydration</span>
              </div>
              <p className="text-xs font-bold text-stone-100">{metrics.hydration}</p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Hearth</span>
              </div>
              <p className="text-xs font-bold text-stone-100">
                {tempUnit === 'C' ? `${metrics.targetTempC}°C` : `${metrics.targetTempF}°F`}
              </p>
            </div>
          </div>

          {/* Temp Unit Toggle & Formula Modal Trigger */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider px-2">Unit:</span>
              <button
                onClick={() => setTempUnit('C')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  tempUnit === 'C' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  tempUnit === 'F' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                °F
              </button>
            </div>

            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold text-xs hover:bg-amber-500 hover:text-stone-950 transition-all flex items-center gap-2 shadow-lg"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>View Baker's Formula</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Process Step Timeline */}
        <div ref={timelineRef} className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Step-by-Step Baking Process</span>
            </h4>
            <span className="text-[10px] text-stone-400">{activeRecipe.instructions.length} Phases</span>
          </div>

          <div className="space-y-4">
            {activeRecipe.instructions.map((step) => (
              <div
                key={step.step_number}
                className="group relative rounded-2xl bg-stone-950/80 border border-stone-800/80 hover:border-amber-500/40 p-5 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-amber-400 font-bold text-sm flex-shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                    0{step.step_number}
                  </div>

                  <div className="flex-1">
                    <h5 className="font-serif-luxury text-lg text-amber-100 font-semibold mb-1 group-hover:text-amber-300 transition-colors">
                      {step.title}
                    </h5>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EXPANDABLE RECIPE BAKER'S FORMULA MODAL */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto print:bg-white print:text-black">
            {/* Close Button */}
            <button
              onClick={() => setIsFormulaModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Official Baker's Formula
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-amber-100">
                  {activeRecipe.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-300 mb-6">
              Standardized baker's percentages calculated against 100% total flour base for precise scaling.
            </p>

            {/* Baker's Percentage Table */}
            <div className="rounded-2xl border border-stone-800 overflow-hidden mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-amber-300 uppercase tracking-wider font-mono border-b border-stone-800">
                  <tr>
                    <th className="p-3">Ingredient Item</th>
                    <th className="p-3 text-right">Scaled Weight</th>
                    <th className="p-3 text-right">Baker's %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200">
                  {activeRecipe.ingredients.map((ing, i) => {
                    const pctMatch = metrics.bakersPercentages.find(b => b.ingredient.includes(ing.item.split(' ')[0])) || metrics.bakersPercentages[i];
                    return (
                      <tr key={i} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-3 font-medium">{ing.item}</td>
                        <td className="p-3 text-right font-mono text-amber-200">
                          {ing.quantity} {ing.unit}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-amber-400">
                          {pctMatch?.percentage || '100%'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800 print:hidden">
              <button
                onClick={handleCopyFormula}
                className="px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold hover:border-amber-500/40 hover:text-stone-100 transition-all flex items-center gap-2"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Formula Copied!' : 'Copy Formula'}</span>
              </button>

              <button
                onClick={handlePrintFormula}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-stone-950" />
                <span>Print Formula Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
