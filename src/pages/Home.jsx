import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/* ---------- keyframe animations ---------- */

const floatBob = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-22px); }
`;

const glowPulse = keyframes`
  0%, 100% {
    text-shadow: 0 0 8px #3498db, 0 0 20px #3498db;
  }
  50% {
    text-shadow: 0 0 16px #da4ea2, 0 0 40px #da4ea2, 0 0 80px #da4ea2;
  }
`;

const btnPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(218, 78, 162, 0.5); }
  50%       { box-shadow: 0 0 0 14px rgba(218, 78, 162, 0); }
`;

const drift = keyframes`
  0%   { transform: translateY(0)   translateX(0)   rotate(0deg); opacity: 0.15; }
  33%  { transform: translateY(-30px) translateX(15px) rotate(60deg); opacity: 0.35; }
  66%  { transform: translateY(15px)  translateX(-10px) rotate(120deg); opacity: 0.2; }
  100% { transform: translateY(0)   translateX(0)   rotate(180deg); opacity: 0.15; }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ---------- particle background ---------- */

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

/* ---------- layout ---------- */

const Section = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Containers = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 80px 90px 40px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 80px 20px 40px;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Greeting = styled(motion.p)`
  font-size: 1.1rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #da4ea2;
  font-weight: 600;
`;

const Title = styled(motion.h1)`
  font-size: 72px;
  color: #3498db;
  line-height: 1.1;
  animation: ${glowPulse} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

const RoleWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoleLine = styled.span`
  display: inline-block;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #da4ea2);
  border-radius: 2px;
`;

const Role = styled.h2`
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.4rem;
`;

const Desc = styled(motion.p)`
  font-size: 1rem;
  color: #b0bec5;
  line-height: 1.8;
  max-width: 480px;
`;

const SkillRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Badge = styled(motion.span)`
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid ${p => p.$border || '#3498db'};
  color: ${p => p.$color || '#3498db'};
  background: ${p => p.$bg || 'rgba(52, 152, 219, 0.1)'};
  cursor: default;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-3px) scale(1.07);
    background: ${p => p.$hoverBg || 'rgba(52, 152, 219, 0.25)'};
  }
`;

const Button = styled(motion(Link))`
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-weight: 600;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  animation: ${btnPulse} 2.5s ease-in-out infinite;
  letter-spacing: 1px;
`;

const Right = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    order: -1;
  }
`;

const ImgGlow = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(218,78,162,0.2) 0%, rgba(52,152,219,0.15) 60%, transparent 80%);
  filter: blur(20px);
  animation: ${floatBob} 4s ease-in-out infinite;
`;

const Img = styled.img`
  width: 500px;
  height: 380px;
  object-fit: contain;
  position: relative;
  animation: ${floatBob} 4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(52,152,219,0.4));

  @media (max-width: 768px) {
    width: 70%;
    height: auto;
  }
`;

/* ---------- framer variants ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: i => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.9 + i * 0.08, type: 'spring', stiffness: 200 },
  }),
};

/* ---------- particle data ---------- */

const PARTICLES = [
  { x: 10, y: 20, size: 80,  blur: 30, dur: 8,  delay: 0,   color: 'rgba(52,152,219,0.3)'  },
  { x: 80, y: 10, size: 60,  blur: 25, dur: 10, delay: 1,   color: 'rgba(218,78,162,0.25)' },
  { x: 50, y: 70, size: 100, blur: 40, dur: 12, delay: 2,   color: 'rgba(52,152,219,0.2)'  },
  { x: 90, y: 55, size: 50,  blur: 20, dur: 7,  delay: 0.5, color: 'rgba(218,78,162,0.3)'  },
  { x: 25, y: 80, size: 70,  blur: 28, dur: 9,  delay: 3,   color: 'rgba(52,152,219,0.25)' },
  { x: 65, y: 35, size: 40,  blur: 15, dur: 11, delay: 1.5, color: 'rgba(218,78,162,0.2)'  },
  { x: 5,  y: 60, size: 55,  blur: 22, dur: 8,  delay: 4,   color: 'rgba(52,152,219,0.2)'  },
  { x: 40, y: 5,  size: 45,  blur: 18, dur: 13, delay: 2.5, color: 'rgba(218,78,162,0.15)' },
];

const SKILLS = [
  { label: 'React',      color: '#61dafb', border: '#61dafb', bg: 'rgba(97,218,251,0.08)',   hoverBg: 'rgba(97,218,251,0.2)'   },
  { label: 'Node.js',    color: '#6cc24a', border: '#6cc24a', bg: 'rgba(108,194,74,0.08)',   hoverBg: 'rgba(108,194,74,0.2)'   },
  { label: 'MongoDB',    color: '#4db33d', border: '#4db33d', bg: 'rgba(77,179,61,0.08)',    hoverBg: 'rgba(77,179,61,0.2)'    },
  { label: 'Express',    color: '#b0bec5', border: '#b0bec5', bg: 'rgba(176,190,197,0.08)',  hoverBg: 'rgba(176,190,197,0.2)'  },
  { label: 'TypeScript', color: '#3178c6', border: '#3178c6', bg: 'rgba(49,120,198,0.08)',   hoverBg: 'rgba(49,120,198,0.2)'   },
  { label: 'Java',       color: '#f89820', border: '#f89820', bg: 'rgba(248,152,32,0.08)',   hoverBg: 'rgba(248,152,32,0.2)'   },
  { label: 'SQL',        color: '#da4ea2', border: '#da4ea2', bg: 'rgba(218,78,162,0.08)',   hoverBg: 'rgba(218,78,162,0.2)'   },
];

/* ---------- component ---------- */

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <Section>
      <ParticleCanvas>
        {PARTICLES.map((p, i) => (
          <Particle
            key={i}
            $x={p.x} $y={p.y} $size={p.size} $blur={p.blur}
            $dur={p.dur} $delay={p.delay} $color={p.color}
          />
        ))}
      </ParticleCanvas>

      <Containers>
        <Left>
          <Greeting
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
          >
            Welcome to my portfolio
          </Greeting>

          <Title
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
          >
            Hi, I'm Fiqre
          </Title>

          <RoleWrapper
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
          >
            <RoleLine />
            <Role>Full Stack Developer</Role>
          </RoleWrapper>

          <Desc
            variants={fadeUp}
            custom={0.45}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
          >
            Specializing in the MERN stack — building scalable, efficient, and
            visually compelling web applications. I turn complex problems into
            clean, modern solutions.
          </Desc>

          <SkillRow
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
          >
            {SKILLS.map((s, i) => (
              <Badge
                key={s.label}
                variants={badgeVariants}
                custom={i}
                $color={s.color}
                $border={s.border}
                $bg={s.bg}
                $hoverBg={s.hoverBg}
              >
                {s.label}
              </Badge>
            ))}
          </SkillRow>

          <Button
            to="/contact"
            variants={fadeUp}
            custom={0.8}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact Me
          </Button>
        </Left>

        <Right
          initial={{ opacity: 0, x: 60 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <ImgGlow />
          <Img src="../img/space.png" alt="Innovative Space" />
        </Right>
      </Containers>
    </Section>
  );
}

export default Home;
