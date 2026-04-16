// Sonidos sintéticos usando Web Audio API - sin archivos externos
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
  delay: number = 0
) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// Click suave para botones generales
export function playClick() {
  playTone(800, 0.05, 'square', 0.1);
}

// Sonido de victoria al seleccionar ganador (WIN)
export function playWin() {
  playTone(523, 0.1, 'sine', 0.2, 0);      // C5
  playTone(659, 0.1, 'sine', 0.2, 0.1);    // E5
  playTone(784, 0.15, 'sine', 0.25, 0.2);  // G5
}

// Sonido al generar bracket (power up)
export function playGenerate() {
  playTone(200, 0.1, 'sawtooth', 0.15, 0);
  playTone(300, 0.1, 'sawtooth', 0.15, 0.08);
  playTone(400, 0.1, 'sawtooth', 0.15, 0.16);
  playTone(600, 0.15, 'sawtooth', 0.2, 0.24);
  playTone(800, 0.2, 'sine', 0.25, 0.35);
}

// Sonido de reset/warning
export function playReset() {
  playTone(400, 0.15, 'square', 0.15, 0);
  playTone(300, 0.15, 'square', 0.15, 0.15);
  playTone(200, 0.2, 'square', 0.1, 0.3);
}

// Fanfarria de campeón
export function playChampion() {
  playTone(523, 0.15, 'sine', 0.2, 0);     // C5
  playTone(523, 0.15, 'sine', 0.2, 0.15);  // C5
  playTone(523, 0.15, 'sine', 0.2, 0.3);   // C5
  playTone(659, 0.2, 'sine', 0.25, 0.45);  // E5
  playTone(784, 0.15, 'sine', 0.2, 0.65);  // G5
  playTone(1047, 0.4, 'sine', 0.3, 0.8);   // C6
}

// Glitch para el easter egg
export function playHack() {
  for (let i = 0; i < 8; i++) {
    const freq = Math.random() * 2000 + 100;
    playTone(freq, 0.05, 'sawtooth', 0.08, i * 0.04);
  }
}

// Sonido de agregar equipo
export function playAdd() {
  playTone(600, 0.08, 'sine', 0.15, 0);
  playTone(900, 0.1, 'sine', 0.15, 0.06);
}

// Sonido de eliminar
export function playDelete() {
  playTone(500, 0.1, 'square', 0.1, 0);
  playTone(300, 0.15, 'square', 0.08, 0.1);
}
