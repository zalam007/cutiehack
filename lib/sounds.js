/**
 * Retro 64-bit style sound effect generator using Web Audio API
 * Creates synthetic sound effects without requiring audio files
 */

class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3; // Default volume (0-1)
  }

  // Initialize audio context (must be done after user interaction)
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Generic click sound (short blip)
  playClick() {
    this.init();
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  // Logo/Home navigation sound (ascending notes)
  playLogoClick() {
    this.init();
    const ctx = this.audioContext;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'square';

      const startTime = ctx.currentTime + index * 0.05;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.08);
    });
  }

  // Create/Success sound (upward sweep with sparkle)
  playCreate() {
    this.init();
    const ctx = this.audioContext;

    // Main sweep
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();

    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    oscillator1.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    oscillator1.type = 'triangle';

    gainNode1.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.3);

    // Sparkle on top
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    oscillator2.frequency.value = 1600;
    oscillator2.type = 'sine';

    gainNode2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
    gainNode2.gain.setValueAtTime(this.masterVolume * 0.2, ctx.currentTime + 0.16);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator2.start(ctx.currentTime + 0.15);
    oscillator2.stop(ctx.currentTime + 0.3);
  }

  // Delete/Negative sound (downward sweep)
  playDelete() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
  }

  // Tab switch / Navigation sound (soft blip)
  playTab() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }

  // Open modal sound (rising tone)
  playOpen() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  // Close modal sound (falling tone)
  playClose() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.1);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  // Hover sound (subtle high tone)
  playHover() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }

  // Error sound (buzzer)
  playError() {
    this.init();
    const ctx = this.audioContext;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 150;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  // Set master volume (0-1)
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create singleton instance
const soundGenerator = new SoundGenerator();

// Export easy-to-use functions
export const sounds = {
  click: () => soundGenerator.playClick(),
  logoClick: () => soundGenerator.playLogoClick(),
  create: () => soundGenerator.playCreate(),
  delete: () => soundGenerator.playDelete(),
  tab: () => soundGenerator.playTab(),
  open: () => soundGenerator.playOpen(),
  close: () => soundGenerator.playClose(),
  hover: () => soundGenerator.playHover(),
  error: () => soundGenerator.playError(),
  setVolume: (vol) => soundGenerator.setVolume(vol),
};

export default sounds;
