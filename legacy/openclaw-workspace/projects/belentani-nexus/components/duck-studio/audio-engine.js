/**
 * DUCK STUDIO OS - Web Audio Engine
 * Motor de audio profesional con cadena de efectos completa
 */

class DuckAudioEngine {
  constructor() {
    this.AC = null;
    this.master = null;
    this.analyser = null;
    this.chain = null;
    this.micStream = null;
    this.rec = null;
    this.chunks = [];
    this.recStart = 0;
    this.takes = [];
    this.curTake = -1;
    
    this.MICS = [
      { n: 'U87 Condenser', c: 'brilhante · detalhado', hpf: 60, shelf: 5, peak: 3, pf: 8000 },
      { n: 'SM7B Dynamic', c: 'quente · rádio', hpf: 90, shelf: 2, peak: 4, pf: 2500 },
      { n: 'AKG C414', c: 'aéreo · aberto', hpf: 50, shelf: 7, peak: 2, pf: 9000 },
      { n: 'SM58 Stage', c: 'médio · ao vivo', hpf: 110, shelf: 0, peak: 5, pf: 3000 },
      { n: 'Rode NT1', c: 'limpo · silencioso', hpf: 40, shelf: 3, peak: 1, pf: 7000 },
      { n: 'Telefunken 251', c: 'sedoso · vintage', hpf: 70, shelf: 4, peak: 3, pf: 6000 },
      { n: 'Duck Mic 3000', c: 'quack · signature', hpf: 120, shelf: 6, peak: 6, pf: 4000 },
      { n: 'PatoBuds Pro', c: 'lo-fi · fone', hpf: 200, shelf: -3, peak: 6, pf: 2000 }
    ];
    
    this.state = {
      mic: 0,
      fx: { comp: true, rev: true, dly: false, tune: true, sat: true },
      bpm: 140,
      seqOn: false,
      step: 0,
      recOn: false,
      playing: false
    };
  }
  
  init() {
    if (!this.AC) {
      this.AC = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
      this.master = this.AC.createGain();
      this.master.gain.value = 0.85;
      this.analyser = this.AC.createAnalyser();
      this.analyser.fftSize = 2048;
      this.master.connect(this.analyser);
      this.analyser.connect(this.AC.destination);
    }
    if (this.AC.state === 'suspended') this.AC.resume();
    return this.AC;
  }
  
  setVolume(v) {
    if (this.master) this.master.gain.value = v / 100;
  }
  
  selectMic(i) {
    this.state.mic = i;
    if (this.chain) {
      const m = this.MICS[i];
      this.chain.hpf.frequency.value = m.hpf;
      this.chain.shelf.frequency.value = m.pf;
      this.chain.shelf.gain.value = m.shelf;
      this.chain.peak.frequency.value = m.pf / 2;
      this.chain.peak.gain.value = m.peak;
    }
  }
  
  buildChain() {
    this.destroyChain();
    const c = this.AC;
    const m = this.MICS[this.state.mic];
    
    const src = c.createMediaStreamSource(this.micStream);
    const hpf = c.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = m.hpf;
    
    const shelf = c.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.value = m.pf;
    shelf.gain.value = m.shelf;
    
    const peak = c.createBiquadFilter();
    peak.type = 'peaking';
    peak.frequency.value = m.pf / 2;
    peak.Q.value = 1;
    peak.gain.value = m.peak;
    
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 4;
    comp.attack.value = 0.005;
    comp.release.value = 0.09;
    
    const sat = c.createWaveShaper();
    const k = 30, n = 1024;
    const cv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i * 2 / n - 1;
      cv[i] = Math.tanh(x * (1 + k / 15));
    }
    sat.curve = cv;
    
    const satDry = c.createGain();
    const satWet = c.createGain();
    const post = c.createGain();
    const revSend = c.createGain();
    const dlySend = c.createGain();
    
    const conv = c.createConvolver();
    conv.buffer = this.makeIR(1.8, 6000);
    
    const dly = c.createDelay(2);
    dly.delayTime.value = 0.28;
    const dFb = c.createGain();
    dFb.gain.value = 0.32;
    const dTone = c.createBiquadFilter();
    dTone.type = 'lowpass';
    dTone.frequency.value = 4000;
    
    const tuneIn = c.createGain();
    const tuneOut = c.createGain();
    
    const chD = c.createDelay(0.06);
    chD.delayTime.value = 0.018;
    const lfo = c.createOscillator();
    lfo.frequency.value = 5.2;
    const lfoG = c.createGain();
    lfoG.gain.value = 0.004;
    lfo.connect(lfoG);
    lfoG.connect(chD.delayTime);
    lfo.start();
    
    const sum = c.createGain();
    const out = c.createGain();
    const inAn = c.createAnalyser();
    inAn.fftSize = 1024;
    
    // Signal flow
    src.connect(hpf);
    hpf.connect(shelf);
    shelf.connect(peak);
    peak.connect(inAn);
    peak.connect(comp);
    
