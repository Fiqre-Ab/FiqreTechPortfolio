import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';

/* ---------- animations ---------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(52,152,219,0.3); }
  50%       { box-shadow: 0 0 25px rgba(218,78,162,0.5), 0 0 50px rgba(52,152,219,0.2); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ---------- styled components ---------- */

const Page = styled.div`
  min-height: 100vh;
  color: white;
  padding: 60px 24px 80px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 40px 16px 60px;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  color: #b0bec5;
  font-size: 1rem;
  margin-bottom: 48px;
  letter-spacing: 1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(52,152,219,0.2);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  animation: ${borderGlow} 4s ease-in-out infinite;
  position: sticky;
  top: 90px;

  @media (max-width: 768px) {
    position: static;
  }
`;

const ProfileImg = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #da4ea2;
  box-shadow: 0 0 30px rgba(218,78,162,0.3);
  margin-bottom: 20px;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
  margin-bottom: 4px;
`;

const ProfileRole = styled.p`
  color: #3498db;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 1px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #da4ea2;
`;

const StatLabel = styled.div`
  font-size: 0.72rem;
  color: #b0bec5;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Divider = styled.div`
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(52,152,219,0.3), transparent);
  margin: 20px auto;
`;

const StatusBadge = styled.div`
  display: inline-block;
  background: rgba(52,219,100,0.12);
  border: 1px solid rgba(52,219,100,0.3);
  color: #4ade80;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  letter-spacing: 0.5px;

  &::before {
    content: '● ';
    color: #4ade80;
  }
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Section = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 28px;

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #da4ea2;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Bio = styled.p`
  color: #c0cfe0;
  font-size: 0.97rem;
  line-height: 1.85;
  margin-bottom: 14px;

  &:last-child { margin-bottom: 0; }
`;

const SkillCategory = styled.div`
  margin-bottom: 18px;

  &:last-child { margin-bottom: 0; }
`;

const CategoryLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #3498db;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled(motion.span)`
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid ${p => p.$border};
  color: ${p => p.$color};
  background: ${p => p.$bg};
  cursor: default;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: ${p => p.$hoverBg};
  }
`;

const HighlightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HighlightItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #c0cfe0;
  font-size: 0.93rem;
  line-height: 1.5;

  &::before {
    content: '✔';
    color: #4ade80;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const CurrentBuild = styled(motion.div)`
  background: linear-gradient(135deg, rgba(52,152,219,0.08), rgba(218,78,162,0.08));
  border: 1px solid rgba(218,78,162,0.25);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BuildText = styled.div`
  font-size: 0.88rem;
  color: #b0bec5;
  line-height: 1.5;

  strong {
    color: white;
    display: block;
    margin-bottom: 2px;
  }
`;

/* ---------- data ---------- */

