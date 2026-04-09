import styled, { keyframes } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ---------- animations ---------- */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const barFill = keyframes`
  from { width: 0%; }
  to   { width: var(--w); }
`;

const cardGlow = keyframes`
  0%, 100% { box-shadow: 0 4px 24px rgba(52,152,219,0.08), inset 0 1px 0 rgba(255,255,255,0.04); }
  50%       { box-shadow: 0 4px 36px rgba(218,78,162,0.12), inset 0 1px 0 rgba(255,255,255,0.06); }
`;

const shimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

/* ---------- layout ---------- */

const Page = styled.section`
  color: #fff;
  padding: 60px 24px 80px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: 480px) { padding: 40px 14px 60px; }
`;

/* ---------- hero ---------- */

const Hero = styled(motion.div)`
  background: linear-gradient(135deg,
    rgba(52,152,219,0.06) 0%,
    rgba(218,78,162,0.06) 50%,
    rgba(52,152,219,0.06) 100%
  );
  border: 1px solid rgba(52,152,219,0.18);
  border-radius: 20px;
  padding: 36px 40px;
  margin-bottom: 44px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: -60%;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
    animation: ${shimmer} 4s ease-in-out infinite;
    pointer-events: none;
  }

  @media (max-width: 480px) { padding: 24px 18px; }
`;

const HeroTitle = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
  line-height: 1.2;
`;

const HeroSub = styled.p`
  font-size: 1rem;
  color: #b0cce0;
  line-height: 1.75;
  max-width: 740px;

  @media (max-width: 480px) { font-size: 0.9rem; }
`;

const HeroMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.82rem;
  color: #7a9bbf;

  span { color: #da4ea2; font-weight: 700; }
`;

/* ---------- core stack ---------- */

const SectionLabel = styled(motion.div)`
  font-size: 0.72rem;
  font-weight: 700;
  color: #da4ea2;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(218,78,162,0.3), transparent);
  }
`;

const CoreStackRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 48px;
`;

const CoreChip = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${p => p.$border || 'rgba(52,152,219,0.25)'};
  color: ${p => p.$color || '#61dafb'};
  cursor: default;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${p => p.$color || '#3498db'}10;
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px ${p => p.$color || '#3498db'}30;
    &::before { opacity: 1; }
  }
`;

const ChipIcon = styled.span`
  font-size: 1rem;
`;

/* ---------- skill categories grid ---------- */

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 480px) { grid-template-columns: 1fr; gap: 16px; }
`;

const CategoryCard = styled(motion.div)`
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  padding: 26px 24px;
  animation: ${cardGlow} 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${p => p.$color1 || '#3498db'}, ${p => p.$color2 || '#da4ea2'});
    border-radius: 18px 18px 0 0;
  }

  &:hover {
    border-color: ${p => p.$color1 || '#3498db'}40;
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
`;

const CardIcon = styled.div`
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$bg || 'rgba(52,152,219,0.1)'};
  border-radius: 12px;
  border: 1px solid ${p => p.$border || 'rgba(52,152,219,0.2)'};
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
`;

const CardSubtitle = styled.p`
  font-size: 0.72rem;
  color: #7a9bbf;
  margin-top: 2px;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SkillItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SkillTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SkillName = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.86rem;
  font-weight: 600;
  color: #d0dde8;
`;

const SkillIcon = styled.span`
  font-size: 0.95rem;
`;

const SkillLevel = styled.div`
  font-size: 0.72rem;
  color: ${p => p.$color || '#3498db'};
  font-weight: 700;
`;

const BarTrack = styled.div`
  height: 5px;
  background: rgba(255,255,255,0.07);
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, ${p => p.$c1}, ${p => p.$c2});
  box-shadow: 0 0 8px ${p => p.$c2}60;
  transform-origin: left;
`;

/* ---------- tag chips row ---------- */

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 16px;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 10px;
  color: ${p => p.$color || '#3498db'};
  background: ${p => p.$bg || 'rgba(52,152,219,0.08)'};
  border: 1px solid ${p => p.$border || 'rgba(52,152,219,0.2)'};
`;

/* ---------- download button ---------- */

const DownloadRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

const DownloadBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px 36px;
  border-radius: 30px;
  text-decoration: none;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 30px rgba(218,78,162,0.3);
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 8px 40px rgba(218,78,162,0.5); }
`;

/* ---------- data ---------- */

const CORE_STACK = [
  { label: 'Java',           icon: '☕', color: '#f89820', border: 'rgba(248,152,32,0.35)' },
  { label: 'Spring Boot',    icon: '⚡', color: '#6db33f', border: 'rgba(109,179,63,0.35)' },
  { label: 'Kafka',          icon: '🔄', color: '#ff6b35', border: 'rgba(255,107,53,0.35)' },
  { label: 'React',          icon: '⚛️', color: '#61dafb', border: 'rgba(97,218,251,0.35)'  },
  { label: 'Angular',        icon: '🔺', color: '#dd0031', border: 'rgba(221,0,49,0.35)'    },
  { label: 'Node.js',        icon: '🟢', color: '#6cc24a', border: 'rgba(108,194,74,0.35)'  },
  { label: 'Python',         icon: '🐍', color: '#ffd43b', border: 'rgba(255,212,59,0.35)'  },
  { label: 'AWS',            icon: '☁️', color: '#ff9900', border: 'rgba(255,153,0,0.35)'   },
  { label: 'GCP',            icon: '🌐', color: '#4285f4', border: 'rgba(66,133,244,0.35)'  },
  { label: 'Docker',         icon: '🐳', color: '#2496ed', border: 'rgba(36,150,237,0.35)'  },
  { label: 'JWT',            icon: '🔐', color: '#da4ea2', border: 'rgba(218,78,162,0.35)'  },
  { label: 'PostgreSQL',     icon: '🐘', color: '#336791', border: 'rgba(51,103,145,0.35)'  },
  { label: 'MongoDB',        icon: '🍃', color: '#4db33d', border: 'rgba(77,179,61,0.35)'   },
  { label: 'GraphQL',        icon: '◈',  color: '#e535ab', border: 'rgba(229,53,171,0.35)'  },
  { label: 'CI/CD',          icon: '⚙️', color: '#6cc644', border: 'rgba(108,198,68,0.35)'  },
];

const CATEGORIES = [
  {
    title: 'Backend Engineering',
    subtitle: 'Core expertise',
    icon: '⚙️',
    iconBg: 'rgba(248,152,32,0.1)',
    iconBorder: 'rgba(248,152,32,0.25)',
    color1: '#f89820', color2: '#ff6b35',
    skills: [
      { name: 'Java',        icon: '☕', level: 92, label: 'Expert' },
      { name: 'Spring Boot', icon: '⚡', level: 90, label: 'Expert' },
      { name: 'Kafka',       icon: '🔄', level: 80, label: 'Advanced' },
      { name: 'Node.js',     icon: '🟢', level: 82, label: 'Advanced' },
      { name: 'Python',      icon: '🐍', level: 72, label: 'Proficient' },
      { name: 'REST APIs',   icon: '🔗', level: 93, label: 'Expert' },
      { name: 'GraphQL',     icon: '◈',  level: 75, label: 'Proficient' },
    ],
    tags: [
      { label: 'Microservices', color: '#f89820', bg: 'rgba(248,152,32,0.08)', border: 'rgba(248,152,32,0.2)' },
      { label: 'Event-Driven',  color: '#ff6b35', bg: 'rgba(255,107,53,0.08)', border: 'rgba(255,107,53,0.2)' },
      { label: 'Spring Cloud',  color: '#6db33f', bg: 'rgba(109,179,63,0.08)', border: 'rgba(109,179,63,0.2)' },
      { label: 'API Gateway',   color: '#b0bec5', bg: 'rgba(176,190,197,0.08)', border: 'rgba(176,190,197,0.2)' },
    ],
  },
  {
    title: 'Frontend Development',
    subtitle: 'UI & UX',
    icon: '⚛️',
    iconBg: 'rgba(97,218,251,0.1)',
    iconBorder: 'rgba(97,218,251,0.25)',
    color1: '#61dafb', color2: '#3178c6',
    skills: [
      { name: 'React',       icon: '⚛️', level: 88, label: 'Advanced' },
      { name: 'Angular',     icon: '🔺', level: 78, label: 'Proficient' },
      { name: 'TypeScript',  icon: '🔷', level: 83, label: 'Advanced' },
      { name: 'JavaScript',  icon: '🟨', level: 90, label: 'Expert' },
      { name: 'CSS / SCSS',  icon: '🎨', level: 80, label: 'Advanced' },
    ],
    tags: [
      { label: 'React Hooks',  color: '#61dafb', bg: 'rgba(97,218,251,0.08)', border: 'rgba(97,218,251,0.2)' },
      { label: 'Redux',        color: '#764abc', bg: 'rgba(118,74,188,0.08)', border: 'rgba(118,74,188,0.2)' },
      { label: 'Responsive',   color: '#3178c6', bg: 'rgba(49,120,198,0.08)', border: 'rgba(49,120,198,0.2)' },
      { label: 'Framer Motion',color: '#da4ea2', bg: 'rgba(218,78,162,0.08)', border: 'rgba(218,78,162,0.2)' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    subtitle: 'Infrastructure & automation',
    icon: '☁️',
    iconBg: 'rgba(255,153,0,0.1)',
    iconBorder: 'rgba(255,153,0,0.25)',
    color1: '#ff9900', color2: '#4285f4',
    skills: [
      { name: 'AWS',            icon: '☁️', level: 80, label: 'Advanced' },
      { name: 'GCP',            icon: '🌐', level: 70, label: 'Proficient' },
      { name: 'Docker',         icon: '🐳', level: 78, label: 'Proficient' },
      { name: 'GitHub Actions', icon: '⚙️', level: 82, label: 'Advanced' },
      { name: 'Jenkins',        icon: '🔧', level: 72, label: 'Proficient' },
    ],
    tags: [
      { label: 'CI/CD Pipelines', color: '#6cc644', bg: 'rgba(108,198,68,0.08)', border: 'rgba(108,198,68,0.2)' },
      { label: 'Cloud-Native',    color: '#ff9900', bg: 'rgba(255,153,0,0.08)', border: 'rgba(255,153,0,0.2)' },
      { label: 'Microservices',   color: '#4285f4', bg: 'rgba(66,133,244,0.08)', border: 'rgba(66,133,244,0.2)' },
      { label: 'Containers',      color: '#2496ed', bg: 'rgba(36,150,237,0.08)', border: 'rgba(36,150,237,0.2)' },
    ],
  },
  {
    title: 'Databases',
    subtitle: 'Relational & NoSQL',
    icon: '🗄️',
    iconBg: 'rgba(51,103,145,0.1)',
    iconBorder: 'rgba(51,103,145,0.25)',
    color1: '#336791', color2: '#4db33d',
    skills: [
      { name: 'PostgreSQL', icon: '🐘', level: 85, label: 'Advanced' },
      { name: 'MySQL',      icon: '🔵', level: 83, label: 'Advanced' },
      { name: 'MongoDB',    icon: '🍃', level: 80, label: 'Advanced' },
      { name: 'SQL',        icon: '📊', level: 88, label: 'Advanced' },
      { name: 'Sequelize',  icon: '🔗', level: 75, label: 'Proficient' },
    ],
    tags: [
      { label: 'Schema Design',    color: '#336791', bg: 'rgba(51,103,145,0.08)', border: 'rgba(51,103,145,0.2)' },
      { label: 'Query Optimize',   color: '#4479a1', bg: 'rgba(68,121,161,0.08)', border: 'rgba(68,121,161,0.2)' },
      { label: 'Migrations',       color: '#4db33d', bg: 'rgba(77,179,61,0.08)', border: 'rgba(77,179,61,0.2)' },
      { label: 'ORM / ODM',        color: '#b0bec5', bg: 'rgba(176,190,197,0.08)', border: 'rgba(176,190,197,0.2)' },
    ],
  },
  {
    title: 'Security & Testing',
    subtitle: 'Secure by design',
    icon: '🔐',
    iconBg: 'rgba(218,78,162,0.1)',
    iconBorder: 'rgba(218,78,162,0.25)',
    color1: '#da4ea2', color2: '#a78bfa',
    skills: [
      { name: 'JWT Auth',    icon: '🔐', level: 88, label: 'Advanced' },
      { name: 'Spring Sec.', icon: '🛡️', level: 80, label: 'Advanced' },
      { name: 'JUnit',       icon: '✅', level: 82, label: 'Advanced' },
      { name: 'TDD',         icon: '🧪', level: 75, label: 'Proficient' },
      { name: 'OAuth 2.0',   icon: '🔑', level: 72, label: 'Proficient' },
    ],
    tags: [
      { label: 'Role-Based Access', color: '#da4ea2', bg: 'rgba(218,78,162,0.08)', border: 'rgba(218,78,162,0.2)' },
      { label: 'Unit Tests',        color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
      { label: 'Integration Tests', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
      { label: 'API Security',      color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
    ],
  },
];

/* ---------- animated skill bar ---------- */

function SkillBar({ skill, c1, c2, inView }) {
  return (
    <SkillItem>
      <SkillTop>
        <SkillName>
          <SkillIcon>{skill.icon}</SkillIcon>
          {skill.name}
        </SkillName>
        <SkillLevel $color={c1}>{skill.label}</SkillLevel>
      </SkillTop>
      <BarTrack>
        <BarFill
          $c1={c1} $c2={c2}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
          style={{ width: `${skill.level}%` }}
        />
      </BarTrack>
    </SkillItem>
  );
}

/* ---------- animated category card ---------- */

function CatCard({ cat, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <CategoryCard
      ref={ref}
      $color1={cat.color1} $color2={cat.color2}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      <CardHeader>
        <CardIcon $bg={cat.iconBg} $border={cat.iconBorder}>{cat.icon}</CardIcon>
        <div>
          <CardTitle>{cat.title}</CardTitle>
          <CardSubtitle>{cat.subtitle}</CardSubtitle>
        </div>
      </CardHeader>

      <SkillList>
        {cat.skills.map(s => (
          <SkillBar key={s.name} skill={s} c1={cat.color1} c2={cat.color2} inView={inView} />
        ))}
      </SkillList>

      <TagsRow>
        {cat.tags.map(t => (
          <Tag key={t.label} $color={t.color} $bg={t.bg} $border={t.border}>{t.label}</Tag>
        ))}
      </TagsRow>
    </CategoryCard>
  );
}

/* ---------- component ---------- */

function Resume() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const stackRef = useRef(null);
  const stackInView = useInView(stackRef, { once: true, margin: '-40px' });

  return (
    <Page>
      {/* HERO */}
      <Hero
        ref={heroRef}
        initial={{ opacity: 0, y: 24 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <HeroTitle>
          Backend-Focused Full Stack Developer
        </HeroTitle>
        <HeroSub>
          Specializing in scalable systems, microservices, cloud-native applications,
          and secure API development. Building production-ready backend services with
          Java, Spring Boot, Kafka, and deploying on AWS & GCP with modern CI/CD pipelines.
        </HeroSub>
        <HeroMeta>
          <MetaItem>⚙️ <span>Backend-First</span> Engineering</MetaItem>
          <MetaItem>☁️ <span>Cloud-Native</span> Architecture</MetaItem>
          <MetaItem>🔄 <span>Event-Driven</span> Systems</MetaItem>
          <MetaItem>🔐 <span>Secure</span> API Design</MetaItem>
        </HeroMeta>
      </Hero>

      {/* CORE STACK */}
      <SectionLabel
        initial={{ opacity: 0 }}
        animate={stackInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        Core Tech Stack
      </SectionLabel>

      <CoreStackRow
        ref={stackRef}
        initial="hidden"
        animate={stackInView ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {CORE_STACK.map(chip => (
          <CoreChip
            key={chip.label}
            $color={chip.color}
            $border={chip.border}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show:   { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200 } },
            }}
          >
            <ChipIcon>{chip.icon}</ChipIcon>
            {chip.label}
          </CoreChip>
        ))}
      </CoreStackRow>

      {/* SKILL CATEGORIES */}
      <SectionLabel
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Skills by Category
      </SectionLabel>

      <CategoriesGrid>
        {CATEGORIES.map((cat, i) => (
          <CatCard key={cat.title} cat={cat} delay={i * 0.08} />
        ))}
      </CategoriesGrid>

      {/* DOWNLOAD */}
      <DownloadRow
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DownloadBtn
          href="https://github.com/Fiqre-Ab"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          🐙 View GitHub Profile
        </DownloadBtn>
      </DownloadRow>
    </Page>
  );
}

export default Resume;
