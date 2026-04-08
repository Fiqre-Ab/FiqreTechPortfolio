import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const popIn = keyframes`
  0%   { transform: scale(0.2) rotate(-20deg); opacity: 0; }
  70%  { transform: scale(1.15) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const winGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px rgba(108, 194, 74, 0.4); }
  50%       { box-shadow: 0 0 20px rgba(108, 194, 74, 0.8); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const StatusBar = styled.div`
  text-align: center;
  min-height: 32px;
`;

const Status = styled(motion.p)`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${p => p.$color || 'white'};
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const Cell = styled.button`
  width: 90px;
  height: 90px;
  border-radius: 14px;
  border: 2px solid ${p => p.$win ? 'rgba(108, 194, 74, 0.7)' : 'rgba(52, 152, 219, 0.3)'};
  background: ${p => p.$win ? 'rgba(108, 194, 74, 0.12)' : 'rgba(52, 152, 219, 0.07)'};
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  animation: ${p => p.$win ? winGlow : 'none'} 1.5s ease-in-out infinite;

  &:hover:not(:disabled) {
    background: rgba(52, 152, 219, 0.18);
    border-color: rgba(52, 152, 219, 0.6);
    transform: scale(1.05);
  }

  span {
    display: inline-block;
    animation: ${popIn} 0.3s ease-out forwards;
  }

  @media (max-width: 480px) {
    width: 72px;
    height: 72px;
    font-size: 1.8rem;
  }
`;

const ScoreRow = styled.div`
  display: flex;
  gap: 16px;
`;

const ScoreCard = styled.div`
  padding: 10px 20px;
  border-radius: 12px;
  background: ${p => p.$active ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${p => p.$active ? 'rgba(52, 152, 219, 0.5)' : 'rgba(255,255,255,0.08)'};
  text-align: center;
  transition: all 0.3s;

  span {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #7ec8f4;
    margin-bottom: 4px;
  }
  strong {
    font-size: 1.5rem;
    color: white;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  padding: 10px 22px;
  border-radius: 22px;
  border: 1px solid rgba(218, 78, 162, 0.5);
  background: rgba(218, 78, 162, 0.1);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(218, 78, 162, 0.25);
    transform: translateY(-2px);
  }
`;

const DiffRow = styled.div`
  display: flex;
  gap: 8px;
`;

const DiffBtn = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid ${p => p.$active ? 'rgba(97,218,251,0.7)' : 'rgba(97,218,251,0.2)'};
  background: ${p => p.$active ? 'rgba(97,218,251,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#61dafb' : '#7ec8f4'};
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(97,218,251,0.5); }
`;

/* ---------- minimax AI ---------- */

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: 'draw' };
  return null;
}

function minimax(board, isMax, alpha, beta, depth) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const val = minimax(board, false, alpha, beta, depth + 1);
        board[i] = null;
        best = Math.max(best, val);
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const val = minimax(board, true, alpha, beta, depth + 1);
        board[i] = null;
        best = Math.min(best, val);
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getBestMove(board, difficulty) {
  const empty = board.map((v, i) => v ? null : i).filter(i => i !== null);
  if (difficulty === 'easy') {
    // 70% random
    if (Math.random() < 0.7) return empty[Math.floor(Math.random() * empty.length)];
  }
  if (difficulty === 'medium') {
    // 50% random
    if (Math.random() < 0.5) return empty[Math.floor(Math.random() * empty.length)];
  }
  let bestVal = -Infinity;
  let bestMove = empty[0];
  for (const i of empty) {
    board[i] = 'O';
    const val = minimax([...board], false, -Infinity, Infinity, 0);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
}

const SYMBOLS = { X: '❌', O: '🔵' };

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState('hard');
  const [aiThinking, setAiThinking] = useState(false);

  const isGameOver = Boolean(result);

  const handleClick = (i) => {
    if (!isXTurn || board[i] || isGameOver || aiThinking) return;
    const next = [...board];
    next[i] = 'X';
    const res = checkWinner(next);
    setBoard(next);
    if (res) {
      setResult(res);
      setScores(s => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
    } else {
      setIsXTurn(false);
    }
  };

  useEffect(() => {
    if (isXTurn || isGameOver) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = getBestMove([...board], difficulty);
      if (move === undefined) return;
      const next = [...board];
      next[move] = 'O';
      const res = checkWinner(next);
      setBoard(next);
      setAiThinking(false);
      if (res) {
        setResult(res);
        setScores(s => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
      } else {
        setIsXTurn(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [isXTurn, board, isGameOver, difficulty]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setResult(null);
    setAiThinking(false);
  };

  const statusText = () => {
    if (aiThinking) return { text: 'AI is thinking...', color: '#61dafb' };
    if (!result) return { text: isXTurn ? 'Your turn (❌)' : "AI's turn (🔵)", color: isXTurn ? '#da4ea2' : '#61dafb' };
    if (result.winner === 'draw') return { text: "It's a Draw! 🤝", color: '#f89820' };
    if (result.winner === 'X') return { text: 'You Win! 🎉', color: '#6cc24a' };
    return { text: 'AI Wins! 🤖', color: '#da4ea2' };
  };

  const { text, color } = statusText();

  return (
    <Wrapper>
      <ScoreRow>
        <ScoreCard $active={isXTurn && !isGameOver}>
          <span>You (❌)</span>
          <strong>{scores.X}</strong>
        </ScoreCard>
        <ScoreCard>
          <span>Draw 🤝</span>
          <strong>{scores.draw}</strong>
        </ScoreCard>
        <ScoreCard $active={!isXTurn && !isGameOver}>
          <span>AI (🔵)</span>
          <strong>{scores.O}</strong>
        </ScoreCard>
      </ScoreRow>

      <StatusBar>
        <AnimatePresence mode="wait">
          <Status
            key={text}
            $color={color}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </Status>
        </AnimatePresence>
      </StatusBar>

      <Board>
        {board.map((val, i) => {
          const isWinCell = result?.line?.includes(i);
          return (
            <Cell
              key={i}
              onClick={() => handleClick(i)}
              $win={isWinCell}
              $disabled={!!val || isGameOver || !isXTurn}
              disabled={!!val || isGameOver}
            >
              {val && <span>{SYMBOLS[val]}</span>}
            </Cell>
          );
        })}
      </Board>

      <DiffRow>
        {['easy', 'medium', 'hard'].map(d => (
          <DiffBtn key={d} $active={difficulty === d} onClick={() => { setDifficulty(d); reset(); }}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </DiffBtn>
        ))}
      </DiffRow>

      <BtnRow>
        <Btn onClick={reset}>🔄 New Game</Btn>
        <Btn onClick={() => { setScores({ X: 0, O: 0, draw: 0 }); reset(); }}>
          Reset Scores
        </Btn>
      </BtnRow>
    </Wrapper>
  );
}
