'use client';

/**
 * Riverè Cafe & Bakery - Scene 4: The Bistro Table & Interactive Reservation System
 * File: components/reservation/BistroTable.tsx
 * Description: Immersive Parisian bistro table seating reservation system connected to Supabase backend & Zod pre-validation.
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarPlus,
  RotateCcw,
  Utensils,
  Phone,
  Mail,
  User,
  Heart,
} from 'lucide-react';

import { createReservationAction } from '@/lib/actions/reservations';
import type { ReservationInsertInput } from '@/lib/validations/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimeSlotOption {
  id: string;
  label: string;
  period: string;
  timeValue: string;
  badge: string;
}

const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  {
    id: 'slot-morning',
    label: 'Morning Hearth',
    period: '8:00 AM – 11:30 AM',
    timeValue: '09:00:00',
    badge: 'Fresh Croissants',
  },
  {
    id: 'slot-afternoon',
    label: 'Afternoon Tea',
    period: '12:00 PM – 3:30 PM',
    timeValue: '13:30:00',
    badge: 'High Tea & Tarts',
  },
  {
    id: 'slot-sunset',
    label: 'Sunset Boulangerie',
    period: '4:00 PM – 7:00 PM',
    timeValue: '17:30:00',
    badge: 'Warm Sourdough',
  },
];

export function BistroTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const candleGlowRef = useRef<HTMLDivElement>(null);

  // Form input state
  const todayISO = new Date().toISOString().split('T')[0];
  const maxDateISO = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [partySize, setPartySize] = useState<number>(2);
  const [reservationDate, setReservationDate] = useState<string>(todayISO);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption>(TIME_SLOT_OPTIONS[1]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined);
  const [confirmationData, setConfirmationData] = useState<{
    id: string;
    bookingCode: string;
    customer_name: string;
    reservation_date: string;
    reservation_time: string;
    party_size: number;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // 1. GSAP SCROLL ANIMATION & CANDLE FLICKER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Candle glow ambient flicker
      if (candleGlowRef.current) {
        gsap.to(candleGlowRef.current, {
          opacity: 0.85,
          scale: 1.15,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Scroll trigger fade-up reveal for reservation card
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---------------------------------------------------------------------------
  // 2. FORM SUBMISSION HANDLER
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors(undefined);
    setIsSubmitting(true);

    const payload: ReservationInsertInput = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      reservation_date: reservationDate,
      reservation_time: selectedSlot.timeValue,
      party_size: partySize,
      special_requests: specialRequests || null,
      status: 'pending',
    };

    try {
      const response = await createReservationAction(payload);

      if (!response.success) {
        setServerError(response.error || 'Failed to complete table reservation.');
        setFieldErrors(response.fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Generate reference code
      const codeNumber = Math.floor(1000 + Math.random() * 9000);
      const bookingCode = `#RIV-${codeNumber}`;

      setConfirmationData({
        id: (response.data as any)?.id || `res_${codeNumber}`,
        bookingCode,
        customer_name: customerName,
        reservation_date: reservationDate,
        reservation_time: selectedSlot.period,
        party_size: partySize,
      });

      setIsSubmitting(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error. Please try again.';
      setServerError(message);
      setIsSubmitting(false);
    }
  };

  // Reset reservation form to book another table
  const handleReset = () => {
    setConfirmationData(null);
    setServerError(null);
    setFieldErrors(undefined);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSpecialRequests('');
    setPartySize(2);
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = () => {
    if (!confirmationData) return '#';
    const title = encodeURIComponent('Table Reservation at Riverè Boulangerie & Café');
    const details = encodeURIComponent(
      `Table reservation for ${confirmationData.party_size} guest(s) under ${confirmationData.customer_name}. Reference Code: ${confirmationData.bookingCode}`
    );
    const location = encodeURIComponent('Riverè Cafe & Bakery, 14 Rue de la Paix, Paris');
    const dateFormatted = confirmationData.reservation_date.replace(/-/g, '');
    const dates = `${dateFormatted}T120000Z/${dateFormatted}T140000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <section
      id="reservation-section"
      ref={containerRef}
      className="relative min-h-screen w-full bg-stone-950 text-stone-100 py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden select-none"
      aria-label="Scene 4: Bistro Table & Reservation System"
    >
      {/* 1. BACKGROUND BISTRO TABLE IMAGE */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/bistro-table.jpeg"
          alt="Intimate Parisian Bistro Table with linen and candles"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.65] contrast-[1.1]"
        />
        {/* Dark vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/85" />
        <div className="absolute inset-0 radial-vignette pointer-events-none" />
      </div>

      {/* 2. AMBIENT CANDLE LIGHT FLICKER OVERLAY */}
      <div
        ref={candleGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(226,168,85,0.4) 0%, rgba(196,109,59,0.18) 50%, transparent 80%)',
        }}
      />

      {/* 3. SCENE NARRATIVE HEADER */}
      <header className="relative z-10 text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/30 backdrop-blur-md mb-3 shadow-lg">
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium">
            Scene 4 &bull; Table Seating
          </span>
        </div>

        <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-amber-100 font-semibold tracking-tight amber-glow-text mb-3">
          An Intimate Table Awaits
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light tracking-wide max-w-lg mx-auto">
          Reserve your morning tasting or weekend afternoon tea by the window. Seating for up to 8 guests per table.
        </p>
      </header>

      {/* 4. RESERVATION FORM CARD OR CONFIRMATION TICKET */}
      <div
        ref={cardRef}
        className="relative z-20 w-full max-w-2xl transform-gpu will-change-transform"
      >
        {!confirmationData ? (
          /* FORM STATE */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#1A1412]/85 border border-amber-500/30 backdrop-blur-xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
          >
            {/* Global Error Banner */}
            {serverError && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            {/* 4.1 PARTY SIZE SELECTOR (1 - 8 Guests) */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-300/90 font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Select Party Size (Guests)</span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setPartySize(size)}
                    className={`py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 border ${
                      partySize === size
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_15px_rgba(226,168,85,0.6)] scale-105'
                        : 'bg-stone-950/60 text-stone-300 border-stone-800 hover:border-amber-500/40 hover:text-amber-200'
                    }`}
                  >
                    {size} {size === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4.2 DATE & TIME SLOT SELECTOR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-300/90 font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Reservation Date</span>
                </label>
                <input
                  type="date"
                  min={todayISO}
                  max={maxDateISO}
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                {fieldErrors?.reservation_date && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.reservation_date[0]}</p>
                )}
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-300/90 font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Seating Time Slot</span>
                </label>
                <div className="space-y-2">
                  {TIME_SLOT_OPTIONS.map((slot) => (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full px-3.5 py-2 rounded-xl text-left border flex items-center justify-between transition-all duration-300 ${
                        selectedSlot.id === slot.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(226,168,85,0.25)]'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-stone-200">{slot.label}</p>
                        <p className="text-[10px] text-stone-400">{slot.period}</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-300">
                        {slot.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4.3 CUSTOMER CONTACT DETAILS */}
            <div className="space-y-4 pt-2 border-t border-stone-800/80">
              {/* Name Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Genevieve Laurent"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                {fieldErrors?.customer_name && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.customer_name[0]}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="genevieve@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {fieldErrors?.customer_email && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.customer_email[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {fieldErrors?.customer_phone && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.customer_phone[0]}</p>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Special Requests (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Anniversary, window seating preference, dietary allergies..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* 4.4 SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 text-stone-950 font-bold text-sm uppercase tracking-wider hover:bg-amber-400 shadow-[0_0_35px_rgba(226,168,85,0.5)] hover:shadow-[0_0_55px_rgba(226,168,85,0.8)] transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-stone-950" />
                  <span>Reserving Your Table...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-stone-950" />
                  <span>Confirm Table Booking</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* 5. GOLD-FOILED CONFIRMATION TICKET STATE */
          <div className="rounded-3xl bg-gradient-to-br from-amber-950/80 via-stone-900/95 to-stone-950 border-2 border-amber-500/60 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(226,168,85,0.3)] text-center animate-fade-in relative overflow-hidden">
            {/* Top Badge */}
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-4 shadow-xl">
              <CheckCircle2 className="w-8 h-8 text-amber-400" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.35em] text-amber-300 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Reservation Confirmed
            </span>

            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-amber-100 font-bold mt-3 mb-1 amber-glow-text">
              Merci, {confirmationData.customer_name}!
            </h3>

            <p className="text-xs text-stone-300 font-light mb-6">
              Your intimate table has been secured. A confirmation email has been dispatched.
            </p>

            {/* Ticket Information Card */}
            <div className="rounded-2xl bg-stone-950/70 border border-amber-500/30 p-6 mb-6 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                  Booking Reference
                </span>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {confirmationData.bookingCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-stone-400 uppercase tracking-wider">Date</p>
                  <p className="font-semibold text-stone-100 mt-0.5">
                    {confirmationData.reservation_date}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 uppercase tracking-wider">Time Slot</p>
                  <p className="font-semibold text-stone-100 mt-0.5">
                    {confirmationData.reservation_time}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 uppercase tracking-wider">Party Size</p>
                  <p className="font-semibold text-stone-100 mt-0.5">
                    {confirmationData.party_size} Guests
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 uppercase tracking-wider">Status</p>
                  <p className="font-semibold text-emerald-400 mt-0.5">Confirmed</p>
                </div>
              </div>
            </div>

            {/* Ticket Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <CalendarPlus className="w-4 h-4 text-stone-950" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-stone-100 hover:border-amber-500/40 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Book Another Table</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
