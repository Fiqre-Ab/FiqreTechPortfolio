# Fiqre's Tech Portfolio

[![DEPLOY](https://img.shields.io/badge/DEPLOY-%E2%9C%93-brightgreen)](https://marvelous-shortbread-a0853f.netlify.app/)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=threedotjs)

A modern, interactive developer portfolio built with React + Vite. Features a live 3D globe, an AI chat assistant, five built-in mini-games, and a professional dark design.

---

## Features

### 3D Interactive Globe
- Rotating dual-layer wireframe icosahedron with a glowing core
- Floating tech labels (React, Node.js, TypeScript...) orbiting in 3D
- Animated star field, spinning rings, and debris particles
- Drag to rotate — powered by Three.js + React Three Fiber

### ARIA — AI Assistant
- Floating 🤖 chat widget available on every page
- Smart keyword + fuzzy matching — handles casual chat and short words
- Quick-reply buttons for instant answers
- 100% client-side — no API key required

### Five Mini-Games
| Game | How to Play |
|------|-------------|
| 🐍 Snake | Arrow keys / WASD — get faster as you score |
| ❌ Tic-Tac-Toe | vs minimax AI — Easy / Medium / Hard |
| 🎴 Memory Match | Flip 8 pairs in 90 seconds |
| 🧱 Breakout | Mouse / arrow keys — bricks get tougher each level |
| 🔨 Whack-a-Mole | Click moles fast — combos multiply points, avoid bombs! |

### Pages
| Route | Description |
|-------|-------------|
| `/` | 3D hero section with animated skill badges |
| `/about` | Background and intro |
| `/portfolio` | Project showcase with live links |
| `/resume` | Full skills breakdown |
| `/contact` | 3D flip-card contact form |
| `/games` | All five mini-games |

---

## Tech Stack

| Category | Tools |
|----------|-------|
| Framework | React 18, Vite 5 |
| Styling | styled-components 6, Bootstrap 5 |
| Animation | framer-motion, CSS keyframes |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Routing | React Router DOM 6 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── component/
│   ├── Navbar.jsx          # Sticky glass navbar with active-link indicator
│   ├── Footer.jsx          # Social links
│   ├── Scene3D.jsx         # Three.js 3D globe with labels & stars
│   ├── AIAssistant.jsx     # ARIA chat widget (smart rule-based AI)
│   └── games/
│       ├── SnakeGame.jsx
│       ├── TicTacToe.jsx
│       ├── MemoryGame.jsx
│       ├── BreakoutGame.jsx
│       └── WhackMole.jsx
└── pages/
    ├── Home.jsx
    ├── About.jsx
    ├── Work.jsx
    ├── Resume.jsx
    ├── Contact.jsx
    ├── Games.jsx
    └── Error.jsx
```

---

Built by **Fiqre Abdurahman** — Full Stack Developer