    comp.connect(satDry);
    comp.connect(sat);
    sat.connect(satWet);
    
    satDry.connect(post);
    satWet.connect(post);
    
    post.connect(revSend);
    revSend.connect(conv);
    conv.connect(sum);
    
    post.connect(dlySend);
    dlySend.connect(dly);
    dly.connect(dTone);
    dTone.connect(sum);
    dTone.connect(dFb);
    dFb.connect(dly);
    
    post.connect(tuneIn);
    tuneIn.connect(chD);
    chD.connect(tuneOut);
    tuneOut.connect(sum);
    
    post.connect(sum);
    sum.connect(out);
    out.connect(this.master);
    
    const recDest = c.createMediaStreamDestination();
    out.connect(recDest);
    
    this.chain = {
      src, hpf, shelf, peak, comp, sat, satDry, satWet, post,
      revSend, dlySend, dly, dFb, dTone, tuneIn, tuneOut, sum, out, inAn, recDest, lfo
    };
    
    this.applyFX();
  }
  
  applyFX() {
    if (!this.chain) return;
    const fx = this.state.fx;
    
    this.chain.satWet.gain.value = fx.sat ? 0.5 : 0;
    this.chain.satDry.gain.value = fx.sat ? 1 : 0.6;
    this.chain.comp.threshold.value = fx.comp ? -20 : 0;
    this.chain.comp.ratio.value = fx.comp ? 4 : 1;
    this.chain.revSend.gain.value = fx.rev ? 0.3 : 0;
    this.chain.dlySend.gain.value = fx.dly ? 0.25 : 0;
    
    const tg = fx.tune ? 0.5 : 0;
    this.chain.tuneOut.gain.value = tg;
    this.chain.tuneIn.gain.value = tg;
  }
  
  destroyChain() {
    if (this.chain) {
      try {
        Object.values(this.chain).forEach(nd => {
          if (nd && nd.disconnect) nd.disconnect();
        });
      } catch (e) {}
      this.chain = null;
    }
  }
  
  makeIR(sec, damp) {
    const r = this.AC.sampleRate;
    const len = Math.floor(r * sec);
    const b = this.AC.createBuffer(2, len, r);
    
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / r;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2) * Math.exp(-t * (16000 / damp) * 1.4);
      }
    }
    return b;
  }
  
  async toggleRec() {
    this.init();
    
    if (this.state.recOn) {
      this.stopRec();
      return;
    }
    
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false }
      });
    } catch (e) {
      console.error('❌ Sem microfone disponível');
      return;
    }
    
    this.buildChain();
    
    this.rec = new MediaRecorder(this.chain.recDest.stream);
    this.chunks = [];
    
    this.rec.ondataavailable = e => this.chunks.push(e.data);
    
    this.rec.onstop = async () => {
      const blob = new Blob(this.chunks, { type: 'audio/webm' });
      const buf = await blob.arrayBuffer();
      const ab = await this.AC.decodeAudioData(buf);
      
      this.takes.push({
        buf,
        dur: ab.duration,
        peaks: this.calcPeaks(ab)
      });
      
      this.curTake = this.takes.length - 1;
      console.log('✅ Take ' + this.takes.length + ' gravado!');
    };
    
    this.rec.start();
    this.recStart = Date.now();
    this.state.recOn = true;
  }
  
  stopRec() {
    if (!this.state.recOn) return;
    
    this.state.recOn = false;
    
    if (this.rec && this.rec.state !== 'inactive') this.rec.stop();
    if (this.micStream) this.micStream.getTracks().forEach(t => t.stop());
    
    this.destroyChain();
  }
  
  calcPeaks(b) {
    const d = b.getChannelData(0);
    const p = [];
    const bs = Math.floor(d.length / 400);
    
    for (let i = 0; i < 400; i++) {
      let mx = 0;
      for (let j = 0; j < bs; j += 8) {
        const v = Math.abs(d[i * bs + j] || 0);
        if (v > mx) mx = v;
      }
      p.push(mx);
    }
    return p;
  }
  
  exportWAV(buf, fname) {
    const nCh = 1;
    const len = buf.length * 2 + 44;
    const ab = new ArrayBuffer(len);
    const v = new DataView(ab);
    
    const ws = (o, s) => {
      for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
    };
    
    ws(0, 'RIFF');
    v.setUint32(4, len - 8, true);
    ws(8, 'WAVE');
    ws(12, 'fmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, buf.sampleRate, true);
    v.setUint32(28, buf.sampleRate * 2, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    ws(36, 'data');
    v.setUint32(40, len - 44, true);
    
    let off = 44;
    const d = buf.getChannelData(0);
    
    for (let i = 0; i < d.length; i++) {
      const s = Math.max(-1, Math.min(1, d[i]));
      v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      off += 2;
    }
    
    const b = new Blob([ab], { type: 'audio/wav' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = fname;
    a.click();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DuckAudioEngine;
}
