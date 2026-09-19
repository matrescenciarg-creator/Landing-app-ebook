// Web Audio API Synthesizer for maternal soothing sounds and infant audio cues
// 100% client-side, zero external assets, continuous uninterrupted playback

export type SoothingSoundType = 'shhh' | 'womb' | 'heartbeat' | 'rain' | 'lullaby' | 'whitenoise';

class SoothingSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private activeNodes: AudioNode[] = [];
  private isPlaying: boolean = false;
  private activeType: SoothingSoundType | null = null;
  private currentVolume: number = 0.75;
  private lullabyTimer: any = null;

  private getOrCreateContext(): AudioContext | null {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(volume0to100: number) {
    this.currentVolume = Math.max(0, Math.min(100, volume0to100)) / 100;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.currentVolume * 0.45, this.ctx.currentTime);
      } catch (e) {
        // ignore
      }
    }
  }

  public stop() {
    // 1. Clear any active interval or timeout
    if (this.lullabyTimer) {
      clearTimeout(this.lullabyTimer);
      clearInterval(this.lullabyTimer);
      this.lullabyTimer = null;
    }

    // 2. Stop buffer source immediately
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.activeSource = null;
    }

    // 3. Disconnect all tracked audio nodes
    this.activeNodes.forEach(node => {
      try {
        (node as any).stop?.();
        node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];

    // 4. Disconnect master gain
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch (e) {
        // ignore
      }
      this.masterGain = null;
    }

    this.isPlaying = false;
    this.activeType = null;
  }

  public startSound(type: SoothingSoundType, volume: number = 75) {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    // If already playing this exact sound, toggle off
    if (this.isPlaying && this.activeType === type) {
      this.stop();
      return;
    }

    // Synchronous immediate cleanup of previous sound (no delayed timeouts!)
    this.stop();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    this.isPlaying = true;
    this.activeType = type;
    this.currentVolume = Math.max(0, Math.min(100, volume)) / 100;

    // Create a dedicated Master Gain for this playback session
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume * 0.45, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    if (type === 'shhh') {
      this.generateShhhSound(ctx);
    } else if (type === 'womb') {
      this.generateWombSound(ctx);
    } else if (type === 'heartbeat') {
      this.generateHeartbeatSound(ctx);
    } else if (type === 'rain' || type === 'whitenoise') {
      this.generateRainSound(ctx);
    } else if (type === 'lullaby') {
      this.generateLullabySound(ctx);
    }
  }

  // 1. "Shhh" Rítmico (Seamless 4-second biological breathing cycle with smooth envelope)
  private generateShhhSound(ctx: AudioContext) {
    const sampleRate = ctx.sampleRate;
    const duration = 4.0; // 4 second continuous loop
    const totalSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise base
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < totalSamples; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;

      // Biological "Shhhhh... pause... Shhhhh..." envelope
      const t = (i / sampleRate); // 0 to 4.0
      // 0 to 2.4s: "Shhhhh" exhalation
      let envelope = 0.03;
      if (t < 2.4) {
        const p = t / 2.4;
        envelope = 0.05 + 0.95 * Math.pow(Math.sin(p * Math.PI), 1.6);
      } else {
        // 2.4 to 4.0s: Inhalation rest
        envelope = 0.03 + 0.02 * Math.sin(((t - 2.4) / 1.6) * Math.PI);
      }

      data[i] = pink * envelope;
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1450, ctx.currentTime);
    filter.Q.setValueAtTime(1.1, ctx.currentTime);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(filter);
    if (this.masterGain) {
      filter.connect(this.masterGain);
    }

    source.start(0);
    this.activeSource = source;
    this.activeNodes.push(filter);
  }

  // 2. Ruido Blanco Uterino (Warm placental brown noise with muffled deep whoosh)
  private generateWombSound(ctx: AudioContext) {
    const sampleRate = ctx.sampleRate;
    const duration = 4.0;
    const totalSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < totalSamples; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.025 * white)) / 1.025;
      
      const t = i / sampleRate;
      const arterialPulse = 0.75 + 0.25 * Math.sin((t * Math.PI * 2) / 0.92);
      
      data[i] = lastOut * 3.8 * arterialPulse;
    }

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, ctx.currentTime);
    lowpass.Q.setValueAtTime(0.8, ctx.currentTime);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(lowpass);
    if (this.masterGain) {
      lowpass.connect(this.masterGain);
    }

    source.start(0);
    this.activeSource = source;
    this.activeNodes.push(lowpass);
  }

  // 3. Latido Cardíaco Materno (Acoustic Lub-Dub @ 65 BPM with rich maternal resonance)
  private generateHeartbeatSound(ctx: AudioContext) {
    const sampleRate = ctx.sampleRate;
    const beatDuration = 0.923; // 65 BPM (0.923s per cardiac cycle)
    const loopBeats = 4;
    const totalDuration = beatDuration * loopBeats;
    const totalSamples = Math.floor(sampleRate * totalDuration);
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    let bNoise = 0;

    for (let i = 0; i < totalSamples; i++) {
      const tInBeat = (i / sampleRate) % beatDuration;
      let sample = 0;

      // Amniotic fluid / blood flow diastolic swoosh
      const white = Math.random() * 2 - 1;
      bNoise = (bNoise + (0.015 * white)) / 1.015;
      const fluidWhoosh = bNoise * 0.35 * (0.6 + 0.4 * Math.sin((tInBeat / beatDuration) * Math.PI * 2));

      // LUB (S1 - Ventricular Systole: Deeper, resonant double-muscle contraction)
      if (tInBeat >= 0.0 && tInBeat < 0.18) {
        const p = tInBeat / 0.18;
        const freq1 = 98 - (p * 44);
        const freq2 = (98 - (p * 44)) * 1.95; // 2nd harmonic for mobile speaker audibility
        const env = Math.pow(Math.sin(p * Math.PI), 1.2) * Math.exp(-p * 3.2);
        
        const fundamental = Math.sin(tInBeat * Math.PI * 2 * freq1);
        const harmonic = Math.sin(tInBeat * Math.PI * 2 * freq2) * 0.45;
        const sub = Math.sin(tInBeat * Math.PI * 2 * (freq1 * 0.5)) * 0.35;
        
        sample = (fundamental + harmonic + sub) * env * 1.35;
      }
      // DUB (S2 - Semilunar Valve Closure: Snappier, slightly higher pitch, 0.28s after Lub)
      else if (tInBeat >= 0.28 && tInBeat < 0.42) {
        const t2 = tInBeat - 0.28;
        const p2 = t2 / 0.14;
        const freq1 = 118 - (p2 * 50);
        const freq2 = (118 - (p2 * 50)) * 1.95;
        const env = Math.pow(Math.sin(p2 * Math.PI), 1.1) * Math.exp(-p2 * 3.8);

        const fundamental = Math.sin(t2 * Math.PI * 2 * freq1);
        const harmonic = Math.sin(t2 * Math.PI * 2 * freq2) * 0.4;
        const sub = Math.sin(t2 * Math.PI * 2 * (freq1 * 0.5)) * 0.25;

        sample = (fundamental + harmonic + sub) * env * 1.05;
      }

      data[i] = (sample + fluidWhoosh) * 0.95;
    }

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(360, ctx.currentTime);
    lowpass.Q.setValueAtTime(1.2, ctx.currentTime);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(lowpass);
    if (this.masterGain) {
      lowpass.connect(this.masterGain);
    }

    source.start(0);
    this.activeSource = source;
    this.activeNodes.push(lowpass);
  }

  // 4. Lluvia Suave Continua (Warm continuous rainfall masking household noise)
  private generateRainSound(ctx: AudioContext) {
    const sampleRate = ctx.sampleRate;
    const duration = 5.0;
    const totalSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < totalSamples; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.06;
      b1 = 0.985 * b1 + white * 0.11;
      b2 = 0.950 * b2 + white * 0.22;
      const pink = (b0 + b1 + b2) * 0.18;
      
      const droplet = Math.random() > 0.9996 ? (Math.random() * 0.35) : 0;
      data[i] = (pink + droplet) * 0.55;
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(880, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(filter);
    if (this.masterGain) {
      filter.connect(this.masterGain);
    }

    source.start(0);
    this.activeSource = source;
    this.activeNodes.push(filter);
  }

  // 5. Canción de Cuna Suave (Brahms / Music Box Lullaby pentatonic loop)
  private generateLullabySound(ctx: AudioContext) {
    const notes = [
      { f: 261.63, d: 0.75 }, // C4
      { f: 261.63, d: 0.75 }, // C4
      { f: 329.63, d: 1.4 },  // E4
      { f: 261.63, d: 0.75 }, // C4
      { f: 261.63, d: 0.75 }, // C4
      { f: 329.63, d: 1.4 },  // E4
      { f: 261.63, d: 0.6 },  // C4
      { f: 329.63, d: 0.6 },  // E4
      { f: 392.00, d: 1.1 },  // G4
      { f: 349.23, d: 0.6 },  // F4
      { f: 329.63, d: 0.6 },  // E4
      { f: 293.66, d: 1.5 }   // D4
    ];

    let noteIndex = 0;

    const playTone = () => {
      if (!this.isPlaying || !this.masterGain || !this.ctx) return;
      
      const curNote = notes[noteIndex % notes.length];
      noteIndex++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(curNote.f, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + curNote.d);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + curNote.d + 0.05);

      this.lullabyTimer = setTimeout(playTone, curNote.d * 1000);
    };

    playTone();
  }

  // Audición acústica demostrativa de los 5 Sonidos Biológicos Universales
  public playSignalCue(signalId: string) {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const cueGain = ctx.createGain();
    cueGain.gain.setValueAtTime(0.35, now);
    cueGain.connect(ctx.destination);

    // 1. "NEH" (Hambre - Reflejo de succión con chasquido palatino "Neh... neh... neh")
    if (signalId.includes('neh') || signalId.includes('hambre')) {
      [0, 0.42, 0.88].forEach((offset) => {
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        // Nasal formant sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(460, now + offset);
        osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.28);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(920, now + offset);
        oscHarmonic.frequency.exponentialRampToValueAtTime(640, now + offset + 0.28);

        // Vocal tract filter for "Neh" /n/ -> /e/
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now + offset);
        filter.Q.setValueAtTime(3.2, now + offset);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.32, now + offset + 0.04);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.32);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        oscHarmonic.start(now + offset);
        osc.stop(now + offset + 0.35);
        oscHarmonic.stop(now + offset + 0.35);
      });
    }

    // 2. "OWH" (Sueño - Reflejo de bostezo prolongado y descendente "Ooo-wh")
    else if (signalId.includes('owh') || signalId.includes('sueno')) {
      [0, 1.1].forEach((offset) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now + offset);
        osc.frequency.exponentialRampToValueAtTime(175, now + offset + 0.95);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now + offset);
        filter.frequency.exponentialRampToValueAtTime(350, now + offset + 0.95);
        filter.Q.setValueAtTime(1.8, now + offset);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.28, now + offset + 0.15);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.98);

        osc.connect(filter);
        filter.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        osc.stop(now + offset + 1.05);
      });
    }

    // 3. "HEH" (Incomodidad ambiental / Pañal / Temperatura - Exhalación jadeante "Heh-heh")
    else if (signalId.includes('heh') || signalId.includes('incomodidad')) {
      [0, 0.28, 0.58, 0.88].forEach((offset) => {
        const sampleRate = ctx.sampleRate;
        const dur = 0.22;
        const totalSamples = Math.floor(sampleRate * dur);
        const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < totalSamples; i++) {
          const white = Math.random() * 2 - 1;
          const p = i / totalSamples;
          const envelope = Math.sin(p * Math.PI) * Math.exp(-p * 2.2);
          data[i] = white * envelope * 0.4;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1750, now + offset);
        filter.Q.setValueAtTime(2.0, now + offset);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now + offset);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(cueGain);

        source.start(now + offset);
        source.stop(now + offset + dur + 0.05);
      });
    }

    // 4. "EAIRH" (Gases en intestino bajo - Pujido tenso y quejumbroso "Eee-airgh")
    else if (signalId.includes('eairh') || signalId.includes('gases')) {
      [0, 0.75].forEach((offset) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        // Guttural strained rasp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210, now + offset);
        osc.frequency.linearRampToValueAtTime(145, now + offset + 0.55);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(218, now + offset); // slight detune for strain
        osc2.frequency.linearRampToValueAtTime(148, now + offset + 0.55);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(540, now + offset);
        filter.Q.setValueAtTime(3.5, now + offset);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.35, now + offset + 0.08);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.58);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        osc2.start(now + offset);
        osc.stop(now + offset + 0.62);
        osc2.stop(now + offset + 0.62);
      });
    }

    // 5. "EH" (Eructo / Burbuja atrapada en esófago - Golpe glótico seco "Eh! Eh!")
    else if (signalId.includes('eh-eructo') || signalId.includes('eructo')) {
      [0, 0.26, 0.54].forEach((offset) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(380, now + offset);
        osc.frequency.exponentialRampToValueAtTime(240, now + offset + 0.14);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(890, now + offset);
        filter.Q.setValueAtTime(4.0, now + offset);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.32, now + offset + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.16);

        osc.connect(filter);
        filter.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    }

    // 6. Sobreestimulación / Llanto agudo continuo
    else if (signalId.includes('sobreestimulacion')) {
      [0, 0.35, 0.7].forEach((offset) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, now + offset);
        osc.frequency.linearRampToValueAtTime(540, now + offset + 0.28);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now + offset);
        filter.Q.setValueAtTime(2.5, now + offset);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.24, now + offset + 0.03);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.3);

        osc.connect(filter);
        filter.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        osc.stop(now + offset + 0.32);
      });
    }

    // 7. Llamado de Apego / "Brazos" (Gimoteo suave y discontinuo)
    else if (signalId.includes('necesidad-contacto') || signalId.includes('apego') || signalId.includes('contacto')) {
      [0, 0.45].forEach((offset) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now + offset);
        osc.frequency.linearRampToValueAtTime(290, now + offset + 0.35);

        env.gain.setValueAtTime(0.0001, now + offset);
        env.gain.linearRampToValueAtTime(0.18, now + offset + 0.08);
        env.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.38);

        osc.connect(env);
        env.connect(cueGain);

        osc.start(now + offset);
        osc.stop(now + offset + 0.42);
      });
    }

    // Default / Chime
    else {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        env.gain.setValueAtTime(0.0001, now + idx * 0.1);
        env.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.04);
        env.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.5);

        osc.connect(env);
        env.connect(cueGain);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.55);
      });
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      activeType: this.activeType
    };
  }
}

export const soundEngine = new SoothingSoundEngine();
