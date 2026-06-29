export class SoundEngine {
  private ctx: AudioContext | null = null;
  private thrustSource: AudioBufferSourceNode | null = null;
  private thrustGain: GainNode | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ── Continuous thrust rumble ──────────────────────────────────────────────

  startThrust() {
    if (this.thrustSource) return;
    const ctx = this.getCtx();

    // White noise buffer (0.5 s, looped)
    const rate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, rate * 0.5, rate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 180;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.06);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();

    this.thrustSource = src;
    this.thrustGain = gain;
  }

  stopThrust() {
    if (!this.thrustSource || !this.thrustGain) return;
    const ctx = this.getCtx();
    this.thrustGain.gain.setValueAtTime(this.thrustGain.gain.value, ctx.currentTime);
    this.thrustGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    const src = this.thrustSource;
    setTimeout(() => { try { src.stop(); src.disconnect(); } catch (_) { /* already stopped */ } }, 100);
    this.thrustSource = null;
    this.thrustGain = null;
  }

  // ── One-shot sound effects ────────────────────────────────────────────────

  playLand() {
    // Two-note descending blip
    this.tone(440, 0.05, 'square', 0.25);
    this.tone(220, 0.07, 'square', 0.25, 0.06);
  }

  playCrash() {
    const ctx = this.getCtx();
    const rate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, rate * 0.7, rate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.7);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.7);
  }

  playBoard() {
    // Rising two-note chirp: D → F#
    this.tone(294, 0.07, 'square', 0.28);
    this.tone(370, 0.09, 'square', 0.28, 0.08);
  }

  playDeliver() {
    // Happy arpeggio: C E G C'
    const notes = [262, 330, 392, 524];
    notes.forEach((f, i) => this.tone(f, 0.09, 'square', 0.3, i * 0.09));
  }

  playLevelComplete() {
    // Fanfare: C E G C' E' G'
    const notes = [262, 330, 392, 524, 659, 784];
    notes.forEach((f, i) => this.tone(f, 0.13, 'square', 0.35, i * 0.11));
  }

  // ── Internal helper ───────────────────────────────────────────────────────

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delaySeconds = 0,
  ) {
    const ctx = this.getCtx();
    const t = ctx.currentTime + delaySeconds;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }
}
