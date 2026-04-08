import { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

/* ---------- styled components ---------- */

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 8px #da4ea2; }
  50%       { text-shadow: 0 0 22px #da4ea2; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const ScoreRow = styled.div`
  display: flex;
  gap: 32px;
`;

const Stat = styled.div`
  text-align: center;
  span { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; color: #7ec8f4; }
  strong { font-size: 1.6rem; color: white; animation: ${glow} 2s ease-in-out infinite; }
`;

const GameCanvas = styled.canvas`
  border: 2px solid rgba(218, 78, 162, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(218, 78, 162, 0.15), inset 0 0 20px rgba(0,0,0,0.4);
  display: block;
  touch-action: none;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Btn = styled.button`
  padding: 10px 24px;
  border-radius: 24px;
  border: 1px solid rgba(218, 78, 162, 0.5);
  background: rgba(218, 78, 162, 0.12);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(218, 78, 162, 0.28); transform: translateY(-2px); }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(0,0,0,0.72);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  pointer-events: none;
  h3 { margin: 0; font-size: 1.5rem; color: white; }
  p  { margin: 0; color: #b0bec5; font-size: 0.85rem; }
`;

const Wrap = styled.div`
  position: relative;
`;

const HintText = styled.p`
  color: #7ec8f4;
  font-size: 0.74rem;
  margin: 0;
  text-align: center;
`;

/* ---------- game constants ---------- */

const W = 400, H = 400;
const PADDLE_W = 70, PADDLE_H = 10, PADDLE_Y = H - 30;
const BALL_R = 7;
const COLS = 8, ROWS = 5;
const BRICK_W = Math.floor(W / COLS) - 4;
const BRICK_H = 18;
const BRICK_PAD = 4;
const BRICK_TOP = 40;

const COLORS = ['#da4ea2', '#3498db', '#f89820', '#6cc24a', '#a78bfa'];

function makeBricks(level = 1) {
  const rows = Math.min(ROWS + level - 1, 8);
  const bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      const hp = Math.min(level, 3);
      bricks.push({
        x: c * (BRICK_W + BRICK_PAD) + BRICK_PAD,
        y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
        alive: true,
        hp,
        maxHp: hp,
        color: COLORS[r % COLORS.length],
      });
    }
  }
  return bricks;
}

export default function BreakoutGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const frameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState('idle'); // idle | running | paused | win | over

  const initState = useCallback((lvl = 1) => {
    const angle = -Math.PI / 4 - Math.random() * Math.PI / 4;
    const speed = 3.5 + lvl * 0.3;
    return {
      paddle: { x: W / 2 - PADDLE_W / 2 },
      ball: { x: W / 2, y: PADDLE_Y - BALL_R - 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed },
      bricks: makeBricks(lvl),
      score: 0,
      lives: 3,
      level: lvl,
      running: false,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    // Background
    ctx.fillStyle = 'rgba(4, 6, 18, 0.97)';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(52,152,219,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Bricks
    s.bricks.forEach(b => {
      if (!b.alive) return;
      const alpha = 0.5 + (b.hp / b.maxHp) * 0.5;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = b.color + Math.round(alpha * 255).toString(16).padStart(2,'0');
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 4);
      ctx.fill();
      if (b.maxHp > 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.hp, b.x + BRICK_W / 2, b.y + BRICK_H - 5);
      }
    });
    ctx.shadowBlur = 0;

    // Paddle
    const grd = ctx.createLinearGradient(s.paddle.x, 0, s.paddle.x + PADDLE_W, 0);
    grd.addColorStop(0, '#da4ea2');
    grd.addColorStop(1, '#3498db');
    ctx.fillStyle = grd;
    ctx.shadowColor = '#da4ea2';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(s.paddle.x, PADDLE_Y, PADDLE_W, PADDLE_H, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    const bg = ctx.createRadialGradient(s.ball.x, s.ball.y, 0, s.ball.x, s.ball.y, BALL_R);
    bg.addColorStop(0, 'white');
    bg.addColorStop(0.5, '#61dafb');
    bg.addColorStop(1, 'rgba(97,218,251,0)');
    ctx.fillStyle = bg;
    ctx.shadowColor = '#61dafb';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.running) return;

    // Move ball
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall bounces
    if (s.ball.x - BALL_R < 0) { s.ball.x = BALL_R; s.ball.vx = Math.abs(s.ball.vx); }
    if (s.ball.x + BALL_R > W) { s.ball.x = W - BALL_R; s.ball.vx = -Math.abs(s.ball.vx); }
    if (s.ball.y - BALL_R < 0) { s.ball.y = BALL_R; s.ball.vy = Math.abs(s.ball.vy); }

    // Paddle collision
    if (
      s.ball.y + BALL_R >= PADDLE_Y &&
      s.ball.y + BALL_R <= PADDLE_Y + PADDLE_H + 4 &&
      s.ball.x >= s.paddle.x - BALL_R &&
      s.ball.x <= s.paddle.x + PADDLE_W + BALL_R
    ) {
      const rel = (s.ball.x - (s.paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2);
      const angle = rel * (Math.PI / 3);
      const speed = Math.hypot(s.ball.vx, s.ball.vy);
      s.ball.vx = Math.sin(angle) * speed;
      s.ball.vy = -Math.abs(Math.cos(angle) * speed);
      s.ball.y = PADDLE_Y - BALL_R - 1;
    }

    // Ball lost
    if (s.ball.y - BALL_R > H) {
      s.lives--;
      setLives(s.lives);
      if (s.lives <= 0) {
        s.running = false;
        setPhase('over');
        draw();
        return;
      }
      // Reset ball
      s.ball.x = s.paddle.x + PADDLE_W / 2;
      s.ball.y = PADDLE_Y - BALL_R - 2;
      s.ball.vx = (Math.random() > 0.5 ? 1 : -1) * (3.5 + s.level * 0.3);
      s.ball.vy = -(3.5 + s.level * 0.3);
    }

    // Brick collisions
    for (const b of s.bricks) {
      if (!b.alive) continue;
      if (
        s.ball.x + BALL_R > b.x &&
        s.ball.x - BALL_R < b.x + BRICK_W &&
        s.ball.y + BALL_R > b.y &&
        s.ball.y - BALL_R < b.y + BRICK_H
      ) {
        b.hp--;
        if (b.hp <= 0) b.alive = false;
        const overlapX = Math.min(s.ball.x + BALL_R - b.x, b.x + BRICK_W - (s.ball.x - BALL_R));
        const overlapY = Math.min(s.ball.y + BALL_R - b.y, b.y + BRICK_H - (s.ball.y - BALL_R));
        if (overlapX < overlapY) s.ball.vx *= -1; else s.ball.vy *= -1;
        s.score += 10 * s.level;
        setScore(s.score);
        break;
      }
    }

    // Level complete
    if (s.bricks.every(b => !b.alive)) {
      s.running = false;
      const nextLvl = s.level + 1;
      setLevel(nextLvl);
      setPhase('win');
      draw();
      return;
    }

    draw();
    frameRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const startGame = useCallback((lvl = 1, keepScore = false) => {
    cancelAnimationFrame(frameRef.current);
    const ns = initState(lvl);
    ns.running = true;
    if (keepScore && stateRef.current) ns.score = stateRef.current.score;
    stateRef.current = ns;
    setScore(ns.score);
    setLives(ns.lives);
    setLevel(ns.level);
    setPhase('running');
    frameRef.current = requestAnimationFrame(tick);
  }, [initState, tick]);

  // Keyboard / mouse / touch paddle control
  useEffect(() => {
    const onKey = (e) => {
      const s = stateRef.current;
      if (!s || !s.running) return;
      const step = 18;
      if (e.key === 'ArrowLeft')  s.paddle.x = Math.max(0, s.paddle.x - step);
      if (e.key === 'ArrowRight') s.paddle.x = Math.min(W - PADDLE_W, s.paddle.x + step);
    };
    const onMove = (e) => {
      const s = stateRef.current;
      if (!s || !s.running) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const mx = (clientX - rect.left) * (W / rect.width);
      s.paddle.x = Math.max(0, Math.min(W - PADDLE_W, mx - PADDLE_W / 2));
    };
    window.addEventListener('keydown', onKey);
    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', onMove);
    canvas?.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      canvas?.removeEventListener('mousemove', onMove);
      canvas?.removeEventListener('touchmove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    stateRef.current = initState(1);
    draw();
  }, [initState, draw]);

  return (
    <Wrapper>
      <ScoreRow>
        <Stat><span>Score</span><strong>{score}</strong></Stat>
        <Stat><span>Lives</span><strong>{'❤️'.repeat(Math.max(0, lives))}</strong></Stat>
        <Stat><span>Level</span><strong>{level}</strong></Stat>
      </ScoreRow>

      <Wrap>
        <GameCanvas ref={canvasRef} width={W} height={H} />
        {phase !== 'running' && (
          <Overlay>
            {phase === 'idle' && <><h3>Breakout 🧱</h3><p>Move mouse / arrow keys</p></>}
            {phase === 'over' && <><h3>Game Over!</h3><p>Score: {score}</p></>}
            {phase === 'win'  && <><h3>Level Clear! 🎉</h3><p>Get ready for level {level}…</p></>}
          </Overlay>
        )}
      </Wrap>

      <BtnRow>
        {phase === 'idle' && <Btn onClick={() => startGame(1)}>▶ Start Game</Btn>}
        {phase === 'running' && <Btn onClick={() => { stateRef.current.running = false; setPhase('paused'); }}>⏸ Pause</Btn>}
        {phase === 'paused' && <Btn onClick={() => { stateRef.current.running = true; setPhase('running'); frameRef.current = requestAnimationFrame(tick); }}>▶ Resume</Btn>}
        {phase === 'win' && <Btn onClick={() => startGame(level, true)}>Next Level ➡</Btn>}
        {phase === 'over' && <Btn onClick={() => { setScore(0); setLevel(1); startGame(1); }}>🔄 Play Again</Btn>}
        {phase !== 'idle' && <Btn onClick={() => { cancelAnimationFrame(frameRef.current); setScore(0); setLevel(1); stateRef.current = initState(1); draw(); setPhase('idle'); }}>↩ Restart</Btn>}
      </BtnRow>

      <HintText>Move mouse over canvas or use ◀ ▶ arrow keys</HintText>
    </Wrapper>
  );
}
