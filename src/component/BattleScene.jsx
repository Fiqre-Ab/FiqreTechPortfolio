import { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/* ============================================================
   EPIC AUDIO ENGINE  — orchestral + saber synthesis
   ============================================================ */
class CinematicAudio {
  constructor() { this.ctx = null; this.nodes = []; this.saberNodes = []; }

  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return; }
    this._buildOrchestralDrone();
  }

  /* --- master reverb convolver --- */
  _makeReverb(dur = 2.5) {
    const ctx = this.ctx;
    const len = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2.5);
    }
    const rev = ctx.createConvolver();
    rev.buffer = buf;
    return rev;
  }

  /* --- layered orchestral drone (brass/strings feel) --- */
  _buildOrchestralDrone() {
    const ctx = this.ctx;
    const master = ctx.createGain(); master.gain.value = 0;
    const rev = this._makeReverb(3);
    master.connect(rev); rev.connect(ctx.destination);
    master.connect(ctx.destination);

    // Low brass (tuba feel)
    const freqs = [36.7, 55, 73.4, 110]; // low E, A, D octaves
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      osc.type = i < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.value = f;
      flt.type = 'lowpass'; flt.frequency.value = 400 + i * 200;
      g.gain.value = [0.18, 0.12, 0.09, 0.05][i];
      // add subtle vibrato
      const vib = ctx.createOscillator();
      const vibG = ctx.createGain();
      vib.frequency.value = 3.2 + i * 0.4;
      vibG.gain.value = 1.5;
      vib.connect(vibG); vibG.connect(osc.frequency);
      vib.start();
      osc.connect(flt); flt.connect(g); g.connect(master);
      osc.start();
      this.nodes.push(osc, vib);
    });

    // Slowly fade in
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
    this.masterGain = master;
    this.nodes.push(master, rev);
  }

  /* --- saber hum (FM synthesis) --- */
  startSaberHum(isRed) {
    const ctx = this.ctx; if (!ctx) return;
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const masterG = ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.value = isRed ? 120 : 160;
    modulator.type = 'sine';
    modulator.frequency.value = isRed ? 60 : 80;
    modGain.gain.value = isRed ? 45 : 55;
    masterG.gain.value = 0;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterG);
    masterG.connect(ctx.destination);

    modulator.start(); carrier.start();
    masterG.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4);

    // subtle warble
    const warble = ctx.createOscillator();
    const wG = ctx.createGain();
    warble.frequency.value = 5;
    wG.gain.value = 3;
    warble.connect(wG); wG.connect(carrier.frequency);
    warble.start();

    this.saberNodes.push(carrier, modulator, masterG, warble, wG, modGain);
    return masterG;
  }

  /* --- cinematic clash (3 layers) --- */
  clash() {
    const ctx = this.ctx; if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Metallic ring (high pitched)
    const ring = ctx.createOscillator();
    const ringG = ctx.createGain();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(1800, now);
    ring.frequency.exponentialRampToValueAtTime(300, now + 0.4);
    ringG.gain.setValueAtTime(0.35, now);
    ringG.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    ring.connect(ringG); ringG.connect(ctx.destination);
    ring.start(now); ring.stop(now + 0.55);

    // 2. Deep impact bass
    const bass = ctx.createOscillator();
    const bassG = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(80, now);
    bass.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    bassG.gain.setValueAtTime(0.6, now);
    bassG.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    bass.connect(bassG); bassG.connect(ctx.destination);
    bass.start(now); bass.stop(now + 0.45);

    // 3. Energy burst (filtered noise)
    const size = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = (Math.random()*2-1) * Math.exp(-i/(size*0.3));
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = 'bandpass'; flt.frequency.value = 2200; flt.Q.value = 0.8;
    const noiseG = ctx.createGain();
    noiseG.gain.setValueAtTime(0.5, now);
    noiseG.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    noise.connect(flt); flt.connect(noiseG); noiseG.connect(ctx.destination);
    noise.start(now);
  }

  /* --- victory fanfare (ascending brass) --- */
  victory() {
    const ctx = this.ctx; if (!ctx) return;
    const rev = this._makeReverb(2);
    rev.connect(ctx.destination);
    const now = ctx.currentTime;
    // Major pentatonic ascending
    [261.63, 329.63, 392, 493.88, 523.25, 659.26].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      const t = now + i * 0.13;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.08);
      g.gain.setValueAtTime(0.14, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass'; flt.frequency.value = 3000;
      osc.connect(flt); flt.connect(g); g.connect(rev);
      osc.start(t); osc.stop(t + 2);
    });
  }

  stop() {
    if (this.masterGain && this.ctx) {
      try { this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5); }
      catch(e) {}
    }
    this.saberNodes.forEach(n => { try { n.stop?.(); } catch(e) {} });
    this.saberNodes = [];
  }
}

const audio = new CinematicAudio();

/* ============================================================
   KEYFRAMES
   ============================================================ */
const shakeAnim = keyframes`
  0%,100% { transform: translateX(0) translateY(0) rotate(0); }
  15%  { transform: translateX(-6px) translateY(-2px) rotate(-0.4deg); }
  30%  { transform: translateX(6px)  translateY(1px)  rotate(0.4deg); }
  45%  { transform: translateX(-4px) translateY(-1px) rotate(-0.2deg); }
  60%  { transform: translateX(4px)  translateY(0px)  rotate(0.2deg); }
  80%  { transform: translateX(-2px); }
`;

const glowBurst = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  25%  { opacity: 1; transform: scale(1.4); }
  100% { opacity: 0; transform: scale(2.5); }
`;

const lightFlash = keyframes`
  0%,100% { opacity: 0; }
  15%  { opacity: 0.55; }
  40%  { opacity: 0.15; }
  60%  { opacity: 0.45; }
  80%  { opacity: 0.05; }
