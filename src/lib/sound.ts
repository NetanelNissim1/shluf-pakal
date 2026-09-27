/**
 * Web Audio API synthesizer for zero-dependency outdoor sound effects
 * Operates 100% offline without needing any external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context not allowed without prior user interaction
  }
}

export function playTimerTick(): void {
  playTone(880, 0.05, 'triangle', 0.15);
}

export function playWarningTick(): void {
  playTone(1200, 0.08, 'sawtooth', 0.25);
}

export function playTimerEnd(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => {
      playTone(note, 0.25, 'sine', 0.3);
    }, index * 120);
  });
}

export function playSuccess(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(587.33, 0.1, 'sine', 0.2); // D5
  setTimeout(() => {
    playTone(880.00, 0.2, 'sine', 0.25); // A5
  }, 100);
}

export function playPass(): void {
  playTone(320, 0.15, 'sawtooth', 0.15);
}

export function playShuffle(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freqs = [350, 480, 620, 800];
    freqs.forEach((f, idx) => {
      setTimeout(() => playTone(f, 0.06, 'triangle', 0.12), idx * 40);
    });
  } catch {
    //
  }
}
