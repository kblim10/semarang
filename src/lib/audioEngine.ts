export type AmbientPreset = "cinematic" | "rain" | "midnight";

const BASE_VOLUME = 0.32;

/**
 * A small self-contained generative ambience engine built entirely on the
 * Web Audio API. No audio files are loaded - every soundscape is synthesized
 * on the fly out of oscillators, filtered noise and feedback delays, so the
 * page stays light and works offline.
 */
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private scrollGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private activeNodes: (AudioNode & { stop?: () => void })[] = [];
  private activeIntervals: number[] = [];
  private current: AmbientPreset | null = null;
  private scrollTarget = 1;

  isRunning() {
    return this.current !== null;
  }

  getCurrent() {
    return this.current;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.scrollGain = this.ctx.createGain();
      this.scrollGain.gain.value = 1;
      this.master.connect(this.scrollGain);
      this.scrollGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext) {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  async play(preset: AmbientPreset) {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    this.teardown();
    this.current = preset;

    if (preset === "cinematic") this.buildCinematicEcho(ctx);
    if (preset === "rain") this.buildNostalgicRain(ctx);
    if (preset === "midnight") this.buildMidnightMemory(ctx);

    this.fadeMaster(BASE_VOLUME, 2.2);
  }

  stop() {
    if (!this.current) return;
    this.fadeMaster(0, 1.1);
    const ctx = this.ctx;
    window.setTimeout(() => this.teardown(), ctx ? 1200 : 0);
    this.current = null;
  }

  /** value in [0,1] - driven by scroll position, independent of the master gain. */
  setScrollFade(value: number) {
    this.scrollTarget = value;
    if (!this.ctx || !this.scrollGain) return;
    const now = this.ctx.currentTime;
    this.scrollGain.gain.cancelScheduledValues(now);
    this.scrollGain.gain.setValueAtTime(this.scrollGain.gain.value, now);
    this.scrollGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, value)),
      now + 0.9,
    );
  }

  private fadeMaster(value: number, duration: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(value, now + duration);
  }

  private teardown() {
    this.activeIntervals.forEach((id) => window.clearInterval(id));
    this.activeIntervals = [];
    this.activeNodes.forEach((node) => {
      try {
        node.stop?.();
      } catch {
        // already stopped
      }
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    });
    this.activeNodes = [];
  }

  private track<T extends AudioNode & { stop?: () => void }>(node: T): T {
    this.activeNodes.push(node);
    return node;
  }

  /** Preset 1 - thick, slow pad chords through a long feedback delay: a wide, deep memory-space. */
  private buildCinematicEcho(ctx: AudioContext) {
    if (!this.master) return;
    const notes = [130.81, 164.81, 196.0, 261.63]; // C3 E3 G3 C4
    const bus = this.track(ctx.createGain());
    bus.gain.value = 1;

    const filter = this.track(ctx.createBiquadFilter());
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;

    const delay = this.track(ctx.createDelay(4));
    delay.delayTime.value = 1.1;
    const feedback = this.track(ctx.createGain());
    feedback.gain.value = 0.42;
    const wet = this.track(ctx.createGain());
    wet.gain.value = 0.45;

    bus.connect(filter);
    filter.connect(this.master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);

    notes.forEach((freq, i) => {
      const osc = this.track(ctx.createOscillator());
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const g = this.track(ctx.createGain());
      g.gain.value = 0;
      osc.connect(g).connect(bus);
      osc.start();

      const period = 9 + i * 1.6;
      const swell = () => {
        const t = ctx.currentTime;
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0.1, t + period * 0.5);
        g.gain.linearRampToValueAtTime(0.035, t + period);
      };
      swell();
      const id = window.setInterval(swell, period * 1000);
      this.activeIntervals.push(id);
    });

    const lfo = this.track(ctx.createOscillator());
    lfo.frequency.value = 0.045;
    const lfoGain = this.track(ctx.createGain());
    lfoGain.gain.value = 340;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
  }

  /** Preset 2 - the same soft pad plus filtered noise sculpted into gentle, drifting rain. */
  private buildNostalgicRain(ctx: AudioContext) {
    if (!this.master) return;

    const padBus = this.track(ctx.createGain());
    padBus.gain.value = 1;
    const padFilter = this.track(ctx.createBiquadFilter());
    padFilter.type = "lowpass";
    padFilter.frequency.value = 700;
    padBus.connect(padFilter).connect(this.master);

    [220.0, 277.18].forEach((freq) => {
      const osc = this.track(ctx.createOscillator());
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = this.track(ctx.createGain());
      g.gain.value = 0.045;
      osc.connect(g).connect(padBus);
      osc.start();
    });

    const noiseSource = this.track(
      ctx.createBufferSource() as AudioBufferSourceNode & { stop: () => void },
    );
    noiseSource.buffer = this.getNoiseBuffer(ctx);
    noiseSource.loop = true;

    const highpass = this.track(ctx.createBiquadFilter());
    highpass.type = "highpass";
    highpass.frequency.value = 1100;
    const bandpass = this.track(ctx.createBiquadFilter());
    bandpass.type = "bandpass";
    bandpass.frequency.value = 3400;
    bandpass.Q.value = 0.5;

    const rainGain = this.track(ctx.createGain());
    rainGain.gain.value = 0.1;

    noiseSource
      .connect(highpass)
      .connect(bandpass)
      .connect(rainGain)
      .connect(this.master);
    noiseSource.start();

    const lfo = this.track(ctx.createOscillator());
    lfo.frequency.value = 0.12;
    const lfoGain = this.track(ctx.createGain());
    lfoGain.gain.value = 0.045;
    lfo.connect(lfoGain).connect(rainGain.gain);
    lfo.start();

    // occasional soft "droplet" shimmer high above the noise bed
    const playDroplet = () => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 1200 + Math.random() * 900;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(this.master!);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.start(t);
      osc.stop(t + 1);
    };
    const dropletId = window.setInterval(() => {
      if (Math.random() > 0.5) playDroplet();
    }, 1400);
    this.activeIntervals.push(dropletId);
  }

  /** Preset 3 - sparse, plucked lofi melody with a long calming delay tail. */
  private buildMidnightMemory(ctx: AudioContext) {
    if (!this.master) return;
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0]; // C D E G A

    const delay = this.track(ctx.createDelay(2));
    delay.delayTime.value = 0.58;
    const feedback = this.track(ctx.createGain());
    feedback.gain.value = 0.48;
    const delayFilter = this.track(ctx.createBiquadFilter());
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 2000;
    const wet = this.track(ctx.createGain());
    wet.gain.value = 0.38;

    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);

    const pluckBus = this.track(ctx.createGain());
    pluckBus.gain.value = 1;
    pluckBus.connect(this.master);
    pluckBus.connect(delay);

    // soft sustained undertone so the silence between notes never feels empty
    const pad = this.track(ctx.createOscillator());
    pad.type = "sine";
    pad.frequency.value = 130.81;
    const padGain = this.track(ctx.createGain());
    padGain.gain.value = 0.035;
    pad.connect(padGain).connect(this.master);
    pad.start();

    const playNote = () => {
      const octave = Math.random() > 0.75 ? 2 : 1;
      const freq =
        scale[Math.floor(Math.random() * scale.length)] * octave;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(pluckBus);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
      osc.start(t);
      osc.stop(t + 1.8);
    };

    playNote();
    const id = window.setInterval(() => {
      if (Math.random() > 0.3) playNote();
    }, 1850);
    this.activeIntervals.push(id);
  }
}

export const audioEngine = new AmbientAudioEngine();
