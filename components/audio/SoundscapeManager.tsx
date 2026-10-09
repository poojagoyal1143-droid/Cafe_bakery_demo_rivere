'use client';

/**
 * Riverè Cafe & Bakery - Spatial Soundscape Manager & Web Audio Synthesizer
 * File: components/audio/SoundscapeManager.tsx
 * Description: Procedural 3D Web Audio API engine generating ambient rain, fireplace crackle, and shop door chimes with dynamic scroll crossfading.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SoundscapeManagerProps {
  scrollProgress?: number;
}

// Global reference for external trigger (e.g. door click chime)
let globalDoorChimeTrigger: (() => void) | null = null;
let globalScrollProgressUpdater: ((progress: number) => void) | null = null;

export function triggerDoorChime() {
  if (globalDoorChimeTrigger) {
    globalDoorChimeTrigger();
  }
}

export function updateSoundscapeScroll(progress: number) {
  if (globalScrollProgressUpdater) {
    globalScrollProgressUpdater(progress);
  }
}

export function SoundscapeManager({ scrollProgress = 0 }: SoundscapeManagerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Gain Nodes
  const masterGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const crackleGainRef = useRef<GainNode | null>(null);

  // Noise Generators & Osc References
  const rainSourceRef = useRef<AudioNode | null>(null);
  const crackleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const lastChimeProgressRef = useRef<number>(0);

  // ---------------------------------------------------------------------------
  // 1. WEB AUDIO SYNTHESIS SETUP (RAIN & FIRE CRACKLE & BRASS CHIME)
  // ---------------------------------------------------------------------------
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.5, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Rain Gain Node
      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.8, ctx.currentTime);
      rainGain.connect(masterGain);
      rainGainRef.current = rainGain;

      // Fire Crackle Gain Node
      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.0, ctx.currentTime);
      crackleGain.connect(masterGain);
      crackleGainRef.current = crackleGain;

      // A. Create Rain Sound (Filtered Pink/White Noise Buffer)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1200, ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      whiteNoise.start();
      rainSourceRef.current = whiteNoise;

      // B. Create Fireplace Crackle (Procedural Random Impulses)
      const playCracklePop = () => {
        if (!audioCtxRef.current || !crackleGainRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const popGain = audioCtxRef.current.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);

        popGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(popGain);
        popGain.connect(crackleGainRef.current);

        osc.start(now);
        osc.stop(now + 0.05);

        const nextDelay = Math.random() * 180 + 40;
        crackleTimerRef.current = setTimeout(playCracklePop, nextDelay);
      };

      playCracklePop();
      setIsAudioInitialized(true);
      return ctx;
    } catch (err) {
      console.warn('[Riverè Audio Engine Notice]: Web Audio API unavailable in current environment.', err);
      return null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2. SYNTHESIZED BRASS SHOP DOOR CHIME SFX
  // ---------------------------------------------------------------------------
  const playBrassDoorChime = useCallback(() => {
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = initAudioEngine();
    }
    if (!ctx || !masterGainRef.current) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => console.log('[Audio] Initialized & Playing'));
    }

    const now = ctx.currentTime;
    const freqs = [659.25, 987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = ctx!.createOscillator();
      const chimeGain = ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      chimeGain.gain.setValueAtTime(0.35 / (idx + 1), now + idx * 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

      osc.connect(chimeGain);
      chimeGain.connect(masterGainRef.current!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.0);
    });
  }, [initAudioEngine]);

  // Register global triggers
  useEffect(() => {
    globalDoorChimeTrigger = playBrassDoorChime;
    return () => {
      globalDoorChimeTrigger = null;
    };
  }, [playBrassDoorChime]);

  // ---------------------------------------------------------------------------
  // 3. DYNAMIC SCROLL CROSSFADE LOGIC
  // ---------------------------------------------------------------------------
  const handleScrollProgress = useCallback((progress: number) => {
    if (!audioCtxRef.current || !rainGainRef.current || !crackleGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Street section (0 to 0.7 scrub): Rain 100% -> 15%, Crackle 0% -> 85%
    if (progress < 0.7) {
      const rainVol = 0.8 * (1 - (progress / 0.7) * 0.85);
      const crackleVol = (progress / 0.7) * 0.85;

      rainGainRef.current.gain.setTargetAtTime(rainVol, now, 0.2);
      crackleGainRef.current.gain.setTargetAtTime(crackleVol, now, 0.2);
    } else {
      // Threshold crossing (0.7 to 1.0)
      rainGainRef.current.gain.setTargetAtTime(0.12, now, 0.2);
      crackleGainRef.current.gain.setTargetAtTime(0.85, now, 0.2);

      // Trigger brass chime once on forward scroll threshold crossing
      if (lastChimeProgressRef.current < 0.7 && progress >= 0.7) {
        playBrassDoorChime();
      }
    }

    lastChimeProgressRef.current = progress;
  }, [playBrassDoorChime]);

  useEffect(() => {
    globalScrollProgressUpdater = handleScrollProgress;
    handleScrollProgress(scrollProgress);

    return () => {
      globalScrollProgressUpdater = null;
    };
  }, [scrollProgress, handleScrollProgress]);

  // ---------------------------------------------------------------------------
  // 4. BROWSER GESTURE POLICY & RESUME HANDLER
  // ---------------------------------------------------------------------------
  const toggleAudio = async () => {
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = initAudioEngine();
    }

    if (ctx) {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
          setIsPlaying(true);
          console.log('[Audio] Initialized & Playing');
        } else if (isPlaying) {
          await ctx.suspend();
          setIsPlaying(false);
        } else {
          await ctx.resume();
          setIsPlaying(true);
          console.log('[Audio] Initialized & Playing');
        }
      } catch (err) {
        console.warn('[Audio] Failed to toggle playback:', err);
      }
    }
  };

  // Pause audio when browser tab is hidden & handle gesture resume
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && audioCtxRef.current && audioCtxRef.current.state === 'running') {
        await audioCtxRef.current.suspend();
        setIsPlaying(false);
      }
    };

    const handleFirstUserInteraction = async () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        try {
          await audioCtxRef.current.resume();
          setIsPlaying(true);
          console.log('[Audio] Initialized & Playing');
        } catch (err) {
          console.warn('[Audio] First gesture resume caught:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      if (crackleTimerRef.current) {
        clearTimeout(crackleTimerRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed top-24 right-6 z-40 select-none">
      <button
        onClick={toggleAudio}
        className={`group px-3.5 py-2 rounded-full border backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 shadow-xl ${
          isPlaying
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(226,168,85,0.4)]'
            : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40'
        }`}
        aria-label="Toggle Spatial Audio Soundscape"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex items-end gap-0.5 h-3.5 px-0.5">
              <span className="w-0.5 bg-amber-400 rounded-full h-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-0.5 bg-amber-400 rounded-full h-3/4 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-0.5 bg-amber-400 rounded-full h-full animate-bounce" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold">Soundscape On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-300">Enable Sound</span>
          </>
        )}
      </button>
    </div>
  );
}
