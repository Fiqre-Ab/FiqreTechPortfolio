import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- animations ---------- */

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ---------- styled components ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const TopRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const Stat = styled.div`
  text-align: center;
  span { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; color: #7ec8f4; }
  strong { font-size: 1.5rem; color: white; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 480px) {
    gap: 7px;
  }
`;

const CardOuter = styled.div`
  width: 76px;
  height: 76px;
  perspective: 600px;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
  }
`;

const CardInner = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  border-radius: 12px;
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => p.$back ? '1.6rem' : '0.9rem'};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(218, 78, 162, 0.15));
  border: 2px solid rgba(52, 152, 219, 0.3);
  background-size: 200% auto;
`;

const CardFront = styled(CardFace)`
  background: ${p => p.$matched
    ? 'linear-gradient(135deg, rgba(108, 194, 74, 0.25), rgba(108, 194, 74, 0.1))'
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.25), rgba(218, 78, 162, 0.15))'
  };
  border: 2px solid ${p => p.$matched ? 'rgba(108, 194, 74, 0.6)' : 'rgba(52, 152, 219, 0.5)'};
  transform: rotateY(180deg);
  font-size: 2rem;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  padding: 10px 24px;
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

const WinBanner = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  gap: 10px;
  z-index: 10;
  backdrop-filter: blur(6px);

  h3 { margin: 0; font-size: 1.6rem; color: #6cc24a; }
  p  { margin: 0; color: #b0bec5; font-size: 0.85rem; }
`;

const GridWrap = styled.div`
  position: relative;
`;

const TimerBar = styled.div`
  width: 100%;
  max-width: 340px;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const TimerFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$pct > 50 ? '#6cc24a' : p.$pct > 25 ? '#f89820' : '#ff4757'};
  border-radius: 2px;
  transition: width 1s linear, background 1s;
`;

/* ---------- game logic ---------- */

const EMOJI_POOL = ['🚀', '⚡', '🎯', '💎', '🔥', '🌊', '🎸', '🦋', '🌈', '🏆', '🎪', '🎲', '🦄', '🍀', '🎭', '🌙'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCards() {
  const emojis = shuffle(EMOJI_POOL).slice(0, 8);
  return shuffle([...emojis, ...emojis].map((emoji, id) => ({ id, emoji, matched: false })));
}

const MAX_TIME = 90;

export default function MemoryGame() {
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('memBest') || '999'));
  const [locked, setLocked] = useState(false);

  // timer
  useEffect(() => {
    if (won || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, won]);

  const handleFlip = useCallback((idx) => {
    if (locked || flipped.length >= 2 || cards[idx].matched || flipped.includes(idx)) return;
    if (timeLeft <= 0) return;

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = next;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c
            );
            if (updated.every(c => c.matched)) {
              setWon(true);
              const finalMoves = moves + 1;
              if (finalMoves < best) {
                setBest(finalMoves);
                localStorage.setItem('memBest', String(finalMoves));
              }
            }
            return updated;
          });
          setFlipped([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, moves, best, timeLeft]);

  const reset = () => {
    setCards(makeCards());
    setFlipped([]);
    setMoves(0);
    setWon(false);
    setTimeLeft(MAX_TIME);
    setLocked(false);
  };

  return (
    <Wrapper>
      <TopRow>
        <Stat><span>Moves</span><strong>{moves}</strong></Stat>
        <Stat><span>Best</span><strong>{best === 999 ? '—' : best}</strong></Stat>
        <Stat><span>Time</span><strong>{timeLeft}s</strong></Stat>
        <Stat>
          <span>Found</span>
          <strong>{cards.filter(c => c.matched).length / 2}/8</strong>
        </Stat>
      </TopRow>

      <TimerBar>
        <TimerFill $pct={(timeLeft / MAX_TIME) * 100} />
      </TimerBar>

      <GridWrap>
        <Grid>
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || card.matched;
            return (
              <CardOuter
                key={card.id + '-' + i}
                onClick={() => handleFlip(i)}
                $disabled={locked || card.matched || isFlipped}
              >
                <CardInner
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <CardBack $back>🎴</CardBack>
                  <CardFront $matched={card.matched}>{card.emoji}</CardFront>
                </CardInner>
              </CardOuter>
            );
          })}
        </Grid>

        <AnimatePresence>
          {(won || timeLeft <= 0) && (
            <WinBanner
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {won ? (
                <>
                  <h3>You Won! 🎉</h3>
                  <p>Completed in {moves} moves</p>
                  {moves <= best && <p style={{ color: '#f89820' }}>New Best! ⭐</p>}
                </>
              ) : (
                <>
                  <h3>Time's Up! ⏰</h3>
                  <p>Found {cards.filter(c => c.matched).length / 2} of 8 pairs</p>
                </>
              )}
            </WinBanner>
          )}
        </AnimatePresence>
      </GridWrap>

      <BtnRow>
        <Btn onClick={reset}>🔄 New Game</Btn>
      </BtnRow>
    </Wrapper>
  );
}
