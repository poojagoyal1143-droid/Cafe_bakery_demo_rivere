'use client';

/**
 * Riverè Cafe & Bakery - Cinematic Brand Footer & Legal Compliance Layer
 * File: components/footer/SiteFooter.tsx
 * Description: Dawn Dispatch newsletter signup, 4-column brand layout, smooth navigation, and modal compliance dialogs (Privacy, Terms, Cookies).
 */

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Cookie,
  X,
  Camera,
  Flame,
} from 'lucide-react';

export function SiteFooter() {
  // Newsletter State
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Legal Modals State
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean>(true);
  const [cookieSaved, setCookieSaved] = useState<boolean>(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }, 800);
  };

  const handleSaveCookiePreferences = () => {
    setCookieSaved(true);
    setTimeout(() => {
      setCookieSaved(false);
      setActiveLegalModal(null);
    }, 1200);
  };

  return (
    <footer className="relative w-full bg-[#080707] text-stone-300 pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-amber-500/20 select-none overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-amber-600/30" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* 1. TOP BAND: "THE DAWN DISPATCH" NEWSLETTER SIGNUP */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-stone-900/90 to-stone-950 border border-amber-500/30 p-8 sm:p-12 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Morning Bakes Newsletter</span>
            </div>
            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-amber-100 font-bold mb-2">
              The Dawn Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Receive secret off-menu hearth drops, weekend tasting menus, and morning pastry schedules delivered to your inbox every Thursday.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors pr-36"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Sparkles className="w-4 h-4 animate-spin text-stone-950" />
                    ) : (
                      <>
                        <span>Join Dispatch</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-400 px-2">{emailError}</p>
                )}
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>You are subscribed! Welcome to the morning hearth family.</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. CORE GRID (4 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-4 border-t border-stone-800/80">
          {/* Col 1: Brand Logotype & Social (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif-luxury text-3xl font-bold text-amber-100 tracking-tight amber-glow-text">
              Riverè
            </h2>
            <p className="text-xs text-amber-400/90 font-medium uppercase tracking-[0.25em]">
              Boulangerie & Café &bull; Paris 1er
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Artisan stone-ground sourdough, 27-layer butter laminations, and slow-filtered espresso crafted with uncompromising French tradition.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors text-xs font-bold"
                aria-label="Pinterest"
              >
                Pinterest
              </a>
            </div>
          </div>

          {/* Col 2: Hours & Hearth Drops (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Hours & Hearth Drops</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-stone-300 font-light">
              <li className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-900">
                <span className="font-semibold text-stone-100 block">Tuesday – Friday</span>
                <span className="text-stone-400">7:00 AM – 3:00 PM</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">
                  &bull; Sourdough Drop: 8:00 AM
                </span>
              </li>

              <li className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-900">
                <span className="font-semibold text-stone-100 block">Saturday – Sunday</span>
                <span className="text-stone-400">8:00 AM – 4:00 PM</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">
                  &bull; Viennoiserie Drop: 8:30 AM
                </span>
              </li>

              <li className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-900 text-stone-500">
                <span className="font-semibold text-rose-300/80 block">Monday</span>
                <span>Closed for hearth maintenance</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Sanctuary & Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Sanctuary & Contact</span>
            </h4>

            <ul className="space-y-3 text-xs text-stone-300 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-100">Riverè Café & Bakery</p>
                  <p className="text-stone-400">14 Rue de la Paix, Heritage District</p>
                  <p className="text-stone-400">75001 Paris, France</p>
                </div>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:bonjour@rivere-cafe.com" className="hover:text-amber-300 transition-colors">
                  bonjour@rivere-cafe.com
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+33142685500" className="hover:text-amber-300 transition-colors">
                  +33 (0)1 42 68 55 00
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Navigation (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
              Navigation
            </h4>

            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#street-walkthrough" className="hover:text-amber-300 transition-colors">
                  01. The Entrance
                </a>
              </li>
              <li>
                <a href="#hearth-section" className="hover:text-amber-300 transition-colors">
                  02. Stone Hearth
                </a>
              </li>
              <li>
                <a href="#menu-section" className="hover:text-amber-300 transition-colors">
                  03. Bakery Menu
                </a>
              </li>
              <li>
                <a href="#reservation-section" className="hover:text-amber-300 transition-colors">
                  04. Table Seating
                </a>
              </li>
              <li>
                <a href="#recipes-section" className="hover:text-amber-300 transition-colors">
                  05. Baker's Journal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. LEGAL & COMPLIANCE FOOTER BAR */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 Riverè Boulangerie. Crafted with organic stone-ground heritage grains.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-stone-300 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-stone-300 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveLegalModal('cookies')}
              className="hover:text-stone-300 transition-colors flex items-center gap-1"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Cookie Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. COMPLIANCE MODALS */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PRIVACY POLICY */}
            {activeLegalModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-amber-100">
                    Privacy Policy
                  </h3>
                </div>
                <div className="text-xs text-stone-300 space-y-3 leading-relaxed">
                  <p>
                    At Riverè Boulangerie & Café, we honor your privacy with the same integrity we bring to our sourdough.
                  </p>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    1. Data Collection & Use
                  </h4>
                  <p>
                    We collect personal details (Name, Email, Phone Number) strictly for completing table reservations and processing bakery preorders. Your information is encrypted using Row Level Security (RLS) via Supabase.
                  </p>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    2. Third-Party Sharing
                  </h4>
                  <p>
                    We NEVER sell, trade, or rent visitor data to third-party advertisers. All customer records remain secure in our encrypted infrastructure.
                  </p>
                </div>
              </div>
            )}

            {/* TERMS OF SERVICE */}
            {activeLegalModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-amber-100">
                    Terms of Service
                  </h3>
                </div>
                <div className="text-xs text-stone-300 space-y-3 leading-relaxed">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    1. Reservation Policy
                  </h4>
                  <p>
                    Table reservations are held for up to 15 minutes past the scheduled time slot. Cancellations or modifications must be submitted at least 2 hours prior to seating.
                  </p>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    2. Allergen Notice
                  </h4>
                  <p>
                    Our hearth bakery handles gluten, dairy, tree nuts, and eggs. While we follow strict sanitization protocols, cross-contact with flour dust may occur.
                  </p>
                </div>
              </div>
            )}

            {/* COOKIE PREFERENCES */}
            {activeLegalModal === 'cookies' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-amber-400" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-amber-100">
                    Cookie Preferences
                  </h3>
                </div>
                <div className="text-xs text-stone-300 space-y-4">
                  <p>
                    We use strictly essential functional cookies to maintain your active cart session, remember theme preferences, and save table reservation states.
                  </p>

                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-100">Essential Functional Cookies</p>
                      <p className="text-[10px] text-stone-400">Required for session state & reservation processing.</p>
                    </div>
                    <button
                      onClick={() => setCookiesEnabled(!cookiesEnabled)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        cookiesEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {cookiesEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {cookieSaved && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Cookie preferences updated successfully.</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveCookiePreferences}
                    className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
