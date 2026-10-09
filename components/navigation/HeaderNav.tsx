'use client';

/**
 * Riverè Cafe & Bakery - Global Floating Header Navigation
 * File: components/navigation/HeaderNav.tsx
 * Description: Translucent dark glassmorphic navigation header with dynamic scroll-fade, active section indicator, and mobile drawer.
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Utensils, BookOpen, Flame, Home, Calendar } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Entrance', href: '#street-walkthrough', icon: Home },
  { label: 'The Hearth', href: '#hearth-section', icon: Flame },
  { label: 'Menu', href: '#menu-section', icon: Utensils },
  { label: 'Reserve', href: '#reservation-section', icon: Calendar },
  { label: 'Journal', href: '#recipes-section', icon: BookOpen },
];

export function HeaderNav() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('#street-walkthrough');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Scroll listener for Navbar Fade-In & Active Section Tracker
  useEffect(() => {
    const handleScroll = () => {
      // Fade in header after scrolling past 150px threshold
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Track active section based on scroll position
      const sectionIds = ['street-walkthrough', 'hearth-section', 'menu-section', 'reservation-section', 'recipes-section'];
      const scrollPosition = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${sectionIds[i]}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (href === '#street-walkthrough') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform-gpu ${
        isVisible
          ? 'translate-y-0 opacity-100 backdrop-blur-md bg-stone-950/50 border-b border-amber-900/20 shadow-2xl'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* LEFT: BRAND EMBLEM & LOGO */}
        <a
          href="#street-walkthrough"
          onClick={(e) => handleNavClick(e, '#street-walkthrough')}
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-2xl font-bold tracking-tight text-amber-100 amber-glow-text leading-none">
              Riverè
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400/80 font-medium">
              Boulangerie
            </span>
          </div>
        </a>

        {/* CENTER/RIGHT: DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-stone-900/70 border border-stone-800/80 backdrop-blur-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-2 rounded-full text-xs font-serif-luxury font-medium transition-all duration-300 flex items-center gap-2 relative ${
                  isActive
                    ? 'text-amber-100 bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(226,168,85,0.3)]'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[1px]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: CTA BUTTON */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#reservation-section"
            onClick={(e) => handleNavClick(e, '#reservation-section')}
            className="px-5 py-2.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(226,168,85,0.4)] hover:shadow-[0_0_30px_rgba(226,168,85,0.7)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Reserve Table
          </a>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 hover:text-amber-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-amber-500/20 bg-stone-950/95 backdrop-blur-2xl px-6 py-8 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`p-3.5 rounded-2xl text-sm font-serif-luxury font-medium transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-100'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#E2A855]" />}
                </a>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-800">
            <a
              href="#reservation-section"
              onClick={(e) => handleNavClick(e, '#reservation-section')}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider text-center block shadow-lg"
            >
              Reserve a Table
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
