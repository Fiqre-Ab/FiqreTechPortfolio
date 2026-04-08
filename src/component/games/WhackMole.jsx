import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

/* ---------- animations ---------- */

const popUp = keyframes`
  0%   { transform: translateY(100%) scale(0.8); opacity: 0.3; }
  30%  { transform: translateY(0%)   scale(1.1); opacity: 1; }
  60%  { transform: translateY(0%)   scale(1.0); opacity: 1; }
  100% { transform: translateY(100%) scale(0.8); opacity: 0.3; }
`;

const hitFlash = keyframes`
  0%   { background: rgba(108,194,74,0.4); }
  100% { background: transparent; }
`;

const countdownPulse = keyframes`
  0%   { transform: scale(1);   opacity: 1; }
  50%  { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1);   opacity: 1; }
`;

/* ---------- styled ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const TopRow = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
`;

const Stat = styled.div`
  text-align: center;
  span { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; color: #7ec8f4; }
  strong { font-size: 1.6rem; color: white; }
`;

const TimerBar = styled.div`
  width: 100%;
  max-width: 340px;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const TimerFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$pct > 50 ? '#6cc24a' : p.$pct > 25 ? '#f89820' : '#ff4757'};
  border-radius: 3px;
  transition: width 0.5s linear, background 0.5s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Hole = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(10, 8, 25, 0.9);
  border: 2px solid rgba(52, 152, 219, 0.25);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: border-color 0.15s;
  box-shadow: inset 0 6px 16px rgba(0,0,0,0.6);

  &:hover { border-color: rgba(52,152,219,0.5); }

  ${p => p.$flash && css`animation: ${hitFlash} 0.3s ease-out;`}

  @media (max-width: 480px) {
    width: 72px;
    height: 72px;
  }
`;

const Mole = styled.div`
  font-size: ${p => p.$type === 'bomb' ? '2.2rem' : '2.4rem'};
  line-height: 1;
  padding-bottom: 4px;
  user-select: none;
  animation: ${p => p.$active ? css`${popUp} ${p.$dur}ms ease-in-out forwards` : 'none'};
  cursor: pointer;
  filter: ${p => p.$type === 'bomb' ? 'hue-rotate(30deg)' : 'none'};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  padding: 10px 24px;
  border-radius: 22px;
  border: 1px solid rgba(52,152,219,0.5);
  background: rgba(52,152,219,0.1);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(52,152,219,0.25); transform: translateY(-2px); }
`;

const ComboTag = styled.div`
  font-size: 0.8rem;
  color: #f89820;
  font-weight: 700;
  min-height: 20px;
  animation: ${countdownPulse} 0.3s ease-out;
  letter-spacing: 0.5px;
`;

const BestRow = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: #7ec8f4;
`;

/* ---------- game logic ---------- */

const HOLE_COUNT = 9;
const GAME_TIME = 30;

const MOLE_TYPES = [
  { type: 'normal', emoji: '🐹', points: 10 },
  { type: 'golden', emoji: '✨', points: 25 },
  { type: 'bomb',   emoji: '💣', points: -15 },
];

function pickType(level) {
  const r = Math.random();
  if (r < 0.12 + level * 0.02) return MOLE_TYPES[2]; // bomb
  if (r < 0.25) return MOLE_TYPES[1]; // golden
  return MOLE_TYPES[0]; // normal
}

