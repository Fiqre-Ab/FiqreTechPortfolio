import { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 8px #3498db; }
  50%       { text-shadow: 0 0 20px #61dafb; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ScoreRow = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const ScoreBadge = styled.div`
  text-align: center;
  span {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #7ec8f4;
  }
  strong {
    font-size: 1.8rem;
    color: white;
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const GameCanvas = styled.canvas`
  border: 2px solid rgba(52, 152, 219, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(52, 152, 219, 0.15), inset 0 0 20px rgba(0,0,0,0.4);
  display: block;
  cursor: none;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const Btn = styled.button`
  padding: 10px 24px;
  border-radius: 24px;
  border: 1px solid rgba(52, 152, 219, 0.5);
  background: rgba(52, 152, 219, 0.12);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(52, 152, 219, 0.28);
    border-color: rgba(52, 152, 219, 0.9);
    transform: translateY(-2px);
  }

  &.start {
    background: linear-gradient(135deg, rgba(52,152,219,0.3), rgba(218,78,162,0.3));
    border-color: rgba(218, 78, 162, 0.6);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0,0,0,0.7);
  border-radius: 12px;
  pointer-events: none;

  h3 { margin: 0; font-size: 1.5rem; color: white; }
  p  { margin: 0; color: #b0bec5; font-size: 0.85rem; }
`;

const CanvasWrap = styled.div`
  position: relative;
`;

const ArrowPad = styled.div`
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  gap: 4px;
`;

const ArrowBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(52, 152, 219, 0.4);
  background: rgba(52, 152, 219, 0.1);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: ${p => p.$area};
  transition: background 0.15s;
  &:hover, &:active { background: rgba(52, 152, 219, 0.3); }
`;

/* ---------- game constants ---------- */

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;

const DIRECTIONS = {
  ArrowUp:    [0, -1],
  ArrowDown:  [0,  1],
  ArrowLeft:  [-1, 0],
  ArrowRight: [1,  0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
};

const OPPOSITE = {
  ArrowUp: 'ArrowDown', ArrowDown: 'ArrowUp',
  ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft',
};

function randomFood(snake) {
  let pos;
  do {
    pos = [
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS),
    ];
  } while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
  return pos;
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: [[10, 10]],
    dir: [1, 0],
    nextDir: [1, 0],
    food: [15, 10],
    score: 0,
    running: false,
    gameOver: false,
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('snakeBest') || '0'));
  const [phase, setPhase] = useState('idle'); // idle | running | over
  const frameRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = stateRef.current;

    // background
    ctx.fillStyle = 'rgba(5, 8, 20, 0.95)';
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(52, 152, 219, 0.07)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // food
    const [fx, fy] = food;
    ctx.shadowColor = '#da4ea2';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#da4ea2';
    ctx.beginPath();
    ctx.arc(fx * CELL + CELL / 2, fy * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake
    snake.forEach(([x, y], i) => {
      const pct = 1 - i / snake.length;
      const r = Math.round(52 + (97 - 52) * (1 - pct));
      const g = Math.round(152 + (218 - 152) * (1 - pct));
      const b = Math.round(219 + (251 - 219) * (1 - pct));
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.shadowBlur = i === 0 ? 12 : 6;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.roundRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 6 : 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    s.dir = s.nextDir;
    const head = [s.snake[0][0] + s.dir[0], s.snake[0][1] + s.dir[1]];

    // wall collision
    if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) {
      s.running = false;
      s.gameOver = true;
      setPhase('over');
      return;
    }
    // self collision
    if (s.snake.some(([x, y]) => x === head[0] && y === head[1])) {
      s.running = false;
      s.gameOver = true;
      setPhase('over');
      return;
    }

    const ate = head[0] === s.food[0] && head[1] === s.food[1];
    s.snake = [head, ...s.snake];
    if (ate) {
      s.score += 10;
      s.food = randomFood(s.snake);
      setScore(s.score);
      if (s.score > best) {
        setBest(s.score);
        localStorage.setItem('snakeBest', String(s.score));
      }
    } else {
      s.snake.pop();
    }

    draw();

    const speed = Math.max(60, 150 - Math.floor(s.score / 50) * 10);
    frameRef.current = setTimeout(tick, speed);
  }, [draw, best]);

  const startGame = useCallback(() => {
    clearTimeout(frameRef.current);
    const initSnake = [[10, 10], [9, 10], [8, 10]];
    stateRef.current = {
      snake: initSnake,
      dir: [1, 0],
      nextDir: [1, 0],
      food: randomFood(initSnake),
      score: 0,
      running: true,
      gameOver: false,
    };
    setScore(0);
    setPhase('running');
    draw();
    frameRef.current = setTimeout(tick, 150);
  }, [draw, tick]);

  const changeDir = useCallback((key) => {
    const newDir = DIRECTIONS[key];
    if (!newDir) return;
    const s = stateRef.current;
    const curKey = Object.keys(DIRECTIONS).find(
      k => DIRECTIONS[k][0] === s.dir[0] && DIRECTIONS[k][1] === s.dir[1]
    );
    if (OPPOSITE[curKey] === key) return;
    s.nextDir = newDir;
  }, []);

  useEffect(() => {
    draw();
    const onKey = (e) => {
      if (Object.keys(DIRECTIONS).includes(e.key)) {
        e.preventDefault();
        changeDir(e.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(frameRef.current);
    };
  }, [draw, changeDir]);

  return (
    <Wrapper>
      <ScoreRow>
        <ScoreBadge><span>Score</span><strong>{score}</strong></ScoreBadge>
        <ScoreBadge><span>Best</span><strong>{best}</strong></ScoreBadge>
      </ScoreRow>

      <CanvasWrap>
        <GameCanvas ref={canvasRef} width={W} height={H} />
        {phase !== 'running' && (
          <Overlay>
            {phase === 'over' && <h3>Game Over!</h3>}
            {phase === 'over' && <p>Score: {score}</p>}
            {phase === 'idle' && <h3>Snake 🐍</h3>}
            {phase === 'idle' && <p>Use arrow keys or WASD</p>}
          </Overlay>
        )}
      </CanvasWrap>

      <ControlsRow>
        <Btn className="start" onClick={startGame}>
          {phase === 'over' ? '🔄 Play Again' : '▶ Start Game'}
        </Btn>
        <ArrowPad>
          <ArrowBtn $area="up"    onClick={() => changeDir('ArrowUp')}>▲</ArrowBtn>
          <ArrowBtn $area="left"  onClick={() => changeDir('ArrowLeft')}>◀</ArrowBtn>
          <ArrowBtn $area="right" onClick={() => changeDir('ArrowRight')}>▶</ArrowBtn>
          <ArrowBtn $area="down"  onClick={() => changeDir('ArrowDown')}>▼</ArrowBtn>
        </ArrowPad>
      </ControlsRow>
    </Wrapper>
  );
}