const SKILLS = [
  {
    category: 'Backend',
    chips: [
      { label: 'Java ☕',       color: '#f89820', border: '#f89820', bg: 'rgba(248,152,32,0.08)',  hoverBg: 'rgba(248,152,32,0.2)'  },
      { label: 'Spring Boot ⚡', color: '#6db33f', border: '#6db33f', bg: 'rgba(109,179,63,0.08)', hoverBg: 'rgba(109,179,63,0.2)' },
      { label: 'Node.js',       color: '#6cc24a', border: '#6cc24a', bg: 'rgba(108,194,74,0.08)',  hoverBg: 'rgba(108,194,74,0.2)'  },
      { label: 'Python',        color: '#ffd43b', border: '#ffd43b', bg: 'rgba(255,212,59,0.08)',  hoverBg: 'rgba(255,212,59,0.2)'  },
      { label: 'Express',       color: '#b0bec5', border: '#b0bec5', bg: 'rgba(176,190,197,0.08)', hoverBg: 'rgba(176,190,197,0.2)' },
    ],
  },
  {
    category: 'APIs & Architecture',
    chips: [
      { label: 'REST APIs',    color: '#61dafb', border: '#61dafb', bg: 'rgba(97,218,251,0.08)',  hoverBg: 'rgba(97,218,251,0.2)'  },
      { label: 'GraphQL',      color: '#e535ab', border: '#e535ab', bg: 'rgba(229,53,171,0.08)',  hoverBg: 'rgba(229,53,171,0.2)'  },
      { label: 'JWT Auth',     color: '#da4ea2', border: '#da4ea2', bg: 'rgba(218,78,162,0.08)',  hoverBg: 'rgba(218,78,162,0.2)'  },
      { label: 'Microservices',color: '#a78bfa', border: '#a78bfa', bg: 'rgba(167,139,250,0.08)', hoverBg: 'rgba(167,139,250,0.2)' },
      { label: 'Kafka 🔄',     color: '#ff6b35', border: '#ff6b35', bg: 'rgba(255,107,53,0.08)',  hoverBg: 'rgba(255,107,53,0.2)'  },
    ],
  },
  {
    category: 'Cloud & DevOps',
    chips: [
      { label: 'AWS ☁️',          color: '#ff9900', border: '#ff9900', bg: 'rgba(255,153,0,0.08)',   hoverBg: 'rgba(255,153,0,0.2)'   },
      { label: 'GCP',             color: '#4285f4', border: '#4285f4', bg: 'rgba(66,133,244,0.08)',  hoverBg: 'rgba(66,133,244,0.2)'  },
      { label: 'Docker 🐳',       color: '#2496ed', border: '#2496ed', bg: 'rgba(36,150,237,0.08)',  hoverBg: 'rgba(36,150,237,0.2)'  },
      { label: 'Jenkins',         color: '#d33833', border: '#d33833', bg: 'rgba(211,56,51,0.08)',   hoverBg: 'rgba(211,56,51,0.2)'   },
      { label: 'GitHub Actions',  color: '#6cc644', border: '#6cc644', bg: 'rgba(108,198,68,0.08)',  hoverBg: 'rgba(108,198,68,0.2)'  },
    ],
  },
  {
    category: 'Frontend',
    chips: [
      { label: 'React',      color: '#61dafb', border: '#61dafb', bg: 'rgba(97,218,251,0.08)',  hoverBg: 'rgba(97,218,251,0.2)'  },
      { label: 'Angular',    color: '#dd0031', border: '#dd0031', bg: 'rgba(221,0,49,0.08)',    hoverBg: 'rgba(221,0,49,0.2)'    },
      { label: 'TypeScript', color: '#3178c6', border: '#3178c6', bg: 'rgba(49,120,198,0.08)',  hoverBg: 'rgba(49,120,198,0.2)'  },
    ],
  },
  {
    category: 'Databases',
    chips: [
      { label: 'PostgreSQL', color: '#336791', border: '#336791', bg: 'rgba(51,103,145,0.08)', hoverBg: 'rgba(51,103,145,0.2)' },
      { label: 'MySQL',      color: '#4479a1', border: '#4479a1', bg: 'rgba(68,121,161,0.08)', hoverBg: 'rgba(68,121,161,0.2)' },
      { label: 'MongoDB',    color: '#4db33d', border: '#4db33d', bg: 'rgba(77,179,61,0.08)',  hoverBg: 'rgba(77,179,61,0.2)'  },
    ],
  },
  {
    category: 'Testing',
    chips: [
      { label: 'JUnit',        color: '#25a162', border: '#25a162', bg: 'rgba(37,161,98,0.08)',   hoverBg: 'rgba(37,161,98,0.2)'   },
      { label: 'Integration',  color: '#b0bec5', border: '#b0bec5', bg: 'rgba(176,190,197,0.08)', hoverBg: 'rgba(176,190,197,0.2)' },
      { label: 'Unit Testing', color: '#b0bec5', border: '#b0bec5', bg: 'rgba(176,190,197,0.08)', hoverBg: 'rgba(176,190,197,0.2)' },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: 'easeOut' } }),
};

const chipAnim = {
  hidden: { opacity: 0, scale: 0.8 },
  show: i => ({ opacity: 1, scale: 1, transition: { delay: 0.3 + i * 0.04, type: 'spring', stiffness: 180 } }),
};

/* ---------- component ---------- */

