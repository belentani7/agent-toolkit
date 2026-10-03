/**
 * DUCK STUDIO OS - Step Sequencer
 * Secuenciador de pasos con sintetizador integrado
 */

class DuckSequencer {
  constructor(audioEngine) {
    this.engine = audioEngine;
    this.bpm = 140;
    this.playing = false;
    this.step = 0;
    this.timer = null;
    
    this.patterns = [
      { n: 'KICK', c: '#10b981', snd: 'kick', st: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(Boolean) },
      { n: 'SNARE', c: '#7c3aed', snd: 'snare', st: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean) },
      { n: 'HAT', c: '#34d399', snd: 'hat', st: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1].map(Boolean) },
      { n: 'BASS', c: '#a78bfa', snd: 'bass', st: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0].map(Boolean) },
      { n: 'QUACK', c: '#6ee7b7', snd: 'quack', st: [0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0].map(Boolean) }
    ];
  }
  
  setBpm(v) {
    this.bpm = +v;
    if (this.playing) {
      clearInterval(this.timer);
      this.startTimer();
    }
  }
  
  toggle() {
    this.playing ? this.stop() : this.start();
  }
  
  start() {
    this.engine.init();
    this.playing = true;
    this.step = -1;
    this.startTimer();
  }
  
  stop() {
    this.playing = false;
    clearInterval(this.timer);
  }
  
  startTimer() {
    const int = (60 / this.bpm) / 4 * 1000;
    this.timer = setInterval(() => {
      this.step = (this.step + 1) % 16;
      this.patterns.forEach(r => {
        if (r.st[this.step]) this.synth(r.snd);
      });
    }, int);
  }
  
  toggleStep(ri, si) {
    this.patterns[ri].st[si] = !this.patterns[ri].st[si];
    if (this.patterns[ri].st[si]) this.synth(this.patterns[ri].snd);
  }
  
  synth(t) {
    const c = this.engine.AC;
    const now = c.currentTime;
    const master = this.engine.master;
    
    if (t === 'kick') {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(150, now);
      o.frequency.exponentialRampToValueAtTime(30, now + 0.12);
      g.gain.setValueAtTime(0.9, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + 0.3);
    }
    else if (t === 'snare') {
      const b = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
      }
      const s = c.createBufferSource();
      s.buffer = b;
      const g = c.createGain();
      g.gain.setValueAtTime(0.6, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      s.connect(g);
      g.connect(master);
      s.start(now);
    }
    else if (t === 'hat') {
      const b = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 8);
      }
      const s = c.createBufferSource();
      s.buffer = b;
      const g = c.createGain();
      const f = c.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 7000;
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(now);
    }
    else if (t === 'bass') {
      const o = c.createOscillator();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(55, now);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(800, now);
      f.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o.connect(f);
      f.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + 0.25);
    }
    else if (t === 'quack') {
      const o = c.createOscillator();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(340, now);
      o.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      f.type = 'bandpass';
      f.frequency.setValueAtTime(900, now);
      f.Q.value = 2.5;
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.connect(f);
      f.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + 0.25);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DuckSequencer;
}
