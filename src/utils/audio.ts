// Web Audio API synthesized tactical audio effects
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const isAudioEnabled = () => soundEnabled;

export const toggleAudioEnabled = (): boolean => {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('studynet_sound_enabled', JSON.stringify(soundEnabled));
  } catch (e) {}
  if (soundEnabled) {
    playTacticalChirp(true);
  }
  return soundEnabled;
};

export const initAudioSettings = () => {
  try {
    const saved = localStorage.getItem('studynet_sound_enabled');
    if (saved !== null) {
      soundEnabled = JSON.parse(saved);
    }
  } catch (e) {}
};

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a high-tech tactical HUD chirp for notifications or actions
 */
export function playTacticalChirp(
  freqOrForce: number | boolean = false,
  duration = 0.12,
  force = false
) {
  const isForce = typeof freqOrForce === 'boolean' ? freqOrForce : force;
  if (!soundEnabled && !isForce) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    const baseFreq = typeof freqOrForce === 'number' ? freqOrForce : 880;

    // Rising sweep
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + Math.min(duration * 0.7, 0.08));

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // Audio contexts might be blocked until user gesture, safely ignore
  }
}

/**
 * Play an urgent proximity alert sound (double tactical pulse)
 */
export function playUrgentAlertSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Pulse 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Pulse 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5
    gain2.gain.setValueAtTime(0.07, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.22);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * Play a light tactical click when acknowledging or dismissing
 */
export function playTacticalClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(1760, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {}
}