function About() {
  return (
    <Page>
      <PageTitle variants={fadeUp} custom={0} initial="hidden" animate="show">
        About Me
      </PageTitle>
      <Subtitle variants={fadeUp} custom={0.1} initial="hidden" animate="show">
        Backend-Focused Full Stack Engineer
      </Subtitle>

      <Grid>
        {/* Left — profile card */}
        <ProfileCard variants={fadeUp} custom={0.15} initial="hidden" animate="show">
          <ProfileImg src="../img/About.png" alt="Fiqre" onError={e => { e.target.style.display = 'none'; }} />
          <ProfileName>Fiqre</ProfileName>
          <ProfileRole>Full Stack Developer</ProfileRole>
          <StatusBadge>Available for hire</StatusBadge>

          <Divider />

          <StatRow>
            <Stat>
              <StatNum>3+</StatNum>
              <StatLabel>Years Exp</StatLabel>
            </Stat>
            <Stat>
              <StatNum>10+</StatNum>
              <StatLabel>Projects</StatLabel>
            </Stat>
            <Stat>
              <StatNum>5+</StatNum>
              <StatLabel>Tech Stacks</StatLabel>
            </Stat>
          </StatRow>

          <Divider />

          <CurrentBuild
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span style={{ fontSize: '1.4rem' }}>🚀</span>
            <BuildText>
              <strong>Currently Building</strong>
              Task Management System — Spring Boot + React + JWT + Microservices
            </BuildText>
          </CurrentBuild>
        </ProfileCard>

        {/* Right — content */}
        <RightCol>
          {/* Bio */}
          <Section variants={fadeUp} custom={0.2} initial="hidden" animate="show">
            <SectionTitle>⚡ Who I Am</SectionTitle>
            <Bio>
              I'm a Full Stack Developer focused on building scalable web applications and microservices.
              I build production-ready systems and scalable architectures that perform at scale.
            </Bio>
            <Bio>
              I have strong backend experience with <strong style={{color:'#f89820'}}>Java</strong> and{' '}
              <strong style={{color:'#6db33f'}}>Spring Boot</strong>, along with{' '}
              <strong style={{color:'#6cc24a'}}>Node.js</strong> and Python for building APIs and services.
              I design and develop RESTful and GraphQL APIs with a focus on performance, security, and
              scalability — including authentication using JWT.
            </Bio>
            <Bio>
              I work with event-driven systems like <strong style={{color:'#ff6b35'}}>Kafka</strong> and have
              experience building cloud-native applications on <strong style={{color:'#ff9900'}}>AWS</strong> and GCP.
              I implement CI/CD pipelines using Jenkins and GitHub Actions, and write unit and integration tests
              using JUnit and other testing frameworks.
            </Bio>
            <Bio>
              On the frontend, I build responsive applications using{' '}
              <strong style={{color:'#61dafb'}}>React</strong> and Angular. I work with relational and NoSQL
              databases such as MySQL, PostgreSQL, and MongoDB.
            </Bio>
          </Section>

          {/* Highlights */}
          <Section variants={fadeUp} custom={0.3} initial="hidden" animate="show">
            <SectionTitle>🔥 What I Build</SectionTitle>
            <HighlightList>
              <HighlightItem>Microservices architecture using Spring Boot & Kafka for async event-driven systems</HighlightItem>
              <HighlightItem>Secure REST & GraphQL APIs with JWT authentication and role-based access control</HighlightItem>
              <HighlightItem>Cloud-native applications deployed on AWS & GCP with CI/CD automation</HighlightItem>
              <HighlightItem>Full stack applications with React/Angular frontends backed by Java/Node.js services</HighlightItem>
              <HighlightItem>Relational and NoSQL data models optimized for performance and scalability</HighlightItem>
            </HighlightList>
          </Section>

          {/* Skills */}
          <Section variants={fadeUp} custom={0.4} initial="hidden" animate="show">
            <SectionTitle>🧠 Tech Stack</SectionTitle>
            {SKILLS.map(cat => (
              <SkillCategory key={cat.category}>
                <CategoryLabel>{cat.category}</CategoryLabel>
                <ChipRow>
                  {cat.chips.map((chip, i) => (
                    <Chip
                      key={chip.label}
                      variants={chipAnim}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      $color={chip.color}
                      $border={chip.border}
                      $bg={chip.bg}
                      $hoverBg={chip.hoverBg}
                    >
                      {chip.label}
                    </Chip>
                  ))}
                </ChipRow>
              </SkillCategory>
            ))}
          </Section>
        </RightCol>
      </Grid>
    </Page>
  );
}

export default About;
