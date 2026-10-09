'use client';

/**
 * Riverè Cafe & Bakery - Spatial Soundscape Manager & French Cafe Piano Audio
 * File: components/audio/SoundscapeManager.tsx
 * Description: Relaxing French bakery solo piano music (Erik Satie style), 0.25 volume, 1.5s fade-in, 1.0s fade-out, and brass shop door chime SFX.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface SoundscapeManagerProps {
  scrollProgress?: number;
}

// Public Domain French Vintage Solo Piano Track (Gymnopédie No. 1)
const PIANO_AUDIO_URL = 'https://upload.wikimedia.org/wikipedia/commons/3/34/Erik_Satie_-_gymnopedie_no_1.mp3';

const TARGET_PIANO_VOLUME = 0.25;
const FADE_IN_SECONDS = 1.5;
const FADE_OUT_SECONDS = 1.0;

// Global references for external triggers
let globalDoorChimeTrigger: (() => void) | null = null;

export function triggerDoorChime() {
  if (globalDoorChimeTrigger) {
    globalDoorChimeTrigger();
  }
}

export function SoundscapeManager({ scrollProgress = 0 }: SoundscapeManagerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pianoGainNodeRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const isSynthesizerFallbackRef = useRef<boolean>(false);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // 1. INITIALIZE WEB AUDIO ENGINE & PIANO AUDIO TRACK
  // ---------------------------------------------------------------------------
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Piano Gain (Starts at 0 for smooth 1.5s fade-in)
      const pianoGain = ctx.createGain();
      pianoGain.gain.setValueAtTime(0, ctx.currentTime);
      pianoGain.connect(masterGain);
      pianoGainNodeRef.current = pianoGain;

      // Create HTML5 Audio Element for Piano MP3
      const audio = new Audio();
      audio.src = PIANO_AUDIO_URL;
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 1.0; // Volume controlled via Web Audio GainNode
      audioElemRef.current = audio;

      try {
        const source = ctx.createMediaElementSource(audio);
        source.connect(pianoGain);
        mediaElementSourceRef.current = source;
      } catch (err) {
        console.warn('[Riverè Audio]: MediaElementAudioSource cross-origin fallback active.', err);
      }

      setIsAudioInitialized(true);
      return ctx;
    } catch (err) {
      console.warn('[Riverè Audio Engine Notice]: Web Audio API unavailable in current environment.', err);
      return null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2. UNLOCK AUDIO ON FIRST USER INTERACTION (BROWSER AUTOPLAY POLICY)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unlockAudioContext = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().then(() => {
          console.log('[Riverè Audio]: AudioContext unlocked via user interaction.');
        });
      }
    };

    window.addEventListener('click', unlockAudioContext, { capture: true, once: true });
    window.addEventListener('touchstart', unlockAudioContext, { capture: true, once: true });
    window.addEventListener('keydown', unlockAudioContext, { capture: true, once: true });

    return () => {
      window.removeEventListener('click', unlockAudioContext, { capture: true });
      window.removeEventListener('touchstart', unlockAudioContext, { capture: true });
      window.removeEventListener('keydown', unlockAudioContext, { capture: true });
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. SYNTHESIZED BRASS SHOP DOOR CHIME SFX
  // ---------------------------------------------------------------------------
  const playBrassDoorChime = useCallback(() => {
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = initAudioEngine();
    }
    if (!ctx || !masterGainRef.current) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => console.log('[Audio] Door Chime Resumed AudioContext'));
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

  useEffect(() => {
    globalDoorChimeTrigger = playBrassDoorChime;
    return () => {
      globalDoorChimeTrigger = null;
    };
  }, [playBrassDoorChime]);

  // ---------------------------------------------------------------------------
  // 4. PROCEDURAL VINTAGE FRENCH PIANO SYNTHESIZER FALLBACK (PURE SINE CHORDS)
  // ---------------------------------------------------------------------------
  const startPianoSynthFallback = useCallback(() => {
    if (!audioCtxRef.current || !pianoGainNodeRef.current) return;

    // Gentle Erik Satie style chord progression (Dmaj7, Gmaj7, F#m7, Bm7)
    const chords = [
      [293.66, 370.0, 440.0, 554.37], // Dmaj7
      [196.0, 246.94, 293.66, 370.0], // Gmaj7
      [185.0, 220.0, 277.18, 370.0],  // F#m7
      [246.94, 293.66, 370.0, 440.0], // Bm7
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!audioCtxRef.current || !pianoGainNodeRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const chord = chords[chordIdx % chords.length];

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);

        noteGain.gain.setValueAtTime(0.08, now + i * 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 3.5);

        osc.connect(noteGain);
        noteGain.connect(pianoGainNodeRef.current!);

        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 3.8);
      });

      chordIdx++;
      synthTimerRef.current = setTimeout(playNextChord, 4200);
    };

    playNextChord();
  }, []);

  // ---------------------------------------------------------------------------
  // 5. SMOOTH 1.5s FADE-IN & 1.0s FADE-OUT CONTROLS (TARGET VOLUME 0.25)
  // ---------------------------------------------------------------------------
  const fadeInPiano = (ctx: AudioContext, targetVol = TARGET_PIANO_VOLUME) => {
    if (!pianoGainNodeRef.current) return;
    const now = ctx.currentTime;
    pianoGainNodeRef.current.gain.cancelScheduledValues(now);
    pianoGainNodeRef.current.gain.setValueAtTime(pianoGainNodeRef.current.gain.value, now);
    pianoGainNodeRef.current.gain.linearRampToValueAtTime(targetVol, now + FADE_IN_SECONDS);
  };

  const fadeOutPiano = (ctx: AudioContext, onComplete?: () => void) => {
    if (!pianoGainNodeRef.current) return;
    const now = ctx.currentTime;
    pianoGainNodeRef.current.gain.cancelScheduledValues(now);
    pianoGainNodeRef.current.gain.setValueAtTime(pianoGainNodeRef.current.gain.value, now);
    pianoGainNodeRef.current.gain.linearRampToValueAtTime(0.0001, now + FADE_OUT_SECONDS);

    if (onComplete) {
      setTimeout(onComplete, FADE_OUT_SECONDS * 1000 + 50);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. AUDIO PLAYBACK TOGGLE & BROWSER GESTURE POLICY
  // ---------------------------------------------------------------------------
  const toggleAudio = async () => {
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = initAudioEngine();
    }

    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (isPlaying) {
      // Fade-out piano & pause over 1.0s
      fadeOutPiano(ctx, () => {
        if (audioElemRef.current) audioElemRef.current.pause();
        if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
        setIsPlaying(false);
      });
    } else {
      // Fade-in piano over 1.5s to 0.25 volume
      fadeInPiano(ctx, TARGET_PIANO_VOLUME);
      if (audioElemRef.current) {
        audioElemRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log('[Audio] French Cafe Piano Initialized & Playing');
          })
          .catch((err) => {
            console.warn('[Riverè Audio]: MP3 stream restricted, activating piano synthesizer fallback.', err);
            isSynthesizerFallbackRef.current = true;
            startPianoSynthFallback();
            setIsPlaying(true);
            console.log('[Audio] French Cafe Piano Synthesizer Initialized & Playing');
          });
      } else {
        startPianoSynthFallback();
        setIsPlaying(true);
        console.log('[Audio] French Cafe Piano Synthesizer Initialized & Playing');
      }
    }
  };

  // Tab Visibility Protection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && audioCtxRef.current && audioCtxRef.current.state === 'running') {
        if (pianoGainNodeRef.current) {
          pianoGainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        }
        if (audioElemRef.current) audioElemRef.current.pause();
        if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
      if (fadeIntervalRef.current) clearTimeout(fadeIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="fixed top-24 right-6 z-40 select-none">
      <button
        onClick={toggleAudio}
        className={`group px-4 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 shadow-xl ${
          isPlaying
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_25px_rgba(226,168,85,0.4)] scale-105'
            : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40'
        }`}
        aria-label="Toggle French Cafe Solo Piano Music"
      >
        {isPlaying ? (
          <>
            <Music className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex items-end gap-0.5 h-3.5 px-0.5">
              <span className="w-0.5 bg-amber-400 rounded-full h-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-0.5 bg-amber-400 rounded-full h-3/4 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-0.5 bg-amber-400 rounded-full h-full animate-bounce" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold">French Cafe Piano On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-300">Play French Piano</span>
          </>
        )}
      </button>
    </div>
  );
}
