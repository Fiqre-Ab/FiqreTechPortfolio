import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeGame from '../component/games/SnakeGame';
import TicTacToe from '../component/games/TicTacToe';
import MemoryGame from '../component/games/MemoryGame';
import BreakoutGame from '../component/games/BreakoutGame';
import WhackMole from '../component/games/WhackMole';

/* ---------- animations ---------- */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ---------- styled components ---------- */

const Page = styled.div`
  min-height: 100vh;
  padding: 80px 40px 60px;
  color: white;

  @media (max-width: 768px) {
    padding: 80px 20px 60px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #da4ea2, #3498db, #61dafb, #da4ea2);
  background-size: 300% 300%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #b0bec5;
  font-size: 1rem;
  margin: 0;
`;

const TabRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const Tab = styled(motion.button)`
  padding: 12px 28px;
  border-radius: 30px;
  border: 2px solid ${p => p.$active ? p.$color || 'rgba(52, 152, 219, 0.8)' : 'rgba(255,255,255,0.1)'};
  background: ${p => p.$active
    ? `${p.$bg || 'rgba(52, 152, 219, 0.15)'}`
    : 'rgba(255,255,255,0.03)'
  };
  color: ${p => p.$active ? (p.$color || '#61dafb') : '#b0bec5'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: ${p => p.$color || 'rgba(52, 152, 219, 0.6)'};
    color: white;
    background: ${p => p.$bg || 'rgba(52, 152, 219, 0.1)'};
  }
`;

const GameCard = styled(motion.div)`
  max-width: 700px;
  margin: 0 auto;
  background: rgba(10, 12, 30, 0.7);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(52, 152, 219, 0.05);
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const GameTitle = styled.div`
  text-align: center;
  margin-bottom: 28px;

  h2 {
    margin: 0 0 6px;
    font-size: 1.4rem;
    color: white;
  }
  p {
    margin: 0;
    color: #7ec8f4;
    font-size: 0.82rem;
  }
`;

const GAMES = [
  {
    id: 'snake',
    label: 'Snake',
    icon: '🐍',
    color: '#6cc24a',
    bg: 'rgba(108, 194, 74, 0.12)',
    title: 'Classic Snake',
    desc: 'Arrow keys or WASD to move • Speed increases as you score',
    component: SnakeGame,
  },
  {
    id: 'ttt',
    label: 'Tic-Tac-Toe',
    icon: '❌',
    color: '#da4ea2',
    bg: 'rgba(218, 78, 162, 0.12)',
    title: 'Tic-Tac-Toe vs AI',
    desc: 'Play against a minimax AI • Easy / Medium / Hard difficulty',
    component: TicTacToe,
  },
  {
    id: 'memory',
    label: 'Memory',
    icon: '🎴',
    color: '#61dafb',
    bg: 'rgba(97, 218, 251, 0.12)',
    title: 'Memory Match',
    desc: 'Flip cards to find matching pairs • Beat your best in 90 seconds',
    component: MemoryGame,
  },
  {
    id: 'breakout',
    label: 'Breakout',
    icon: '🧱',
    color: '#f89820',
    bg: 'rgba(248, 152, 32, 0.12)',
    title: 'Breakout',
    desc: 'Move mouse or arrow keys • Bricks get tougher each level',
    component: BreakoutGame,
  },
  {
    id: 'whack',
    label: 'Whack-a-Mole',
    icon: '🔨',
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
    title: 'Whack-a-Mole',
    desc: 'Click moles fast! • Combos multiply points • Avoid bombs!',
    component: WhackMole,
  },
];

export default function Games() {
  const [active, setActive] = useState('snake');
  const game = GAMES.find(g => g.id === active);
  const GameComponent = game.component;

  return (
    <Page>
      <Header>
        <Title>🎮 Mini Games</Title>
        <Subtitle>
          Three games built right inside the portfolio — take a break and have some fun!
        </Subtitle>
      </Header>

      <TabRow>
        {GAMES.map(g => (
          <Tab
            key={g.id}
            $active={active === g.id}
            $color={g.color}
            $bg={g.bg}
            onClick={() => setActive(g.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {g.icon} {g.label}
          </Tab>
        ))}
      </TabRow>

      <AnimatePresence mode="wait">
        <GameCard
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <GameTitle>
            <h2>{game.icon} {game.title}</h2>
            <p>{game.desc}</p>
          </GameTitle>
          <GameComponent />
        </GameCard>
      </AnimatePresence>
    </Page>
  );
}
