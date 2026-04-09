import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

/* ---------- animations ---------- */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 1px rgba(52,152,219,0.15); }
  50%       { box-shadow: 0 0 20px rgba(218,78,162,0.2), 0 0 1px rgba(52,152,219,0.3); }
`;

/* ---------- styled components ---------- */

const Page = styled.section`
  padding: 60px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;

  @media (max-width: 480px) { padding: 40px 14px 60px; }
`;

const PageHeader = styled(motion.div)`
  margin-bottom: 48px;
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 480px) { font-size: 1.8rem; }
`;

const PageSub = styled.p`
  color: #7a9bbf;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
`;

/* ---------- engineering focus ---------- */

const FocusBar = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(52,152,219,0.18);
  border-radius: 14px;
  padding: 24px 28px;
  margin-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  align-items: center;
`;

const FocusLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #da4ea2;
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap;
`;

const FocusItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FocusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #c0d8f0;
  background: rgba(52,152,219,0.07);
  border: 1px solid rgba(52,152,219,0.15);
  border-radius: 8px;
  padding: 5px 12px;
`;

/* ---------- grid ---------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 480px) { grid-template-columns: 1fr; gap: 18px; }
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s;
  animation: ${borderGlow} 5s ease-in-out infinite;

  &:hover {
    border-color: rgba(218,78,162,0.35);
  }
`;

const FlagshipCard = styled(Card)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-color: rgba(218,78,162,0.25);
  background: linear-gradient(135deg, rgba(218,78,162,0.05), rgba(52,152,219,0.05));

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const CardImg = styled.div`
  height: 190px;
  background: ${p => p.$bg || 'rgba(52,152,219,0.08)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
  }
`;

const FlagImgPane = styled.div`
  background: linear-gradient(135deg, rgba(218,78,162,0.08), rgba(52,152,219,0.08));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 16px;

  @media (max-width: 768px) { padding: 24px; min-height: 160px; }
`;

const FlagIcon = styled.div`
  font-size: 3.5rem;
`;

const ArchText = styled.div`
  font-size: 0.75rem;
  color: #7a9bbf;
  text-align: center;
  line-height: 1.6;
  font-family: monospace;
  background: rgba(0,0,0,0.25);
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid rgba(52,152,219,0.15);
`;

const CardBody = styled.div`
  padding: 20px 22px;

  @media (max-width: 480px) { padding: 16px; }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: white;
  line-height: 1.3;
`;

const FlagBadge = styled.span`
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;

const CardText = styled.p`
  font-size: 0.87rem;
  color: #8fafc8;
  line-height: 1.6;
  margin-bottom: 14px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FeatureItem = styled.li`
  font-size: 0.8rem;
  color: #a0c0d8;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '✔';
    color: #4ade80;
    font-size: 0.7rem;
    flex-shrink: 0;
  }
`;

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const TechChip = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${p => p.$color || '#3498db'};
  background: ${p => p.$bg || 'rgba(52,152,219,0.1)'};
  border: 1px solid ${p => p.$border || 'rgba(52,152,219,0.25)'};
  border-radius: 12px;
  padding: 3px 9px;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.a`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 7px 18px;
  border-radius: 8px;
  text-decoration: none;
  background: ${p => p.$primary ? 'linear-gradient(135deg,#da4ea2,#c23d87)' : 'rgba(52,152,219,0.1)'};
  color: ${p => p.$primary ? 'white' : '#3498db'};
  border: 1px solid ${p => p.$primary ? 'transparent' : 'rgba(52,152,219,0.25)'};
  transition: opacity 0.2s, transform 0.15s;

  &:hover { opacity: 0.85; transform: translateY(-1px); }
`;

/* ---------- data ---------- */

const FOCUS_ITEMS = [
  { icon: '🏗️', label: 'Microservices Architecture' },
  { icon: '🔄', label: 'Event-Driven Systems (Kafka)' },
  { icon: '☁️', label: 'Cloud-Native Development' },
  { icon: '🔐', label: 'API Design & Security' },
  { icon: '⚡', label: 'Spring Boot Backend' },
];

