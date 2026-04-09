import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, useCallback, Suspense, lazy } from 'react';

const Scene3D     = lazy(() => import('../component/Scene3D'));
const BattleScene = lazy(() => import('../component/BattleScene'));

/* ---------- keyframes ---------- */

const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px #3498db, 0 0 20px #3498db; }
  50%       { text-shadow: 0 0 16px #da4ea2, 0 0 40px #da4ea2, 0 0 80px #da4ea2; }
`;

const btnPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(218,78,162,0.5); }
  50%       { box-shadow: 0 0 0 14px rgba(218,78,162,0); }
`;

const drift = keyframes`
  0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.15; }
  33%  { transform: translateY(-30px) translateX(15px) rotate(60deg); opacity: 0.35; }
  66%  { transform: translateY(15px) translateX(-10px) rotate(120deg); opacity: 0.2; }
  100% { transform: translateY(0) translateX(0) rotate(180deg); opacity: 0.15; }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const driveAcross = keyframes`
  0%   { transform: translateX(-220px); }
  100% { transform: translateX(calc(100vw + 220px)); }
`;

const carBounce = keyframes`
  0%, 100% { bottom: 18px; }
  50%       { bottom: 22px; }
`;

const cloudFloat = keyframes`
  0%   { transform: translateX(-320px); opacity: 0; }
  5%   { opacity: 0.7; }
  95%  { opacity: 0.7; }
  100% { transform: translateX(calc(100vw + 320px)); opacity: 0; }
`;

const starTwinkle = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.5); }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(3deg); }
  66%       { transform: translateY(6px) rotate(-2deg); }
`;

const scrollBounce = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%       { transform: translateY(8px); opacity: 1; }
`;

const highlightSlide = keyframes`
  from { transform: translateX(-12px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

/* ---------- particle bg ---------- */

const ParticleCanvas = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Particle = styled.span`
  position: absolute;
  border-radius: 50%;
  animation: ${drift} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  filter: blur(${p => p.$blur}px);
`;

/* ---------- floating tech icons ---------- */

const TechIconWrap = styled(motion.div)`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  font-size: ${p => p.$size}px;
  animation: ${iconFloat} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  opacity: 0.25;
  filter: blur(0.3px);
`;

/* ---------- twinkling stars ---------- */

const TwinkleStar = styled.div`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  font-size: ${p => p.$size}px;
  animation: ${starTwinkle} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  color: white;
`;

/* ---------- cloud ---------- */

const CloudWrapper = styled.div`
  position: absolute;
  top: ${p => p.$top}%;
  animation: ${cloudFloat} ${p => p.$dur}s linear infinite;
  animation-delay: ${p => p.$delay}s;
  pointer-events: none;
  z-index: 1;
`;

/* ---------- car lane ---------- */

const CarLane = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
`;

const Road = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(218,78,162,0.35), transparent);
`;

const CarWrapper = styled.div`
  position: absolute;
  bottom: 18px;
  animation:
    ${driveAcross} 9s linear infinite,
    ${carBounce} 0.45s ease-in-out infinite;
  animation-delay: 0s, 0.1s;
`;

/* ---------- scroll hint ---------- */

const ScrollHint = styled.div`
  position: absolute;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 3;
  pointer-events: none;
`;

const ScrollText = styled.span`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const ScrollArrow = styled.span`
  font-size: 1rem;
  color: rgba(218,78,162,0.5);
  animation: ${scrollBounce} 1.8s ease-in-out infinite;
`;

/* ---------- layout ---------- */

const Section = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Containers = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 80px 90px 100px;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) { padding: 60px 40px 100px; }
  @media (max-width: 768px) { flex-direction: column; padding: 24px 18px 100px; gap: 0; align-items: flex-start; }
  @media (max-width: 480px) { padding: 16px 14px 90px; }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 768px) { width: 100%; gap: 12px; }
`;

const Greeting = styled(motion.p)`
  font-size: 0.95rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #da4ea2;
  font-weight: 600;

  @media (max-width: 480px) { font-size: 0.78rem; letter-spacing: 2px; }
`;

const Title = styled(motion.h1)`
  font-size: 68px;
  color: #3498db;
  line-height: 1.05;
  animation: ${glowPulse} 4s ease-in-out infinite;

  @media (max-width: 900px) { font-size: 50px; }
  @media (max-width: 768px) { font-size: 2.5rem; }
  @media (max-width: 480px) { font-size: 1.9rem; }
`;

const RoleBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RoleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoleLine = styled.span`
  display: inline-block;
  width: 36px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #da4ea2);
  border-radius: 2px;
  flex-shrink: 0;
`;

const Role = styled.h2`
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.25rem;
  font-weight: 700;

  @media (max-width: 480px) { font-size: 1rem; }
`;

const SubRole = styled.p`
  color: #7a9bbf;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  padding-left: 48px;

  @media (max-width: 480px) { font-size: 0.75rem; padding-left: 0; }
`;

const ValueLine = styled(motion.p)`
  font-size: 0.97rem;
  color: #c0cfe0;
  line-height: 1.75;
  max-width: 480px;
  border-left: 2px solid rgba(218,78,162,0.4);
  padding-left: 14px;

  @media (max-width: 480px) { font-size: 0.88rem; }
`;

const SkillRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const Badge = styled(motion.span)`
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 600;
  border: 1px solid ${p => p.$border};
  color: ${p => p.$color};
  background: ${p => p.$bg};
  cursor: default;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-3px) scale(1.07);
    background: ${p => p.$hoverBg};
  }

  @media (max-width: 480px) { font-size: 0.7rem; padding: 4px 10px; }
`;

/* ---------- highlights ---------- */

const Highlights = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-width: 440px;
`;

const HighlightLine = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #b0cce0;
  animation: ${highlightSlide} 0.4s ease forwards;
  animation-delay: ${p => p.$delay}s;
  opacity: 0;

  &::before {
    content: '✔';
    color: #4ade80;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  @media (max-width: 480px) { font-size: 0.78rem; }
`;

/* ---------- current build ---------- */

const CurrentBuild = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(52,152,219,0.08);
  border: 1px solid rgba(52,152,219,0.2);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.78rem;
  color: #b0bec5;
  max-width: 440px;

  span.label {
    color: #3498db;
    font-weight: 700;
  }
`;

/* ---------- buttons ---------- */

const ButtonRow = styled(motion.div)`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const BtnPrimary = styled(motion(Link))`
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-weight: 600;
  padding: 11px 26px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  animation: ${btnPulse} 2.5s ease-in-out infinite;

  @media (max-width: 480px) { padding: 9px 20px; font-size: 0.84rem; }
`;

const BtnSecondary = styled(motion(Link))`
  color: #3498db;
  font-weight: 600;
  padding: 10px 24px;
  border: 1.5px solid rgba(52,152,219,0.6);
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  background: rgba(52,152,219,0.07);
  transition: background 0.2s, border-color 0.2s;

  &:hover { background: rgba(52,152,219,0.18); border-color: #3498db; color: white; }

  @media (max-width: 480px) { padding: 9px 20px; font-size: 0.84rem; }
`;

const BtnOutline = styled(motion(Link))`
  color: #b0bec5;
  font-weight: 600;
  padding: 10px 24px;
  border: 1.5px solid rgba(176,190,197,0.3);
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  background: rgba(176,190,197,0.04);
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover { background: rgba(176,190,197,0.12); border-color: rgba(176,190,197,0.6); color: white; }

  @media (max-width: 480px) { padding: 9px 20px; font-size: 0.84rem; }
`;

/* ---------- 3D scene pane ---------- */

const Right = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 420px;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 210px;
    max-height: 250px;
    margin-bottom: 10px;
  }
  @media (max-width: 480px) {
    min-height: 170px;
    max-height: 200px;
  }
`;

/* ---------- framer variants ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: 'easeOut' } }),
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: i => ({
    opacity: 1, scale: 1,
    transition: { delay: 0.8 + i * 0.06, type: 'spring', stiffness: 200 },
  }),
};

/* ---------- static data ---------- */

const PARTICLES = [
  { x: 10, y: 20, size: 80,  blur: 30, dur: 8,  delay: 0,   color: 'rgba(52,152,219,0.3)'  },
  { x: 80, y: 10, size: 60,  blur: 25, dur: 10, delay: 1,   color: 'rgba(218,78,162,0.25)' },
  { x: 50, y: 70, size: 100, blur: 40, dur: 12, delay: 2,   color: 'rgba(52,152,219,0.2)'  },
  { x: 90, y: 55, size: 50,  blur: 20, dur: 7,  delay: 0.5, color: 'rgba(218,78,162,0.3)'  },
  { x: 25, y: 80, size: 70,  blur: 28, dur: 9,  delay: 3,   color: 'rgba(52,152,219,0.25)' },
  { x: 65, y: 35, size: 40,  blur: 15, dur: 11, delay: 1.5, color: 'rgba(218,78,162,0.2)'  },
];

const SKILLS = [
  { label: 'Java ☕',       color: '#f89820', border: '#f89820', bg: 'rgba(248,152,32,0.1)',  hoverBg: 'rgba(248,152,32,0.22)'  },
  { label: 'Spring Boot ⚡', color: '#6db33f', border: '#6db33f', bg: 'rgba(109,179,63,0.1)', hoverBg: 'rgba(109,179,63,0.22)' },
  { label: 'Kafka 🔄',      color: '#ff6b35', border: '#ff6b35', bg: 'rgba(255,107,53,0.1)',  hoverBg: 'rgba(255,107,53,0.22)'  },
  { label: 'React',         color: '#61dafb', border: '#61dafb', bg: 'rgba(97,218,251,0.08)', hoverBg: 'rgba(97,218,251,0.2)'   },
  { label: 'AWS ☁️',        color: '#ff9900', border: '#ff9900', bg: 'rgba(255,153,0,0.08)',  hoverBg: 'rgba(255,153,0,0.2)'    },
  { label: 'Node.js',       color: '#6cc24a', border: '#6cc24a', bg: 'rgba(108,194,74,0.08)', hoverBg: 'rgba(108,194,74,0.2)'   },
  { label: 'PostgreSQL',    color: '#336791', border: '#336791', bg: 'rgba(51,103,145,0.08)', hoverBg: 'rgba(51,103,145,0.2)'   },
  { label: 'Docker 🐳',     color: '#2496ed', border: '#2496ed', bg: 'rgba(36,150,237,0.08)', hoverBg: 'rgba(36,150,237,0.2)'   },
];

const HIGHLIGHTS = [
  'Built microservices using Spring Boot & Kafka',
  'Designed REST & GraphQL APIs with JWT security',
  'Deployed cloud-native apps on AWS & GCP',
  'Implemented CI/CD pipelines with GitHub Actions',
];

const STARS = [
  { x: 8,  y: 12, size: 12, dur: 2.1, delay: 0   },
  { x: 72, y: 8,  size: 14, dur: 2.8, delay: 1.2 },
  { x: 85, y: 30, size: 10, dur: 1.9, delay: 0.3 },
  { x: 60, y: 55, size: 16, dur: 3.5, delay: 2.1 },
  { x: 92, y: 68, size: 9,  dur: 2.4, delay: 0.9 },
  { x: 35, y: 20, size: 12, dur: 4.0, delay: 1.5 },
  { x: 77, y: 85, size: 13, dur: 3.2, delay: 1.8 },
  { x: 3,  y: 75, size: 8,  dur: 2.0, delay: 0.5 },
];

// Floating tech icons for parallax — each has a "depth" multiplier
const TECH_ICONS = [
  { icon: '☕', x: 5,   y: 25, size: 36, dur: 6,  delay: 0,   depth: 0.06 },
  { icon: '⚡', x: 88,  y: 15, size: 30, dur: 8,  delay: 1,   depth: 0.04 },
  { icon: '🔄', x: 12,  y: 70, size: 28, dur: 7,  delay: 2,   depth: 0.08 },
  { icon: '☁️', x: 82,  y: 72, size: 34, dur: 9,  delay: 0.5, depth: 0.03 },
  { icon: '⚛️', x: 48,  y: 88, size: 26, dur: 6,  delay: 3,   depth: 0.05 },
  { icon: '🐳', x: 72,  y: 42, size: 24, dur: 10, delay: 1.5, depth: 0.07 },
  { icon: '🔐', x: 22,  y: 45, size: 22, dur: 7,  delay: 2.5, depth: 0.04 },
  { icon: '🗄️', x: 60,  y: 18, size: 20, dur: 8,  delay: 4,   depth: 0.06 },
];

/* ---------- SVG Car ---------- */
function CartoonCar() {
  return (
    <svg width="158" height="68" viewBox="0 0 160 70" fill="none">
      <ellipse cx="80" cy="64" rx="60" ry="4.5" fill="rgba(0,0,0,0.2)" />
      <rect x="10" y="38" width="140" height="22" rx="8" fill="#da4ea2" />
      <path d="M 35 38 Q 42 14 75 12 L 110 12 Q 130 12 135 38 Z" fill="#c23d87" />
      <path d="M 48 38 Q 52 20 72 18 L 100 18 Q 115 18 118 38 Z" fill="rgba(97,218,251,0.55)" />
      <path d="M 55 36 Q 57 24 68 22 L 75 22 Q 65 24 62 36 Z" fill="rgba(255,255,255,0.3)" />
      <rect x="18" y="40" width="46" height="16" rx="3" fill="#e05ab0" />
      <rect x="72" y="40" width="72" height="16" rx="3" fill="#e05ab0" />
      <line x1="70" y1="40" x2="70" y2="56" stroke="#c23d87" strokeWidth="1.5" />
      <rect x="36" y="47" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.45)" />
      <rect x="98" y="47" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.45)" />
      <ellipse cx="145" cy="46" rx="8" ry="5" fill="rgba(255,230,100,0.9)" />
      <ellipse cx="145" cy="46" rx="5" ry="3" fill="rgba(255,255,200,1)" />
      <ellipse cx="145" cy="46" rx="14" ry="7" fill="rgba(255,230,100,0.12)" />
      <ellipse cx="18" cy="46" rx="7" ry="4.5" fill="rgba(255,80,80,0.8)" />
      <circle cx="38" cy="57" r="13" fill="#1a1a2e" />
      <circle cx="38" cy="57" r="9" fill="#2d2d4a" />
      <circle cx="38" cy="57" r="5" fill="#3498db" />
      <circle cx="38" cy="57" r="2" fill="#61dafb" />
      <circle cx="118" cy="57" r="13" fill="#1a1a2e" />
      <circle cx="118" cy="57" r="9" fill="#2d2d4a" />
      <circle cx="118" cy="57" r="5" fill="#3498db" />
      <circle cx="118" cy="57" r="2" fill="#61dafb" />
      <line x1="38" y1="48" x2="38" y2="66" stroke="#4a4a6a" strokeWidth="1.5" />
      <line x1="29" y1="57" x2="47" y2="57" stroke="#4a4a6a" strokeWidth="1.5" />
      <line x1="118" y1="48" x2="118" y2="66" stroke="#4a4a6a" strokeWidth="1.5" />
      <line x1="109" y1="57" x2="127" y2="57" stroke="#4a4a6a" strokeWidth="1.5" />
      <line x1="100" y1="12" x2="100" y2="3" stroke="#da4ea2" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="3" r="2.5" fill="#61dafb" />
    </svg>
  );
}

/* ---------- Cloud SVG ---------- */
function Cloud({ size = 1 }) {
  return (
    <svg width={110 * size} height={45 * size} viewBox="0 0 110 45" fill="none">
      <ellipse cx="55" cy="35" rx="50" ry="12" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="35" cy="26" rx="26" ry="18" fill="rgba(255,255,255,0.05)" />
      <ellipse cx="68" cy="23" rx="24" ry="19" fill="rgba(255,255,255,0.05)" />
      <ellipse cx="50" cy="20" rx="18" ry="16" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

/* ---------- component ---------- */

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Mouse parallax — pre-compute transforms (Rules of Hooks: no hooks in loops)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 20 });

  const px0 = useTransform(smoothX, v => v * 100 * TECH_ICONS[0].depth);
  const py0 = useTransform(smoothY, v => v * 100 * TECH_ICONS[0].depth);
  const px1 = useTransform(smoothX, v => v * 100 * TECH_ICONS[1].depth);
  const py1 = useTransform(smoothY, v => v * 100 * TECH_ICONS[1].depth);
  const px2 = useTransform(smoothX, v => v * 100 * TECH_ICONS[2].depth);
  const py2 = useTransform(smoothY, v => v * 100 * TECH_ICONS[2].depth);
  const px3 = useTransform(smoothX, v => v * 100 * TECH_ICONS[3].depth);
  const py3 = useTransform(smoothY, v => v * 100 * TECH_ICONS[3].depth);
  const px4 = useTransform(smoothX, v => v * 100 * TECH_ICONS[4].depth);
  const py4 = useTransform(smoothY, v => v * 100 * TECH_ICONS[4].depth);
  const px5 = useTransform(smoothX, v => v * 100 * TECH_ICONS[5].depth);
  const py5 = useTransform(smoothY, v => v * 100 * TECH_ICONS[5].depth);
  const px6 = useTransform(smoothX, v => v * 100 * TECH_ICONS[6].depth);
  const py6 = useTransform(smoothY, v => v * 100 * TECH_ICONS[6].depth);
  const px7 = useTransform(smoothX, v => v * 100 * TECH_ICONS[7].depth);
  const py7 = useTransform(smoothY, v => v * 100 * TECH_ICONS[7].depth);

  const iconMotions = [
    { x: px0, y: py0 }, { x: px1, y: py1 }, { x: px2, y: py2 }, { x: px3, y: py3 },
    { x: px4, y: py4 }, { x: px5, y: py5 }, { x: px6, y: py6 }, { x: px7, y: py7 },
  ];

  const handleMouseMove = useCallback((e) => {
    rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
  }, [rawX, rawY]);

  return (
    <Section onMouseMove={handleMouseMove}>
      {/* Ambient particles */}
      <ParticleCanvas>
        {PARTICLES.map((p, i) => (
          <Particle key={i} $x={p.x} $y={p.y} $size={p.size} $blur={p.blur}
            $dur={p.dur} $delay={p.delay} $color={p.color} />
        ))}
      </ParticleCanvas>

      {/* Twinkling stars */}
      {STARS.map((s, i) => (
        <TwinkleStar key={i} $x={s.x} $y={s.y} $size={s.size} $dur={s.dur} $delay={s.delay}>✦</TwinkleStar>
      ))}

      {/* Floating clouds */}
      <CloudWrapper $top={7}  $dur={30} $delay={0}><Cloud size={1.1} /></CloudWrapper>
      <CloudWrapper $top={16} $dur={38} $delay={12}><Cloud size={0.75} /></CloudWrapper>
      <CloudWrapper $top={4}  $dur={45} $delay={22}><Cloud size={1.3} /></CloudWrapper>

      {/* Floating tech icons — parallax on mouse */}
      {TECH_ICONS.map((t, i) => (
        <TechIconWrap key={i} $x={t.x} $y={t.y} $size={t.size} $dur={t.dur} $delay={t.delay}
          style={{ x: iconMotions[i].x, y: iconMotions[i].y }}>
          {t.icon}
        </TechIconWrap>
      ))}

      <Containers>
        <Left>
          <Greeting variants={fadeUp} custom={0} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            Hi, I'm Fiqre 👋
          </Greeting>

          <Title variants={fadeUp} custom={0.12} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            Backend-Focused<br />Full Stack Dev
          </Title>

          <RoleBlock variants={fadeUp} custom={0.25} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            <RoleWrapper>
              <RoleLine />
              <Role>Java · Spring Boot · Microservices · Kafka</Role>
            </RoleWrapper>
            <SubRole>AWS · Docker · REST APIs · JWT · PostgreSQL</SubRole>
          </RoleBlock>

          <ValueLine variants={fadeUp} custom={0.37} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            I build scalable microservices, secure APIs, and cloud-native systems used in real-world applications.
            Experience building production-ready systems and scalable architectures.
          </ValueLine>

          <SkillRow initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            {SKILLS.map((s, i) => (
              <Badge key={s.label} variants={badgeVariants} custom={i}
                $color={s.color} $border={s.border} $bg={s.bg} $hoverBg={s.hoverBg}>
                {s.label}
              </Badge>
            ))}
          </SkillRow>

          <Highlights variants={fadeUp} custom={0.65} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            {HIGHLIGHTS.map((h, i) => (
              <HighlightLine key={i} $delay={0.75 + i * 0.12}>{h}</HighlightLine>
            ))}
          </Highlights>

          <ButtonRow variants={fadeUp} custom={0.9} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            <BtnPrimary to="/contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Contact Me
            </BtnPrimary>
            <BtnSecondary to="/portfolio" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              View Work
            </BtnSecondary>
            <BtnOutline to="/resume" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Resume
            </BtnOutline>
          </ButtonRow>

          <CurrentBuild variants={fadeUp} custom={1.05} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
            🚀 <span className="label">Currently Building:</span>&nbsp;
            Task Management System — Spring Boot + React + JWT + Microservices
          </CurrentBuild>
        </Left>

        <Right
          initial={{ opacity: 0, x: 60 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Right>
      </Containers>

      {/* Scroll hint */}
      <ScrollHint>
        <ScrollText>Scroll to explore</ScrollText>
        <ScrollArrow>↓</ScrollArrow>
      </ScrollHint>

      {/* Car lane */}
      <CarLane>
        <Road />
        <CarWrapper><CartoonCar /></CarWrapper>
      </CarLane>

      {/* ⚔ Cinematic Battle Scene */}
      <Suspense fallback={null}>
        <BattleScene />
      </Suspense>
    </Section>
  );
}

export default Home;
