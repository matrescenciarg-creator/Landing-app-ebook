// Web Audio API Synthesizer for maternal soothing sounds and infant audio cues
// 100% client-side, zero external assets or network dependencies

class SoothingSoundEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeType: string | null = null;
  private intervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume0to100: number) {
    if (this.gainNode && this.ctx) {
      const clamped = Math.max(0, Math.min(100, volume0to100)) / 100;
      this.gainNode.gain.setValueAtTime(clamped * 0.4, this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch (e) {
        // ignore
      }
    }
    setTimeout(() => {
      if (this.currentSource) {
        try {
          (this.currentSource as any).stop?.();
          this.currentSource.disconnect();
        } catch (e) {
          // ignore
        }
        this.currentSource = null;
      }
      this.isPlaying = false;
      this.activeType = null;
    }, 350);
  }

  public playSignalCue(signalId: string) {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(ctx.destination);

    if (signalId.includes('neh') || signalId.includes('hambre')) {
      // "Neh" cue: 2 short resonant pulses with tongue-palate nasal formant
      [0, 0.35, 0.7].forEach((offset) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now + offset);
        osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.22);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now + offset);
        filter.Q.setValueAtTime(3.0, now + offset);

        env.gain.setValueAtTime(0.001, now + offset);
        env.gain.linearRampToValueAtTime(0.18, now + offset + 0.04);
        env.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);

        osc.connect(filter);
        filter.connect(env);
        env.connect(masterGain);

        osc.start(now + offset);
        osc.stop(now + offset + 0.28);
      });
    } else if (signalId.includes('owh') || signalId.includes('sueno')) {
      // "Owh" cue: elongated yawn formant sliding downwards
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.2, now + 0.15);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(env);
      env.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } else if (signalId.includes('eairh') || signalId.includes('gases')) {
      // "Eairh" cue: guttural grunting low tone
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.4);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(2.0, now);

      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.25, now + 0.08);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(env);
      env.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Gentle chime confirmation
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5

      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.15, now + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(env);
      env.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.65);
    }
  }

  public startSound(type: 'shhh' | 'womb' | 'heartbeat' | 'rain' | 'lullaby', volume: number = 75) {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying && this.activeType === type) {
      this.stop();
      return;
    }

    this.stop();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    this.gainNode = ctx.createGain();
    this.setVolume(volume);
    this.gainNode.connect(ctx.destination);
    this.isPlaying = true;
    this.activeType = type;

    if (type === 'shhh') {
      // Rhythmic breathing "Shhh... Shhh..."
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.2, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.4, now); // 1 breath every 2.5s
      lfoGain.gain.setValueAtTime(0.4, now);

      const breathingGain = ctx.createGain();
      breathingGain.gain.setValueAtTime(0.05, now);

      lfo.connect(breathingGain.gain);
      noiseSource.connect(filter);
      filter.connect(breathingGain);
      breathingGain.connect(this.gainNode);

      lfo.start(now);
      noiseSource.start(now);
      this.currentSource = noiseSource;

    } else if (type === 'womb') {
      // Pink/Brown womb noise with muffled low-pass filter
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);

      noiseSource.start(now);
      this.currentSource = noiseSource;

    } else if (type === 'heartbeat') {
      // Maternal heartbeat rhythm: lub-dub at 65 BPM
      const playPulse = () => {
        if (!this.isPlaying || !this.gainNode) return;
        const pulseNow = ctx.currentTime;

        // Lub (1st beat)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, pulseNow);
        osc1.frequency.exponentialRampToValueAtTime(45, pulseNow + 0.12);

        gain1.gain.setValueAtTime(0.001, pulseNow);
        gain1.gain.linearRampToValueAtTime(0.4, pulseNow + 0.03);
        gain1.gain.exponentialRampToValueAtTime(0.001, pulseNow + 0.14);

        osc1.connect(gain1);
        gain1.connect(this.gainNode);
        osc1.start(pulseNow);
        osc1.stop(pulseNow + 0.15);

        // Dub (2nd beat, 0.24s after)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(65, pulseNow + 0.22);
        osc2.frequency.exponentialRampToValueAtTime(40, pulseNow + 0.34);

        gain2.gain.setValueAtTime(0.001, pulseNow + 0.22);
        gain2.gain.linearRampToValueAtTime(0.28, pulseNow + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.001, pulseNow + 0.35);

        osc2.connect(gain2);
        gain2.connect(this.gainNode);
        osc2.start(pulseNow + 0.22);
        osc2.stop(pulseNow + 0.36);
      };

      playPulse();
      this.intervalId = setInterval(playPulse, 920); // ~65 bpm

    } else if (type === 'rain') {
      // Gentle warm rainfall
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(0.8, now);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start(now);
      this.currentSource = noiseSource;

    } else if (type === 'lullaby') {
      // Gentle music-box lullaby melody (Brahms' Lullaby motif in pentatonic)
      const notes = [
        { f: 261.63, d: 0.6 }, // C4
        { f: 261.63, d: 0.6 }, // C4
        { f: 329.63, d: 1.0 }, // E4
        { f: 261.63, d: 0.6 }, // C4
        { f: 261.63, d: 0.6 }, // C4
        { f: 329.63, d: 1.0 }, // E4
        { f: 261.63, d: 0.5 }, // C4
        { f: 329.63, d: 0.5 }, // E4
        { f: 392.00, d: 0.8 }, // G4
        { f: 349.23, d: 0.5 }, // F4
        { f: 329.63, d: 0.5 }, // E4
        { f: 293.66, d: 1.2 }  // D4
      ];

      let noteIdx = 0;
      const playNextNote = () => {
        if (!this.isPlaying || !this.gainNode) return;
        const curNote = notes[noteIdx % notes.length];
        noteIdx++;

        const noteNow = ctx.currentTime;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(curNote.f, noteNow);

        env.gain.setValueAtTime(0.001, noteNow);
        env.gain.linearRampToValueAtTime(0.12, noteNow + 0.04);
        env.gain.exponentialRampToValueAtTime(0.001, noteNow + curNote.d);

        osc.connect(env);
        env.connect(this.gainNode);
        osc.start(noteNow);
        osc.stop(noteNow + curNote.d + 0.05);

        this.intervalId = setTimeout(playNextNote, curNote.d * 1000);
      };

      playNextNote();
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