const PROJECTS = [
  {
    flagship: true,
    icon: '⚙️',
    title: 'Order Processing System',
    subtitle: 'Event-Driven Microservices Architecture',
    desc: 'Designed and developed an event-driven microservices system using Spring Boot and Kafka to handle asynchronous order processing. Implemented secure REST APIs with JWT authentication and built scalable services communicating through event streaming.',
    features: [
      'Event-driven architecture using Kafka',
      'Microservices with Spring Boot (Order, Payment, Notification)',
      'JWT authentication & role-based security',
      'RESTful APIs with API Gateway',
      'Async communication between services',
    ],
    arch: 'Frontend (React)\n→ API Gateway\n→ Order Service  Payment Service\n→ Kafka Event Bus\n→ Notification Service\n→ PostgreSQL / MySQL',
    tech: [
      { label: 'Java', color: '#f89820', bg: 'rgba(248,152,32,0.1)', border: 'rgba(248,152,32,0.3)' },
      { label: 'Spring Boot', color: '#6db33f', bg: 'rgba(109,179,63,0.1)', border: 'rgba(109,179,63,0.3)' },
      { label: 'Kafka', color: '#ff6b35', bg: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)' },
      { label: 'React', color: '#61dafb', bg: 'rgba(97,218,251,0.08)', border: 'rgba(97,218,251,0.25)' },
      { label: 'JWT', color: '#da4ea2', bg: 'rgba(218,78,162,0.08)', border: 'rgba(218,78,162,0.25)' },
      { label: 'PostgreSQL', color: '#336791', bg: 'rgba(51,103,145,0.1)', border: 'rgba(51,103,145,0.3)' },
    ],
    github: 'https://github.com/Fiqre-Ab',
    live: null,
  },
  {
    img: '../worksImg/Note.png',
    title: 'Notes Management System',
    subtitle: 'Full Stack Application',
    desc: 'Full stack notes application with user authentication, CRUD operations, and real-time data persistence. Built with a REST API backend and React frontend.',
    features: [
      'REST API with Node.js & Express',
      'User authentication & sessions',
      'Persistent storage with MongoDB',
    ],
    tech: [
      { label: 'Node.js', color: '#6cc24a', bg: 'rgba(108,194,74,0.08)', border: 'rgba(108,194,74,0.25)' },
      { label: 'Express', color: '#b0bec5', bg: 'rgba(176,190,197,0.08)', border: 'rgba(176,190,197,0.25)' },
      { label: 'MongoDB', color: '#4db33d', bg: 'rgba(77,179,61,0.08)', border: 'rgba(77,179,61,0.25)' },
      { label: 'React', color: '#61dafb', bg: 'rgba(97,218,251,0.08)', border: 'rgba(97,218,251,0.25)' },
    ],
    github: 'https://github.com/Fiqre-Ab/NoteFlow',
    live: 'https://morning-wave-57359-f028f2740766.herokuapp.com/',
  },
  {
    img: '../worksImg/Movie.png',
    title: 'Movie Discovery Platform',
    subtitle: 'API Integration + Custom Filtering',
    desc: 'A web application that integrates with external movie APIs to enable search, filtering, and personalized content discovery based on user interests.',
    features: [
      'Third-party API integration',
      'Custom search & filter engine',
      'Responsive UI with React',
    ],
    tech: [
      { label: 'React', color: '#61dafb', bg: 'rgba(97,218,251,0.08)', border: 'rgba(97,218,251,0.25)' },
      { label: 'REST API', color: '#3498db', bg: 'rgba(52,152,219,0.08)', border: 'rgba(52,152,219,0.25)' },
      { label: 'JavaScript', color: '#f7df1e', bg: 'rgba(247,223,30,0.08)', border: 'rgba(247,223,30,0.25)' },
    ],
    github: 'https://github.com/d-a-v-i-d-w-r-i-g-h-t/what-to-watch',
    live: 'https://jamessahunter.github.io/What-to-watch/',
  },
  {
    img: '../worksImg/techBlog.png',
    title: 'TechInsights Blog Platform',
    subtitle: 'CMS-Style Full Stack App',
    desc: 'A CMS-style blog platform with user authentication, post management, and commenting system — built with MVC architecture.',
    features: [
      'MVC architecture with Sequelize ORM',
      'User auth with session management',
      'Full CRUD for posts & comments',
    ],
    tech: [
      { label: 'Node.js', color: '#6cc24a', bg: 'rgba(108,194,74,0.08)', border: 'rgba(108,194,74,0.25)' },
      { label: 'MySQL', color: '#4479a1', bg: 'rgba(68,121,161,0.08)', border: 'rgba(68,121,161,0.25)' },
      { label: 'Sequelize', color: '#3498db', bg: 'rgba(52,152,219,0.08)', border: 'rgba(52,152,219,0.25)' },
      { label: 'Handlebars', color: '#da4ea2', bg: 'rgba(218,78,162,0.08)', border: 'rgba(218,78,162,0.25)' },
    ],
    github: 'https://github.com/Fiqre-Ab/TechInsightsBlog',
    live: 'https://polar-harbor-69184-86e07a8cf684.herokuapp.com/',
  },
  {
    img: '../worksImg/codeQuiz.png',
    title: 'JavaScript Fundamentals Quiz',
    subtitle: 'Interactive Learning App',
    desc: 'A timed quiz application that tests JavaScript knowledge, with score tracking and local leaderboard persistence.',
    features: [
      'Timed quiz with score tracking',
      'Local storage leaderboard',
      'Dynamic question rendering',
    ],
    tech: [
      { label: 'JavaScript', color: '#f7df1e', bg: 'rgba(247,223,30,0.08)', border: 'rgba(247,223,30,0.25)' },
      { label: 'HTML5', color: '#e34c26', bg: 'rgba(227,76,38,0.08)', border: 'rgba(227,76,38,0.25)' },
      { label: 'CSS3', color: '#264de4', bg: 'rgba(38,77,228,0.08)', border: 'rgba(38,77,228,0.25)' },
    ],
    github: 'https://github.com/Fiqre-Ab/code-quize',
    live: 'https://fiqre-ab.github.io/code-quize/',
  },
  {
    img: '../worksImg/J.A.T.E.png',
    title: 'PWA Text Editor',
    subtitle: 'Offline-Capable Web App',
    desc: 'A Progressive Web App text editor with offline support using IndexedDB and Webpack bundling — installable on any device.',
    features: [
      'PWA — works offline',
      'IndexedDB for data persistence',
      'Webpack module bundling',
    ],
    tech: [
      { label: 'JavaScript', color: '#f7df1e', bg: 'rgba(247,223,30,0.08)', border: 'rgba(247,223,30,0.25)' },
      { label: 'Webpack', color: '#8dd6f9', bg: 'rgba(141,214,249,0.08)', border: 'rgba(141,214,249,0.25)' },
      { label: 'IndexedDB', color: '#b0bec5', bg: 'rgba(176,190,197,0.08)', border: 'rgba(176,190,197,0.25)' },
      { label: 'PWA', color: '#da4ea2', bg: 'rgba(218,78,162,0.08)', border: 'rgba(218,78,162,0.25)' },
    ],
    github: 'https://github.com/Fiqre-Ab/WebPackTextEditor',
    live: 'https://texteditor-7odd.onrender.com/',
  },
];