export default function WhackMole() {
  const [holes, setHoles] = useState(Array(HOLE_COUNT).fill(null));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [running, setRunning] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboMsg, setComboMsg] = useState('');
  const [flash, setFlash] = useState(Array(HOLE_COUNT).fill(false));
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('whackBest') || '0'));
  const [level, setLevel] = useState(1);

  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const moleTimers = useRef([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const levelRef = useRef(1);

  const clearAllTimers = () => {
    clearInterval(timerRef.current);
    clearTimeout(spawnRef.current);
    moleTimers.current.forEach(clearTimeout);
    moleTimers.current = [];
  };

  const spawnMole = useCallback(() => {
    if (!running) return;
    // Find empty holes
    setHoles(prev => {
      const empty = prev.map((v, i) => v ? null : i).filter(i => i !== null);
      if (empty.length === 0) return prev;

      const idx = empty[Math.floor(Math.random() * empty.length)];
      const moleType = pickType(levelRef.current);
      const dur = Math.max(600, 1400 - levelRef.current * 80);
      const next = [...prev];
      next[idx] = { ...moleType, dur };

      // Auto-hide
      const t = setTimeout(() => {
        setHoles(h => {
          const n = [...h];
          n[idx] = null;
          return n;
        });
        comboRef.current = 0;
        setCombo(0);
        setComboMsg('');
      }, dur);
      moleTimers.current.push(t);

      return next;
    });

    // Schedule next spawn
    const delay = Math.max(300, 900 - levelRef.current * 60);
    spawnRef.current = setTimeout(spawnMole, delay);
  }, [running]);

  const startGame = () => {
    clearAllTimers();
    scoreRef.current = 0;
    comboRef.current = 0;
    levelRef.current = 1;
    setScore(0);
    setTimeLeft(GAME_TIME);
    setCombo(0);
    setComboMsg('');
    setLevel(1);
    setHoles(Array(HOLE_COUNT).fill(null));
    setRunning(true);
  };

  // Timer
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        // Level up every 10 seconds
        const elapsed = GAME_TIME - next;
        levelRef.current = Math.min(5, 1 + Math.floor(elapsed / 8));
        setLevel(levelRef.current);
        if (next <= 0) {
          clearAllTimers();
          setRunning(false);
          setHoles(Array(HOLE_COUNT).fill(null));
          const final = scoreRef.current;
          if (final > best) {
            setBest(final);
            localStorage.setItem('whackBest', String(final));
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, best]);

  // Spawn loop
  useEffect(() => {
    if (!running) return;
    spawnRef.current = setTimeout(spawnMole, 400);
    return () => {
      clearTimeout(spawnRef.current);
      moleTimers.current.forEach(clearTimeout);
      moleTimers.current = [];
    };
  }, [running, spawnMole]);

  const whack = (idx) => {
    const mole = holes[idx];
    if (!mole || !running) return;

    // Flash hole
    setFlash(f => { const n = [...f]; n[idx] = true; return n; });
    setTimeout(() => setFlash(f => { const n = [...f]; n[idx] = false; return n; }), 300);

    // Remove mole
    setHoles(prev => { const n = [...prev]; n[idx] = null; return n; });

    // Score
    if (mole.type === 'bomb') {
      comboRef.current = 0;
      setCombo(0);
      setComboMsg('💥 BOOM! -15');
      const ns = Math.max(0, scoreRef.current + mole.points);
      scoreRef.current = ns;
      setScore(ns);
    } else {
      comboRef.current++;
      setCombo(comboRef.current);
      const multiplier = Math.min(comboRef.current, 5);
      const pts = mole.points * multiplier;
      const ns = scoreRef.current + pts;
      scoreRef.current = ns;
      setScore(ns);

      if (comboRef.current >= 5) setComboMsg(`🔥 x${comboRef.current} COMBO! +${pts}`);
      else if (comboRef.current >= 3) setComboMsg(`⚡ x${comboRef.current} COMBO! +${pts}`);
      else setComboMsg(`+${pts}`);
    }

    setTimeout(() => setComboMsg(''), 700);
  };

  const isOver = !running && timeLeft === 0;

  return (
    <Wrapper>
      <TopRow>
        <Stat><span>Score</span><strong>{score}</strong></Stat>
        <Stat><span>Best</span><strong>{best}</strong></Stat>
        <Stat><span>Time</span><strong>{timeLeft}s</strong></Stat>
        <Stat><span>Level</span><strong>{level}</strong></Stat>
      </TopRow>

      <TimerBar>
        <TimerFill $pct={(timeLeft / GAME_TIME) * 100} />
      </TimerBar>

      <ComboTag key={comboMsg}>{comboMsg || (combo >= 2 ? `x${combo} combo!` : '')}</ComboTag>

      <Grid>
        {holes.map((mole, i) => (
          <Hole key={i} onClick={() => whack(i)} $flash={flash[i]}>
            {mole && (
              <Mole $active $dur={mole.dur} $type={mole.type}>
                {mole.emoji}
              </Mole>
            )}
          </Hole>
        ))}
      </Grid>

      <BestRow>🐹 Normal +10 &nbsp; ✨ Golden +25 &nbsp; 💣 Bomb -15 (avoid!)</BestRow>

      <BtnRow>
        {!running && timeLeft === GAME_TIME && (
          <Btn onClick={startGame}>▶ Start Game</Btn>
        )}
        {isOver && (
          <Btn onClick={startGame}>🔄 Play Again</Btn>
        )}
        {running && (
          <Btn onClick={() => { clearAllTimers(); setRunning(false); setHoles(Array(HOLE_COUNT).fill(null)); setTimeLeft(GAME_TIME); }}>
            ↩ Quit
          </Btn>
        )}
      </BtnRow>
    </Wrapper>
  );
}