`;

const fogDrift = keyframes`
  0%   { transform: translateX(0) scaleX(1); }
  50%  { transform: translateX(-20px) scaleX(1.05); }
  100% { transform: translateX(0) scaleX(1); }
`;

const starPulse = keyframes`
  0%,100% { opacity: 0.3; }
  50%      { opacity: 0.9; }
`;

const swordGlowAnim = keyframes`
  0%,100% { filter: drop-shadow(0 0 5px currentColor) drop-shadow(0 0 12px currentColor); }
  50%      { filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 28px currentColor) drop-shadow(0 0 50px currentColor); }
`;

const idleSway = keyframes`
  0%,100% { transform: rotate(0deg) scaleY(1); }
  50%      { transform: rotate(1deg) scaleY(1.003); }
`;

const groundGlow = keyframes`
  0%,100% { opacity: 0.4; }
  50%      { opacity: 0.75; }
`;

const cameraZoom = keyframes`
  from { transform: scale(1); }
  to   { transform: scale(1.12); }
`;

const darkFall = keyframes`
  0%   { transform: rotate(0deg) translateX(0); opacity: 1; }
  40%  { transform: rotate(-15deg) translateX(10px); opacity: 0.9; }
  100% { transform: rotate(82deg) translateX(80px) translateY(20px); opacity: 0.15; }
`;

const charEntrance = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ============================================================
   STYLED COMPONENTS
   ============================================================ */

/* --- main wrapper --- */
const SceneWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 520px;
  overflow: hidden;
  background: linear-gradient(180deg,
    #010210 0%,
    #06021a 18%,
    #0e0528 35%,
    #130830 52%,
    #0c0620 68%,
    #07051a 82%,
    #040310 100%
  );

  /* camera slow zoom when fighting */
  &.fighting {
    animation: ${cameraZoom} 8s ease-in-out forwards;
  }
  &.shaking {
    animation: ${shakeAnim} 0.45s ease-out;
  }

  @media (max-width: 768px) { height: 400px; }
  @media (max-width: 480px) { height: 320px; }
`;

/* --- star field --- */
const StarField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const Star = styled.div`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  width: ${p => p.$s}px;
  height: ${p => p.$s}px;
  background: ${p => p.$c || 'white'};
  border-radius: 50%;
  animation: ${starPulse} ${p => p.$d}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  filter: blur(${p => p.$b || 0}px);
`;

/* --- nebula layers --- */
const Nebula = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background:
    radial-gradient(ellipse 55% 40% at 20% 25%, rgba(100,40,180,0.18) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 80% 20%, rgba(50,30,140,0.15) 0%, transparent 65%),
    radial-gradient(ellipse 70% 35% at 50% 10%, rgba(80,20,160,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 30% 60% at 90% 60%, rgba(218,78,162,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 35% 50% at 10% 55%, rgba(52,152,219,0.08) 0%, transparent 65%);
`;

/* --- fog layers --- */
const FogLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: -10%;
  right: -10%;
  height: ${p => p.$h || 35}%;
  background: ${p => p.$grad};
  pointer-events: none;
  z-index: ${p => p.$z || 3};
  animation: ${fogDrift} ${p => p.$dur || 12}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
  opacity: ${p => p.$op || 0.5};
`;

/* --- horizon glow --- */
const HorizonGlow = styled.div`
  position: absolute;
  bottom: 20%;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(120,60,200,0.3) 20%,
    rgba(170,100,255,0.5) 40%,
    rgba(218,78,162,0.4) 60%,
    rgba(100,60,200,0.3) 80%,
    transparent 100%
  );
  z-index: 4;
  pointer-events: none;
  filter: blur(1px);
`;

/* --- ground plane --- */
const Ground = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 21%;
  z-index: 3;
  background: linear-gradient(180deg,
    rgba(5,3,20,0.0) 0%,
    rgba(8,5,25,0.95) 30%,
    #060418 100%
  );
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(130,80,220,0.25) 30%,
      rgba(218,78,162,0.2) 50%,
      rgba(130,80,220,0.25) 70%,
      transparent
    );
  }
`;

/* --- sword ground reflections --- */
const GroundReflect = styled.div`
  position: absolute;
  bottom: 20%;
  left: 0; right: 0;
  height: 80px;
  pointer-events: none;
  z-index: 4;
  transition: opacity 1s;
  background: radial-gradient(ellipse 70% 100% at ${p => p.$px || 50}% 100%,
    rgba(${p => p.$rgb || '130,80,220'},0.22) 0%,
    transparent 70%
  );
  animation: ${groundGlow} 2s ease-in-out infinite;
`;

/* --- canvas for sparks --- */
const SparkCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 8;
`;

/* --- glow burst on clash --- */
const ClashBurst = styled.div`
  position: absolute;
  top: ${p => p.$top || '38%'};
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px; height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255,255,255,0.95) 0%,
    rgba(${p => p.$rgb || '150,100,255'},0.7) 30%,
    rgba(${p => p.$rgb || '150,100,255'},0.2) 60%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 9;
  animation: ${glowBurst} 0.55s ease-out forwards;
`;

/* --- lightning flash overlay --- */
const FlashOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 40%,
    rgba(200,180,255,0.6), rgba(100,60,220,0.2)
  );
  pointer-events: none;
  z-index: 10;
  animation: ${lightFlash} 0.5s ease-out forwards;
`;

/* --- characters --- */
const DarkStage = styled(motion.div)`
  position: absolute;
  bottom: 20%;
  left: 2%;
  z-index: 6;
  transform-origin: bottom center;
`;

const LightStage = styled(motion.div)`
  position: absolute;
  bottom: 20%;
  right: 2%;
  z-index: 6;
  transform-origin: bottom center;
`;

const CharSvgWrap = styled(motion.div)`
  transform-origin: bottom center;
  ${p => p.$sway && css`animation: ${idleSway} 3.5s ease-in-out infinite;`}
  ${p => p.$fall && css`animation: ${darkFall} 1.4s cubic-bezier(.4,0,.6,1) forwards;`}