const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  show: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

/* ---------- component ---------- */

function Work() {
  return (
    <Page>
      <PageHeader initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <PageTitle>Portfolio Highlights</PageTitle>
        <PageSub>Production-ready systems · Microservices · Cloud · APIs</PageSub>
      </PageHeader>

      {/* Engineering Focus */}
      <FocusBar initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
        <FocusLabel>💼 Engineering Focus</FocusLabel>
        <FocusItems>
          {FOCUS_ITEMS.map(f => (
            <FocusItem key={f.label}>{f.icon} {f.label}</FocusItem>
          ))}
        </FocusItems>
      </FocusBar>

      <Grid>
        {PROJECTS.map((p, i) =>
          p.flagship ? (
            <FlagshipCard key={p.title} variants={cardAnim} custom={i} initial="hidden" animate="show">
              <FlagImgPane>
                <FlagIcon>{p.icon}</FlagIcon>
                <ArchText>{p.arch}</ArchText>
              </FlagImgPane>
              <CardBody>
                <CardTopRow>
                  <CardTitle>{p.title}<br /><span style={{ fontSize: '0.82rem', color: '#7a9bbf', fontWeight: 500 }}>{p.subtitle}</span></CardTitle>
                  <FlagBadge>🔥 Flagship</FlagBadge>
                </CardTopRow>
                <CardText>{p.desc}</CardText>
                <FeatureList>
                  {p.features.map(f => <FeatureItem key={f}>{f}</FeatureItem>)}
                </FeatureList>
                <TechRow>
                  {p.tech.map(t => <TechChip key={t.label} $color={t.color} $bg={t.bg} $border={t.border}>{t.label}</TechChip>)}
                </TechRow>
                <BtnRow>
                  <Btn href={p.github} target="_blank" rel="noopener noreferrer" $primary>GitHub</Btn>
                  {p.live && <Btn href={p.live} target="_blank" rel="noopener noreferrer">Live Demo</Btn>}
                </BtnRow>
              </CardBody>
            </FlagshipCard>
          ) : (
            <Card key={p.title} variants={cardAnim} custom={i} initial="hidden" animate="show">
              <CardImg>
                {p.img
                  ? <img src={p.img} alt={p.title} onError={e => { e.target.parentElement.innerHTML = p.icon || '💻'; }} />
                  : p.icon}
              </CardImg>
              <CardBody>
                <CardTopRow>
                  <CardTitle>
                    {p.title}<br />
                    <span style={{ fontSize: '0.78rem', color: '#7a9bbf', fontWeight: 500 }}>{p.subtitle}</span>
                  </CardTitle>
                </CardTopRow>
                <CardText>{p.desc}</CardText>
                <FeatureList>
                  {p.features.map(f => <FeatureItem key={f}>{f}</FeatureItem>)}
                </FeatureList>
                <TechRow>
                  {p.tech.map(t => <TechChip key={t.label} $color={t.color} $bg={t.bg} $border={t.border}>{t.label}</TechChip>)}
                </TechRow>
                <BtnRow>
                  <Btn href={p.github} target="_blank" rel="noopener noreferrer" $primary>GitHub</Btn>
                  {p.live && <Btn href={p.live} target="_blank" rel="noopener noreferrer">Live Demo</Btn>}
                </BtnRow>
              </CardBody>
            </Card>
          )
        )}
      </Grid>
    </Page>
  );
}

export default Work;
