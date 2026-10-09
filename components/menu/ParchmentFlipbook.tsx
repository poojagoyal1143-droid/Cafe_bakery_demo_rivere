'use client';

/**
 * Riverè Cafe & Bakery - Scene 3: The Parchment Flipbook Menu
 * File: components/menu/ParchmentFlipbook.tsx
 * Description: Interactive 3D French bakery parchment menu with page-turning physics, category bookmarks, and item preorder modal.
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Wheat,
  Coffee,
  PieChart,
  UtensilsCrossed,
} from 'lucide-react';

import { FALLBACK_MENU_ITEMS } from '@/lib/data/menu';
import type { MenuItem } from '@/lib/database.types';

interface MenuChapter {
  id: string;
  categoryName: string;
  frenchTitle: string;
  subtitle: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

export function ParchmentFlipbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookSpreadRef = useRef<HTMLDivElement>(null);
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);

  const [activeSpreadIndex, setActiveSpreadIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [preorderCount, setPreorderCount] = useState(0);
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  // Group items into 4 distinct spreads/chapters
  const chapters: MenuChapter[] = [
    {
      id: 'breads',
      categoryName: 'Artisan Breads',
      frenchTitle: 'Boulangerie',
      subtitle: 'Stone-milled heritage grains & 36-hr wild sourdoughs',
      icon: <Wheat className="w-4 h-4 text-amber-700" />,
      items: FALLBACK_MENU_ITEMS.filter((i) => i.category === 'breads'),
    },
    {
      id: 'viennoiserie',
      categoryName: 'Pastries & Croissants',
      frenchTitle: 'Viennoiserie',
      subtitle: '84% Normandy butter laminated into 27 shattered layers',
      icon: <UtensilsCrossed className="w-4 h-4 text-amber-700" />,
      items: FALLBACK_MENU_ITEMS.filter((i) => i.category === 'viennoiserie'),
    },
    {
      id: 'patisserie',
      categoryName: 'Pâtisserie & Cakes',
      frenchTitle: 'Desserts Fin',
      subtitle: 'Single-origin Valrhona chocolate, Tahitian vanilla & tartlets',
      icon: <PieChart className="w-4 h-4 text-amber-700" />,
      items: FALLBACK_MENU_ITEMS.filter((i) => i.category === 'patisserie'),
    },
    {
      id: 'beverages',
      categoryName: 'Specialty Coffee & Teas',
      frenchTitle: 'Café & Boissons',
      subtitle: 'Ethiopia Yirgacheffe roasts, Uji ceremonial matcha & cold brews',
      icon: <Coffee className="w-4 h-4 text-amber-700" />,
      items: FALLBACK_MENU_ITEMS.filter((i) => i.category === 'beverages'),
    },
  ];

  const currentChapter = chapters[activeSpreadIndex] || chapters[0];

  // ---------------------------------------------------------------------------
  // 1. GSAP 3D PAGE TURN ANIMATION
  // ---------------------------------------------------------------------------
  const flipToSpread = (targetIndex: number) => {
    if (targetIndex === activeSpreadIndex || isFlipping || targetIndex < 0 || targetIndex >= chapters.length) {
      return;
    }

    setIsFlipping(true);

    const isForward = targetIndex > activeSpreadIndex;
    const flippingPage = isForward ? rightPageRef.current : leftPageRef.current;

    if (!flippingPage) {
      setActiveSpreadIndex(targetIndex);
      setIsFlipping(false);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setActiveSpreadIndex(targetIndex);
          gsap.set(flippingPage, { rotateY: 0, opacity: 1, boxShadow: 'none' });
          setIsFlipping(false);
        },
      });

      tl.to(flippingPage, {
        rotateY: isForward ? -90 : 90,
        duration: 0.4,
        ease: 'power2.inOut',
        transformOrigin: isForward ? 'left center' : 'right center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      }).to(flippingPage, {
        rotateY: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      });
    }, bookSpreadRef);
  };

  // ---------------------------------------------------------------------------
  // 2. PREORDER MODAL & TOAST HANDLERS
  // ---------------------------------------------------------------------------
  const handleAddToCart = (item: MenuItem) => {
    setPreorderCount((prev) => prev + orderQuantity);
    setToastMessage(`Added ${orderQuantity}x ${item.title} to your preorder selection!`);
    setShowOrderToast(true);
    setSelectedItem(null);
    setOrderQuantity(1);

    setTimeout(() => {
      setShowOrderToast(false);
    }, 3500);
  };

  return (
    <section
      id="menu-section"
      ref={containerRef}
      className="relative min-h-screen w-full bg-stone-950 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center select-none overflow-hidden"
      aria-label="Scene 3: Parchment Flipbook Menu"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. SCENE HEADER */}
      <header className="text-center max-w-3xl mx-auto mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 backdrop-blur-md mb-3 shadow-lg">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium">
            Le Menu Artisan
          </span>
        </div>

        <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-amber-100 font-semibold tracking-tight amber-glow-text mb-3">
          The Parchment Menu
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light tracking-wide max-w-xl mx-auto">
          Explore our daily baking selection. Click any item to view ingredient breakdown, allergen profile, and reserve for pickup.
        </p>

        {/* Preorder Shopping Bag Counter Indicator */}
        {preorderCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-stone-950 font-medium text-xs shadow-lg animate-fade-in">
            <ShoppingBag className="w-4 h-4" />
            <span>{preorderCount} Items Reserved for Preorder</span>
          </div>
        )}
      </header>

      {/* 2. CATEGORY BOOKMARK TABS (SIDE EDGE NAVIGATION) */}
      <nav
        aria-label="Menu Category Chapters"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 z-20"
      >
        {chapters.map((chapter, idx) => {
          const isActive = idx === activeSpreadIndex;
          return (
            <button
              key={chapter.id}
              onClick={() => flipToSpread(idx)}
              disabled={isFlipping}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-[0_0_20px_rgba(226,168,85,0.5)] scale-105'
                  : 'bg-stone-900/80 text-stone-300 hover:text-amber-200 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md'
              }`}
            >
              {chapter.icon}
              <span>{chapter.categoryName}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. PARCHMENT FLIPBOOK SPREAD CONTAINER */}
      <div className="relative w-full max-w-5xl z-10 perspective-1400">
        {/* Leather/Linen Book Binding Frame */}
        <div
          ref={bookSpreadRef}
          className="relative w-full rounded-2xl p-3 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-amber-900/40 transform-style-3d overflow-hidden"
          style={{
            backgroundImage: "url('/assets/flipbook-cover.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Inner Parchment Double Page Spread */}
          <div className="relative w-full bg-[#f4eedd] text-stone-900 rounded-xl p-4 sm:p-8 md:p-10 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 min-h-[560px] border border-amber-800/30">
            {/* Center Spine Fold Shadow */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-stone-900/20 via-stone-900/40 to-stone-900/20 pointer-events-none z-20" />

            {/* LEFT PAGE (Category Overview & Story) */}
            <div
              ref={leftPageRef}
              className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-900/20 pb-6 md:pb-0 md:pr-8 transform-style-3d"
              style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-amber-900/20 pb-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-900/70 font-semibold">
                    Page 0{activeSpreadIndex * 2 + 1}
                  </span>
                  <span className="font-serif-luxury italic text-sm text-amber-950 font-semibold">
                    {currentChapter.frenchTitle}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-amber-950 font-bold mb-2">
                  {currentChapter.categoryName}
                </h3>

                <p className="text-xs text-amber-900/80 italic font-serif mb-6 leading-relaxed">
                  &ldquo;{currentChapter.subtitle}&rdquo;
                </p>

                {/* Primary Highlight Featured Item Card */}
                {currentChapter.items[0] && (
                  <div
                    onClick={() => setSelectedItem(currentChapter.items[0])}
                    className="cursor-pointer group relative rounded-xl bg-[#e9e2cb] border border-amber-800/30 p-4 mb-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={currentChapter.items[0].image_url}
                        alt={currentChapter.items[0].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-100 text-[10px] uppercase tracking-wider font-medium backdrop-blur-sm">
                        Signature
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-luxury text-xl font-bold text-amber-950 group-hover:text-amber-800">
                        {currentChapter.items[0].title}
                      </h4>
                      <span className="font-serif-luxury text-lg font-bold text-amber-900">
                        ${currentChapter.items[0].price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 font-light mt-1 line-clamp-2">
                      {currentChapter.items[0].description}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-900/60 font-medium">
                  Riverè Artisan Boulangerie &bull; Maison Fondée 2026
                </span>
              </div>
            </div>

            {/* RIGHT PAGE (Menu Item Line Items) */}
            <div
              ref={rightPageRef}
              className="flex flex-col justify-between md:pl-4 transform-style-3d"
              style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-amber-900/20 pb-3">
                  <span className="font-serif-luxury italic text-sm text-amber-950 font-semibold">
                    Selection Selectionne
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-900/70 font-semibold">
                    Page 0{activeSpreadIndex * 2 + 2}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {currentChapter.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group cursor-pointer p-3 rounded-lg hover:bg-[#e9e2cb]/80 border border-transparent hover:border-amber-800/30 transition-all duration-300"
                    >
                      <div className="flex items-baseline justify-between">
                        <h5 className="font-serif-luxury text-lg font-bold text-amber-950 group-hover:text-amber-800">
                          {item.title}
                        </h5>
                        <div className="flex-1 mx-3 border-b border-dotted border-amber-900/40" />
                        <span className="font-serif-luxury text-base font-bold text-amber-950">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 font-light mt-1">
                        {item.description}
                      </p>

                      {/* Allergens Badges */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.allergens.map((alg, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-amber-900/10 text-[9px] uppercase tracking-wider text-amber-900 font-medium"
                            >
                              Contains: {alg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Pagination Control Triggers */}
              <div className="flex items-center justify-between pt-6 border-t border-amber-900/20 mt-4">
                <button
                  onClick={() => flipToSpread(activeSpreadIndex - 1)}
                  disabled={activeSpreadIndex === 0 || isFlipping}
                  className="flex items-center gap-1 text-xs text-amber-900 font-medium disabled:opacity-30 hover:text-amber-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Spread</span>
                </button>

                <span className="text-xs text-amber-900/60 font-serif italic">
                  Spread {activeSpreadIndex + 1} of {chapters.length}
                </span>

                <button
                  onClick={() => flipToSpread(activeSpreadIndex + 1)}
                  disabled={activeSpreadIndex === chapters.length - 1 || isFlipping}
                  className="flex items-center gap-1 text-xs text-amber-900 font-medium disabled:opacity-30 hover:text-amber-700 transition-colors"
                >
                  <span>Next Spread</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ITEM PREORDER DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 border border-stone-800">
              <Image
                src={selectedItem.image_url}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              {selectedItem.category}
            </span>

            <h3 className="font-serif-luxury text-3xl font-bold text-amber-100 mt-2">
              {selectedItem.title}
            </h3>

            <p className="text-xl font-bold text-amber-300 font-serif mt-1">
              ${selectedItem.price.toFixed(2)}
            </p>

            <p className="text-xs text-stone-300 font-light mt-3 leading-relaxed">
              {selectedItem.description}
            </p>

            {/* Allergens Info */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                Allergen Profile
              </p>
              <p className="text-xs text-stone-300">
                {selectedItem.allergens && selectedItem.allergens.length > 0
                  ? selectedItem.allergens.join(', ')
                  : 'No major allergen warnings recorded.'}
              </p>
            </div>

            {/* Quantity Controls & Add to Preorder Button */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-stone-950 border border-stone-800">
                <button
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-stone-100 w-4 text-center">
                  {orderQuantity}
                </span>
                <button
                  onClick={() => setOrderQuantity(orderQuantity + 1)}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="flex-1 py-3 px-6 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-amber-400 shadow-[0_0_25px_rgba(226,168,85,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Reserve for Preorder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUCCESS TOAST NOTIFICATION */}
      {showOrderToast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-medium text-xs sm:text-sm shadow-2xl border border-amber-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-stone-950" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