`;

/* --- text overlay --- */
const TextOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 12;
  pointer-events: none;
  gap: 16px;
`;

const CineLine = styled(motion.div)`
  font-size: clamp(1rem, 3.5vw, 1.9rem);
  font-weight: 800;
  text-align: center;
  padding: 0 24px;
  letter-spacing: 2px;
  line-height: 1.3;
`;

const CineSubLine = styled(motion.div)`
  font-size: clamp(0.78rem, 2vw, 1.05rem);
  color: rgba(180,200,220,0.9);
  text-align: center;
  padding: 0 24px;
  letter-spacing: 1px;
  line-height: 1.6;
`;

/* --- transition gradient at bottom --- */
const BottomFade = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(180deg, transparent 0%, #07051a 100%);
  pointer-events: none;
  z-index: 14;
`;

/* --- ui buttons --- */
const SoundBtn = styled(motion.button)`
  position: absolute;
  top: 14px; right: 16px;
  background: rgba(130,80,220,0.12);
  border: 1px solid rgba(130,80,220,0.3);
  border-radius: 20px;
  color: rgba(200,180,255,0.7);
  font-size: 0.7rem;
  padding: 5px 12px;
  cursor: pointer;
  z-index: 20;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  &:hover { background: rgba(130,80,220,0.25); color: white; }
`;

const SceneTag = styled.div`
  position: absolute;
  top: 14px; left: 16px;
  font-size: 0.62rem;
  color: rgba(160,130,220,0.45);
  letter-spacing: 3px;
  text-transform: uppercase;
  z-index: 20;
`;

const ReplayBtn = styled(motion.button)`
  position: absolute;
  bottom: 26%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(130,80,220,0.15);
  border: 1px solid rgba(130,80,220,0.4);
  border-radius: 24px;
  color: rgba(200,180,255,0.85);
  font-size: 0.78rem;
  padding: 7px 22px;
  cursor: pointer;
  z-index: 20;
  letter-spacing: 1.5px;
  backdrop-filter: blur(4px);
  &:hover { background: rgba(130,80,220,0.3); }
`;

/* ============================================================
   STAR DATA
   ============================================================ */
const STARS = [
  { x:5,  y:8,  s:1.5, d:2.2, delay:0,   c:'rgba(255,255,255,0.9)', b:0 },
  { x:15, y:5,  s:1,   d:3.1, delay:0.5, c:'rgba(200,180,255,0.8)', b:0 },
  { x:25, y:12, s:2,   d:2.8, delay:1,   c:'rgba(255,255,255,0.7)', b:0.3 },
  { x:38, y:4,  s:1,   d:4,   delay:1.5, c:'rgba(180,200,255,0.9)', b:0 },
  { x:52, y:9,  s:1.5, d:2.5, delay:0.2, c:'rgba(255,255,255,0.8)', b:0 },
  { x:63, y:6,  s:1,   d:3.4, delay:0.8, c:'rgba(220,200,255,0.7)', b:0 },
  { x:74, y:11, s:2,   d:2.1, delay:2,   c:'rgba(255,255,255,0.9)', b:0.3 },
  { x:85, y:7,  s:1,   d:3.7, delay:0.3, c:'rgba(180,220,255,0.8)', b:0 },
  { x:92, y:14, s:1.5, d:2.9, delay:1.2, c:'rgba(255,255,255,0.7)', b:0 },
  { x:10, y:25, s:1,   d:4.2, delay:2.5, c:'rgba(200,180,255,0.6)', b:0 },
  { x:45, y:20, s:1.5, d:3,   delay:1.8, c:'rgba(255,255,255,0.5)', b:0 },
  { x:80, y:22, s:1,   d:2.6, delay:0.7, c:'rgba(180,200,255,0.6)', b:0 },
  { x:30, y:30, s:2,   d:5,   delay:3,   c:'rgba(255,255,255,0.4)', b:0.5 },
  { x:60, y:28, s:1,   d:3.5, delay:1.1, c:'rgba(220,210,255,0.5)', b:0 },
  { x:95, y:30, s:1,   d:2.3, delay:0.4, c:'rgba(255,255,255,0.6)', b:0 },
];

/* ============================================================
   CHARACTER SVGS — premium cinematic designs
   ============================================================ */

function DarkCommander({ fall }) {
  return (
    <svg
      width="88" height="210" viewBox="0 0 88 210"
      overflow="visible"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(200,30,30,0.6)) drop-shadow(0 0 20px rgba(150,0,0,0.3))',
        ...(fall ? { animation: 'darkFall 1.4s cubic-bezier(.4,0,.6,1) forwards', transformOrigin: 'bottom center' } : {})
      }}
    >
      <defs>
        <filter id="dc-red-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="dc-blade-glow" x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="dc-cape" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0608" stopOpacity="0.98"/>
          <stop offset="100%" stopColor="#060404" stopOpacity="0.95"/>
        </linearGradient>
        <linearGradient id="dc-armor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#141011"/>
          <stop offset="100%" stopColor="#0c090a"/>
        </linearGradient>
        <radialGradient id="dc-chest-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff1100" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#880000" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#220000" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── CAPE (back layer) ── */}
      <path d="M 12 78 Q -6 115 -4 210 Q 44 197 92 210 Q 94 115 76 78 Z"
        fill="url(#dc-cape)" opacity="0.97"/>
      <path d="M 14 78 Q 5 120 7 210 Q 44 200 81 210 Q 83 120 74 78 Z"
        fill="#0c0809" opacity="0.6"/>

      {/* ── BOOTS ── */}
      <path d="M 18 158 L 18 206 Q 18 210 24 210 L 38 210 Q 40 210 40 206 L 40 158 Z"
        fill="#0e0c0c"/>
      <path d="M 48 158 L 48 206 Q 48 210 54 210 L 68 210 Q 70 210 70 206 L 70 158 Z"
        fill="#0e0c0c"/>
      {/* boot toe guards */}
      <path d="M 16 200 Q 13 207 22 209 L 40 209 Q 42 207 40 200 Z" fill="#141010"/>
      <path d="M 46 200 Q 43 207 54 209 L 72 209 Q 74 207 70 200 Z" fill="#141010"/>
      {/* boot shin plates */}
      <rect x="17" y="168" width="24" height="34" rx="2" fill="#111010"/>
      <rect x="47" y="168" width="24" height="34" rx="2" fill="#111010"/>
      <line x1="17" y1="180" x2="41" y2="180" stroke="#1c1919" strokeWidth="0.8"/>
      <line x1="47" y1="180" x2="71" y2="180" stroke="#1c1919" strokeWidth="0.8"/>
      {/* boot energy lines (red) */}
      <line x1="29" y1="169" x2="29" y2="200" stroke="#aa0000" strokeWidth="0.6" opacity="0.7"/>
      <line x1="59" y1="169" x2="59" y2="200" stroke="#aa0000" strokeWidth="0.6" opacity="0.7"/>

      {/* ── LEGS ── */}
      <rect x="18" y="148" width="22" height="16" rx="2" fill="#100e0e"/>
      <rect x="48" y="148" width="22" height="16" rx="2" fill="#100e0e"/>

      {/* ── BELT ── */}
      <rect x="17" y="143" width="54" height="9" rx="2" fill="#181212"/>
      <rect x="32" y="144" width="24" height="7" rx="2" fill="#1e1515"/>
      <rect x="36" y="145.5" width="16" height="4" rx="1" fill="#261a1a"/>
      {/* belt red accent */}
      <line x1="37" y1="148" x2="51" y2="148" stroke="#cc0000" strokeWidth="0.8" opacity="0.8"/>
      <ellipse cx="44" cy="148" rx="3" ry="1.5" fill="#ff0000" opacity="0.5" filter="url(#dc-red-glow)"/>

      {/* ── TORSO ARMOR ── */}
      <path d="M 18 74 L 70 74 L 72 152 L 16 152 Z" fill="url(#dc-armor)"/>
      {/* chest center plate */}
      <path d="M 28 74 L 60 74 L 62 110 L 26 110 Z" fill="#141011"/>
      <path d="M 26 110 L 62 110 L 63 152 L 25 152 Z" fill="#120f10"/>
      {/* armor panels */}
      <line x1="20" y1="88" x2="68" y2="88" stroke="#1c181a" strokeWidth="0.9"/>
      <line x1="20" y1="102" x2="68" y2="102" stroke="#1c181a" strokeWidth="0.9"/>
      <line x1="20" y1="116" x2="68" y2="116" stroke="#1c181a" strokeWidth="0.9"/>
      <line x1="20" y1="130" x2="68" y2="130" stroke="#1c181a" strokeWidth="0.9"/>
      {/* vertical divider lines */}
      <line x1="30" y1="74" x2="28" y2="152" stroke="#1c181a" strokeWidth="0.7"/>
      <line x1="58" y1="74" x2="60" y2="152" stroke="#1c181a" strokeWidth="0.7"/>
      {/* CHEST ENERGY CORE */}
      <ellipse cx="44" cy="95" rx="10" ry="11" fill="#1c0a0a"/>
      <ellipse cx="44" cy="95" rx="7" ry="8" fill="#220c0c" stroke="#880000" strokeWidth="0.7"/>
      <ellipse cx="44" cy="95" rx="4" ry="4.5" fill="url(#dc-chest-core)" filter="url(#dc-red-glow)"/>
      <ellipse cx="44" cy="95" rx="2" ry="2.2" fill="#ff1100" opacity="0.9"/>
      {/* energy conduit lines from chest core */}
      <path d="M 36 90 Q 30 84 20 88" stroke="#cc0000" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <path d="M 52 90 Q 58 84 68 88" stroke="#cc0000" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <path d="M 38 103 Q 30 108 20 116" stroke="#cc0000" strokeWidth="0.5" fill="none" opacity="0.4"/>
      <path d="M 50 103 Q 58 108 68 116" stroke="#cc0000" strokeWidth="0.5" fill="none" opacity="0.4"/>

      {/* ── SHOULDERS (angular, menacing) ── */}
      {/* Right shoulder */}
      <path d="M 68 68 Q 84 64 90 76 Q 90 86 78 82 L 68 80 Z" fill="#0f0d0d"/>
      <path d="M 69 70 Q 82 66 88 76 Q 87 83 76 80 L 68 80 Z" fill="#141111"/>
      {/* Right shoulder spike */}
      <path d="M 84 62 L 92 58 L 86 70 Z" fill="#1a1212" stroke="#cc0000" strokeWidth="0.4" opacity="0.7"/>
      {/* Left shoulder */}
      <path d="M 20 68 Q 4 64 -2 76 Q -2 86 10 82 L 20 80 Z" fill="#0f0d0d"/>
      <path d="M 19 70 Q 6 66 0 76 Q 1 83 12 80 L 20 80 Z" fill="#141111"/>
      {/* Left shoulder spike */}
      <path d="M 4 62 L -4 58 L 2 70 Z" fill="#1a1212" stroke="#cc0000" strokeWidth="0.4" opacity="0.7"/>

      {/* ── NECK COLLAR ── */}
      <path d="M 30 64 L 58 64 L 60 76 L 28 76 Z" fill="#0d0b0b"/>
      <path d="M 32 66 L 56 66 L 58 74 L 30 74 Z" fill="#111010"/>

      {/* ── HELMET (angular, intimidating) ── */}
      {/* helmet main dome */}
      <path d="M 20 32 L 18 66 L 70 66 L 68 32 Q 68 8 44 6 Q 20 8 20 32 Z" fill="#090808"/>
      {/* helmet left panel */}
      <path d="M 20 32 L 18 66 L 28 66 L 26 34 Q 22 16 20 24 Z" fill="#0c0b0b"/>
      {/* helmet right panel */}
      <path d="M 68 32 L 70 66 L 60 66 L 62 34 Q 66 16 68 24 Z" fill="#0c0b0b"/>
      {/* center ridge/crest */}
      <path d="M 41 6 L 44 2 L 47 6 L 45 66 L 43 66 Z" fill="#0f0d0d"/>
      {/* brow ridge - angular */}
      <path d="M 20 40 L 24 33 L 44 30 L 64 33 L 68 40 L 64 42 L 44 38 L 24 42 Z"
        fill="#141111"/>
      {/* face plate below visor */}
      <path d="M 22 52 L 24 66 L 64 66 L 66 52 Q 62 46 44 44 Q 26 46 22 52 Z"
        fill="#101010"/>
      {/* chin vent slots */}
      <line x1="30" y1="58" x2="36" y2="58" stroke="#1c1a1a" strokeWidth="1.2"/>
      <line x1="41" y1="58" x2="47" y2="58" stroke="#1c1a1a" strokeWidth="1.2"/>
      <line x1="52" y1="58" x2="58" y2="58" stroke="#1c1a1a" strokeWidth="1.2"/>
      {/* side vents */}
      <rect x="15" y="44" width="8" height="10" rx="1" fill="#0c0b0b" stroke="#1a1818" strokeWidth="0.5"/>
      <rect x="65" y="44" width="8" height="10" rx="1" fill="#0c0b0b" stroke="#1a1818" strokeWidth="0.5"/>
      <line x1="16" y1="47" x2="22" y2="47" stroke="#1c1a1a" strokeWidth="0.8"/>
      <line x1="16" y1="50" x2="22" y2="50" stroke="#1c1a1a" strokeWidth="0.8"/>
      <line x1="66" y1="47" x2="72" y2="47" stroke="#1c1a1a" strokeWidth="0.8"/>
      <line x1="66" y1="50" x2="72" y2="50" stroke="#1c1a1a" strokeWidth="0.8"/>
      {/* ── RED VISOR (most important visual) ── */}
      {/* visor cutout shape */}
      <path d="M 22 40 Q 24 35 36 33 L 36 42 Q 24 43 22 40 Z" fill="#cc0000" filter="url(#dc-red-glow)"/>
      <path d="M 66 40 Q 64 35 52 33 L 52 42 Q 64 43 66 40 Z" fill="#cc0000" filter="url(#dc-red-glow)"/>
      {/* inner bright */}
      <path d="M 23 40 Q 25 36 35 34 L 35 41 Q 25 42 23 40 Z" fill="#ff2200"/>
      <path d="M 65 40 Q 63 36 53 34 L 53 41 Q 63 42 65 40 Z" fill="#ff2200"/>
      {/* glow center */}
      <ellipse cx="29" cy="38" rx="5" ry="2.8" fill="#ff3300" filter="url(#dc-red-glow)" opacity="0.8"/>
      <ellipse cx="59" cy="38" rx="5" ry="2.8" fill="#ff3300" filter="url(#dc-red-glow)" opacity="0.8"/>

      {/* ── RIGHT ARM (sword arm) ── */}
      <rect x="68" y="80" width="14" height="50" rx="5" fill="#0f0d0d"/>
      <path d="M 68 82 L 82 82 L 80 100 L 68 100 Z" fill="#131010"/>
      <path d="M 68 101 L 82 101 L 80 122 L 68 122 Z" fill="#110e0e"/>
      <line x1="75" y1="82" x2="75" y2="130" stroke="#aa0000" strokeWidth="0.5" opacity="0.5"/>

      {/* LEFT ARM */}
      <rect x="6" y="80" width="14" height="50" rx="5" fill="#0f0d0d"/>
      <path d="M 6 82 L 20 82 L 20 100 L 8 100 Z" fill="#131010"/>

      {/* ── LIGHTSABER HANDLE ── */}
      <rect x="73" y="126" width="9" height="24" rx="3" fill="#1e1414"/>
      <rect x="74" y="122" width="7" height="8" rx="2" fill="#261b1b"/>
      <line x1="75" y1="130" x2="82" y2="130" stroke="#332020" strokeWidth="1"/>
      <line x1="75" y1="136" x2="82" y2="136" stroke="#332020" strokeWidth="1"/>
      <line x1="75" y1="142" x2="82" y2="142" stroke="#332020" strokeWidth="1"/>
      <rect x="71" y="134" width="4" height="6" rx="1" fill="#261818"/>

      {/* ── RED LIGHTSABER BLADE ── */}
      {/* outer glow */}
      <line x1="77.5" y1="122" x2="77.5" y2="10"
        stroke="#ff0000" strokeWidth="8" opacity="0.25" filter="url(#dc-blade-glow)"/>
      {/* mid glow */}
      <line x1="77.5" y1="122" x2="77.5" y2="10"
        stroke="#ff2200" strokeWidth="4" opacity="0.6" filter="url(#dc-blade-glow)"/>
      {/* core */}
      <line x1="77.5" y1="122" x2="77.5" y2="10"
        stroke="#ff6644" strokeWidth="1.8" opacity="0.95"/>
      {/* bright center */}
      <line x1="77.5" y1="122" x2="77.5" y2="10"
        stroke="rgba(255,220,210,0.6)" strokeWidth="0.7"/>
    </svg>
  );
}

function LightChampion({ victory }) {
  return (
    <svg
      width="88" height="210" viewBox="0 0 88 210"
      overflow="visible"
      style={{
        transform: 'scaleX(-1)',
        filter: victory
          ? 'drop-shadow(0 0 14px rgba(80,160,255,0.9)) drop-shadow(0 0 30px rgba(50,100,220,0.5))'
          : 'drop-shadow(0 0 8px rgba(80,140,255,0.55)) drop-shadow(0 0 18px rgba(50,100,220,0.3))',
      }}
    >
      <defs>
        <filter id="lc-blue-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lc-blade-glow" x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="lc-robe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8d2c0"/>
          <stop offset="100%" stopColor="#c0baa8"/>
        </linearGradient>
        <radialGradient id="lc-energy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#66aaff" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#2255cc" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#001144" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── ROBES (flowing) ── */}
      <path d="M 10 72 Q -6 110 -3 210 Q 44 198 91 210 Q 94 110 78 72 Z"
        fill="#ccc6b4" opacity="0.9"/>
      {/* robe shading */}
      <path d="M 16 72 Q 8 115 10 210 Q 44 202 78 210 Q 80 115 72 72 Z"
        fill="#c8c2b0" opacity="0.7"/>
      {/* inner robe fabric lines */}
      <path d="M 28 75 Q 22 130 24 210" stroke="#bcb6a4" strokeWidth="0.7" fill="none" opacity="0.6"/>
      <path d="M 44 74 Q 44 140 44 210"  stroke="#bcb6a4" strokeWidth="0.7" fill="none" opacity="0.6"/>
      <path d="M 60 75 Q 66 130 64 210"  stroke="#bcb6a4" strokeWidth="0.7" fill="none" opacity="0.6"/>

      {/* ── BOOTS ── */}
      <rect x="19" y="158" width="22" height="50" rx="3" fill="#a8a294"/>
      <rect x="47" y="158" width="22" height="50" rx="3" fill="#a8a294"/>
      <path d="M 18 200 Q 16 207 24 209 L 42 209 Q 44 207 42 200 Z" fill="#bcb6a4"/>
      <path d="M 46 200 Q 44 207 54 209 L 72 209 Q 74 207 70 200 Z" fill="#bcb6a4"/>

      {/* ── BELT ── */}
      <rect x="17" y="143" width="54" height="9" rx="2" fill="#8a7050"/>
      <rect x="30" y="144" width="28" height="7" rx="2" fill="#7a6040"/>
      <rect x="36" y="145" width="16" height="5" rx="1" fill="#6a5230"/>
      {/* belt blue accent */}
      <line x1="37" y1="148" x2="51" y2="148" stroke="#4488ff" strokeWidth="0.8" opacity="0.7"/>
      <ellipse cx="44" cy="148" rx="3" ry="1.5" fill="#4488ff" opacity="0.5" filter="url(#lc-blue-glow)"/>

      {/* ── TUNIC ── */}
      <path d="M 18 72 L 70 72 L 70 152 L 18 152 Z" fill="#c8c2b0"/>
      {/* tabard center line */}
      <line x1="30" y1="75" x2="30" y2="152" stroke="#bcb6a4" strokeWidth="0.8"/>
      <line x1="58" y1="75" x2="58" y2="152" stroke="#bcb6a4" strokeWidth="0.8"/>
      {/* chest blue energy sigil */}
      <ellipse cx="44" cy="92" rx="9" ry="10" fill="#d4cfc0"/>
      <ellipse cx="44" cy="92" rx="6" ry="7" fill="#c8c2b0" stroke="#4488ff" strokeWidth="0.6"/>
      <ellipse cx="44" cy="92" rx="3" ry="3.5" fill="url(#lc-energy)" filter="url(#lc-blue-glow)"/>
      <ellipse cx="44" cy="92" rx="1.5" ry="1.8" fill="#66aaff" opacity="0.9"/>
      {/* conduit lines */}
      <path d="M 36 87 Q 28 82 19 86" stroke="#4488ff" strokeWidth="0.5" fill="none" opacity="0.45"/>
      <path d="M 52 87 Q 60 82 69 86" stroke="#4488ff" strokeWidth="0.5" fill="none" opacity="0.45"/>

      {/* ── SHOULDERS ── */}
      <path d="M 68 66 Q 80 62 86 73 Q 86 82 76 78 L 68 78 Z" fill="#c8c2b0"/>
      <path d="M 20 66 Q 8 62 2 73 Q 2 82 12 78 L 20 78 Z"  fill="#c8c2b0"/>
      {/* shoulder blue trim */}
      <path d="M 68 66 Q 80 63 85 72 L 76 77 L 68 74 Z" fill="#d0cac0" stroke="#4488ff" strokeWidth="0.4" opacity="0.6"/>
      <path d="M 20 66 Q 8 63 3 72 L 12 77 L 20 74 Z"  fill="#d0cac0" stroke="#4488ff" strokeWidth="0.4" opacity="0.6"/>

      {/* ── COLLAR ── */}
      <path d="M 30 62 L 58 62 L 60 74 L 28 74 Z" fill="#ccc6b4"/>

      {/* ── HOOD ── */}
      <path d="M 16 22 Q 14 4 44 3 Q 74 4 72 22 L 70 66 L 18 66 Z" fill="#bcb6a4"/>
      {/* hood inner shadow */}
      <path d="M 22 26 Q 20 8 44 7 Q 68 8 66 26 L 64 66 L 24 66 Z" fill="#ada798"/>
      {/* hood deep shadow */}
      <path d="M 28 30 Q 26 12 44 10 Q 62 12 60 30 L 58 66 L 30 66 Z" fill="#9e9888"/>

      {/* ── FACE under hood ── */}
      <ellipse cx="44" cy="37" rx="11" ry="12" fill="#d4c8b0"/>
      <ellipse cx="44" cy="38" rx="9" ry="10" fill="#cfc3ab"/>
      {/* face shading */}
      <path d="M 36 30 Q 38 26 44 25 Q 50 26 52 30 Q 54 36 44 38 Q 34 36 36 30 Z" fill="#d8cbb5"/>
      {/* jaw */}
      <path d="M 37 44 Q 40 48 44 49 Q 48 48 51 44 L 50 40 Q 44 43 38 40 Z" fill="#c8bca2"/>

      {/* ── GLOWING EYES ── */}
      <ellipse cx="39" cy="34" rx="3.5" ry="2.5" fill="#3377ff" filter="url(#lc-blue-glow)"/>
      <ellipse cx="49" cy="34" rx="3.5" ry="2.5" fill="#3377ff" filter="url(#lc-blue-glow)"/>
      <ellipse cx="39" cy="34" rx="2" ry="1.4" fill="#77bbff"/>
      <ellipse cx="49" cy="34" rx="2" ry="1.4" fill="#77bbff"/>

      {/* ── LEFT ARM (sword arm) ── */}
      <rect x="6" y="78" width="14" height="52" rx="5" fill="#c0baa8"/>
      <path d="M 6 80 L 20 80 L 20 98 L 8 98 Z" fill="#c8c2b0"/>
      <path d="M 8 99 L 20 99 L 20 122 L 8 122 Z" fill="#bfb9a7"/>
      <line x1="13" y1="80" x2="13" y2="130" stroke="#4488ff" strokeWidth="0.5" opacity="0.4"/>

      {/* RIGHT ARM */}
      <rect x="68" y="78" width="14" height="52" rx="5" fill="#c0baa8"/>

      {/* ── LIGHTSABER HANDLE ── */}
      <rect x="6" y="126" width="9" height="24" rx="3" fill="#888070"/>
      <rect x="7" y="122" width="7" height="8" rx="2" fill="#999080"/>
      <line x1="7" y1="130" x2="14" y2="130" stroke="#aaa090" strokeWidth="1"/>
      <line x1="7" y1="136" x2="14" y2="136" stroke="#aaa090" strokeWidth="1"/>
      <line x1="7" y1="142" x2="14" y2="142" stroke="#aaa090" strokeWidth="1"/>
      <rect x="5" y="134" width="4" height="6" rx="1" fill="#776860"/>

      {/* ── BLUE LIGHTSABER BLADE ── */}
      {/* outer glow */}
      <line x1="10.5" y1="122" x2="10.5" y2="10"
        stroke="#0044ff" strokeWidth="8" opacity="0.22" filter="url(#lc-blade-glow)"/>
      {/* mid glow */}
      <line x1="10.5" y1="122" x2="10.5" y2="10"
        stroke="#2266ff" strokeWidth="4" opacity="0.55" filter="url(#lc-blade-glow)"/>
      {/* core */}
      <line x1="10.5" y1="122" x2="10.5" y2="10"
        stroke="#66aaff" strokeWidth="1.8" opacity="0.95"/>
      {/* bright center */}
      <line x1="10.5" y1="122" x2="10.5" y2="10"
        stroke="rgba(200,220,255,0.65)" strokeWidth="0.7"/>
    </svg>
  );
}

/* ============================================================
   SPARK PARTICLES
   ============================================================ */
function makeSpark(x, y, isRed) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 10 + 4;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 5,
    life: 1,
    decay: Math.random() * 0.035 + 0.02,
    size: Math.random() * 3.5 + 1.5,
    color: isRed
      ? `hsl(${Math.random() * 25}, 100%, ${55 + Math.random() * 30}%)`
      : `hsl(${200 + Math.random() * 40}, 100%, ${60 + Math.random() * 30}%)`,
  };
}

/* ============================================================
   PHASE TIMELINE (ms)
   ============================================================ */
const T = {
  CHAR_ENTRANCE: 600,
  APPROACH:      1800,
  FIGHT:         3600,
  CLASH: [4100, 5200, 6100, 6900],
  FINAL:         7800,
  FALL:          9000,
  TEXT:          9900,
  DONE:          14500,
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BattleScene() {
  const wrapperRef  = useRef(null);
  const canvasRef   = useRef(null);
  const particles   = useRef([]);
  const rafRef      = useRef(null);
  const flashIdRef  = useRef(0);

  const [phase,       setPhase]       = useState('IDLE');
  const [soundOn,     setSoundOn]     = useState(false);
  const [flash,       setFlash]       = useState(false);
  const [flashRgb,    setFlashRgb]    = useState('150,100,255');
  const [burst,       setBurst]       = useState(null);
  const [showText,    setShowText]    = useState(false);
  const [done,        setDone]        = useState(false);
  const [darkFalls,   setDarkFalls]   = useState(false);
  const [lightWins,   setLightWins]   = useState(false);
  const [started,     setStarted]     = useState(false);
  const [replayKey,   setReplayKey]   = useState(0);
  const [shaking,     setShaking]     = useState(false);

  const darkCtrl  = useAnimation();
  const lightCtrl = useAnimation();

  /* --- screen shake --- */
  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 460);
  }, []);

  /* --- clash event --- */
  const triggerClash = useCallback((isRed = false) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const cx = canvas.width  * 0.5 + (isRed ? -15 : 15);
      const cy = canvas.height * 0.35;
      for (let i = 0; i < 30; i++) particles.current.push(makeSpark(cx, cy, isRed));
    }
    setFlashRgb(isRed ? '220,80,40' : '80,140,255');
    setFlash(true);
    setBurst({ top: '35%', rgb: isRed ? '220,80,40' : '80,140,255' });
    setTimeout(() => { setFlash(false); setBurst(null); }, 550);
    shake();
    if (soundOn) audio.clash();
  }, [soundOn, shake]);

  /* --- full timeline --- */
  const runTimeline = useCallback(() => {
    const timers = [];

    timers.push(setTimeout(() => setPhase('CHAR_ENTRANCE'), T.CHAR_ENTRANCE));

    timers.push(setTimeout(() => {
      setPhase('APPROACH');
      darkCtrl.start({ x: '28vw', transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] } });
      lightCtrl.start({ x: '-28vw', transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] } });
    }, T.APPROACH));

    timers.push(setTimeout(() => setPhase('FIGHT'), T.FIGHT));

    T.CLASH.forEach((t, i) => {
      timers.push(setTimeout(() => triggerClash(i % 2 === 0), t));
    });

    timers.push(setTimeout(() => {
      setPhase('FINAL');
      lightCtrl.start({ x: '-32vw', transition: { duration: 0.35, ease: 'easeIn' } });
      setTimeout(() => triggerClash(false), 300);
    }, T.FINAL));

    timers.push(setTimeout(() => {
      setDarkFalls(true); setLightWins(true);
      if (soundOn) audio.victory();
    }, T.FALL));

    timers.push(setTimeout(() => setShowText(true), T.TEXT));
    timers.push(setTimeout(() => setDone(true), T.DONE));

    return timers;
  }, [darkCtrl, lightCtrl, triggerClash, soundOn]);

  /* --- intersection observer --- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.25 }
    );
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timers = runTimeline();
    return () => timers.forEach(clearTimeout);
  }, [started, replayKey]); // eslint-disable-line

  /* --- canvas particle loop --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0.01);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.25; p.vx *= 0.97;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size * p.life), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [replayKey]);

  const replay = () => {
    setPhase('IDLE'); setDarkFalls(false); setLightWins(false);
    setShowText(false); setDone(false); setStarted(false); setShaking(false);
    particles.current = [];
    darkCtrl.set({ x: 0 }); lightCtrl.set({ x: 0 });
    setTimeout(() => { setStarted(true); setReplayKey(k => k + 1); }, 80);
  };

  const toggleSound = () => {
    if (!soundOn) { audio.init(); setSoundOn(true); }
    else { audio.stop(); setSoundOn(false); }
  };

  const fighting = phase === 'FIGHT' || phase === 'FINAL';
  const fightClass = `${fighting ? 'fighting' : ''} ${shaking ? 'shaking' : ''}`;

  return (
    <SceneWrapper ref={wrapperRef} className={fightClass} key={replayKey}>
      <SceneTag>⚔ cinematic duel</SceneTag>
      <SoundBtn onClick={toggleSound} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {soundOn ? '🔊 Sound ON' : '🔇 Sound OFF'}
      </SoundBtn>

      {/* Environment */}
      <StarField>
        {STARS.map((s, i) => <Star key={i} $x={s.x} $y={s.y} $s={s.s} $d={s.d} $delay={s.delay} $c={s.c} $b={s.b}/>)}
      </StarField>
      <Nebula />

      {/* Fog layers */}
      <FogLayer $h={30} $op={0.55} $z={3} $dur={15} $delay={0}
        $grad="radial-gradient(ellipse 80% 100% at 50% 100%, rgba(60,20,120,0.45) 0%, transparent 70%)"/>
      <FogLayer $h={18} $op={0.4} $z={4} $dur={20} $delay={5}
        $grad="radial-gradient(ellipse 90% 100% at 50% 100%, rgba(30,10,80,0.5) 0%, transparent 80%)"/>
      <FogLayer $h={10} $op={0.6} $z={5} $dur={10} $delay={2}
        $grad="linear-gradient(180deg, transparent 0%, rgba(6,4,18,0.9) 100%)"/>

      <HorizonGlow />
      <Ground />

      {/* Ground sword reflections */}
      <GroundReflect $px={fighting ? 38 : 50} $rgb={fighting ? '200,80,40' : '130,80,220'}/>

      {/* Spark canvas */}
      <SparkCanvas ref={canvasRef} style={{ width: '100%', height: '100%' }}/>

      {/* Glow burst on clash */}
      {burst && <ClashBurst $top={burst.top} $rgb={burst.rgb} key={flashIdRef.current++}/>}

      {/* Flash overlay */}
      {flash && <FlashOverlay key={`fl-${flashIdRef.current}`}/>}

      {/* DARK COMMANDER */}
      <DarkStage
        animate={darkCtrl}
        initial={{ x: 0, opacity: 0 }}
        style={{ opacity: phase === 'IDLE' ? 0 : 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
        >
          <CharSvgWrap
            $sway={!fighting && !darkFalls}
            $fall={darkFalls}
            animate={fighting && !darkFalls ? {
              rotate: [-2, 2.5, -2, 1.5, -2],
              transition: { duration: 0.55, repeat: Infinity, ease: 'easeInOut' },
            } : {}}
          >
            <DarkCommander fall={darkFalls} />
          </CharSvgWrap>
        </motion.div>
      </DarkStage>

      {/* LIGHT CHAMPION */}
      <LightStage
        animate={lightCtrl}
        initial={{ x: 0, opacity: 0 }}
        style={{ opacity: phase === 'IDLE' ? 0 : 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.0, ease: 'easeOut' }}
        >
          <CharSvgWrap
            $sway={!fighting && !lightWins}
            animate={fighting && !lightWins ? {
              rotate: [2, -2.5, 2, -1.5, 2],
              transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
            } : {}}
          >
            <LightChampion victory={lightWins} />
          </CharSvgWrap>
        </motion.div>
      </LightStage>

      {/* Cinematic text */}
      <AnimatePresence>
        {showText && (
          <TextOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          >
            <CineLine
              initial={{ opacity: 0, y: 22, letterSpacing: '10px' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '2px' }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(135deg, #da4ea2, #61dafb, #da4ea2)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              From chaos to clean architecture.
            </CineLine>
            <CineSubLine
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              I build scalable, production-ready systems.
            </CineSubLine>
          </TextOverlay>
        )}
      </AnimatePresence>

      {done && (
        <ReplayBtn
          onClick={replay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          ↺ Replay
        </ReplayBtn>
      )}

      {/* Seamless bottom fade into homepage */}
      <BottomFade />
    </SceneWrapper>
  );
}
