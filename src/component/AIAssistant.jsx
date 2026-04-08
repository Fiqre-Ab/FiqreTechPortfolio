import { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- animations ---------- */

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(218, 78, 162, 0.5); }
  50%       { box-shadow: 0 0 0 12px rgba(218, 78, 162, 0); }
`;

const typing = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30%           { transform: translateY(-6px); }
`;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ---------- styled components ---------- */

const Wrapper = styled.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const FAB = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #da4ea2, #3498db);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  animation: ${pulse} 2.5s ease-in-out infinite;
  box-shadow: 0 4px 20px rgba(218, 78, 162, 0.4);
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff4757;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatWindow = styled(motion.div)`
  width: 360px;
  height: 500px;
  background: rgba(10, 10, 30, 0.95);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(52, 152, 219, 0.1);
  backdrop-filter: blur(20px);

  @media (max-width: 420px) {
    width: 320px;
    height: 450px;
  }
`;

const ChatHeader = styled.div`
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(218, 78, 162, 0.2));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarDot = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #da4ea2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const HeaderInfo = styled.div`
  flex: 1;
  h4 { margin: 0; font-size: 0.9rem; color: white; font-weight: 600; }
  span { font-size: 0.72rem; color: #6cc24a; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #b0bec5;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  &:hover { color: white; }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(218, 78, 162, 0.4); border-radius: 2px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: ${p => p.$from === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px'};
  font-size: 0.82rem;
  line-height: 1.55;
  animation: ${fadeSlide} 0.25s ease-out;

  ${p => p.$from === 'ai' ? css`
    background: rgba(52, 152, 219, 0.15);
    border: 1px solid rgba(52, 152, 219, 0.25);
    color: #e0e8f0;
    align-self: flex-start;
  ` : css`
    background: linear-gradient(135deg, rgba(218, 78, 162, 0.3), rgba(52, 152, 219, 0.2));
    border: 1px solid rgba(218, 78, 162, 0.3);
    color: white;
    align-self: flex-end;
  `}
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 10px 14px;
  background: rgba(52, 152, 219, 0.12);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 4px 16px 16px 16px;
  align-self: flex-start;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3498db;
    animation: ${typing} 1.2s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const QuickReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const QuickBtn = styled.button`
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid rgba(52, 152, 219, 0.4);
  background: rgba(52, 152, 219, 0.08);
  color: #7ec8f4;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(52, 152, 219, 0.2);
    border-color: rgba(52, 152, 219, 0.7);
    color: white;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 20px;
  padding: 9px 16px;
  color: white;
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder { color: rgba(255, 255, 255, 0.3); }
  &:focus { border-color: rgba(52, 152, 219, 0.7); }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #da4ea2, #3498db);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  flex-shrink: 0;

  &:hover { transform: scale(1.1); }
  &:active { transform: scale(0.95); }
`;

/* ---------- AI Brain ---------- */

const KB = [
  {
    keys: ['hello', 'hi', 'hey', 'sup', 'hola', 'greetings', 'howdy', 'yo', 'start', 'begin'],
    reply: "Hey there! 👋 I'm Letekidan — Fiqre's AI assistant. I can tell you about his skills, projects, experience, and more. What would you like to know?",
  },
  {
    keys: ['who', 'fiqre', 'about', 'yourself', 'person', 'developer', 'introduce', 'tell me'],
    reply: "Fiqre is a Full Stack Developer specializing in the MERN stack — React, Node.js, Express, and MongoDB. He builds scalable, visually compelling web apps and turns complex problems into clean, modern solutions. 🚀",
  },
  {
    keys: ['skill', 'tech', 'know', 'language', 'stack', 'expert', 'capable', 'proficient', 'learn', 'use', 'technologies'],
    reply: "Fiqre is skilled in:\n\n• Front-end: React, TypeScript, JavaScript, HTML5, CSS3\n• Back-end: Node.js, Express, Java, Spring Boot\n• Databases: MongoDB, MySQL, PostgreSQL\n• Tools: Git, Docker, AWS, REST APIs\n\nCheck the Resume page for the full list! 📄",
  },
  {
    keys: ['project', 'work', 'portfolio', 'built', 'app', 'application', 'made', 'create', 'build', 'show'],
    reply: "Fiqre has built some awesome projects:\n\n🎮 Quiz App — Interactive code quiz\n🎬 Movie Database — Search & browse films\n📝 Note App — Full-stack note manager\n💻 Tech Blog — CMS-powered blog\n⚡ J.A.T.E — Progressive web text editor\n\nSee them all on the Portfolio page!",
  },
  {
    keys: ['contact', 'email', 'reach', 'hire', 'connect', 'message', 'talk', 'touch', 'available', 'freelance'],
    reply: "Want to work with Fiqre? Head to the Contact page and send a message — he'd love to hear from you! 📬",
  },
  {
    keys: ['resume', 'cv', 'experience', 'job', 'history', 'background', 'qualif'],
    reply: "Fiqre's Resume page has his full skill breakdown across Front-end, Back-end, and General Development. Check it out! 📋",
  },
  {
    keys: ['game', 'play', 'fun', 'mini', 'snake', 'tictac', 'memory', 'breakout', 'whack', 'mole', 'brick'],
    reply: "🎮 Head to the Games page! Five mini-games built right into the portfolio:\n\n🐍 Snake — classic arcade\n❌ Tic-Tac-Toe — vs AI\n🎴 Memory Match — flip cards\n🧱 Breakout — smash bricks\n🔨 Whack-a-Mole — reflex test\n\nAll built from scratch!",
  },
  {
    keys: ['react', 'mern', 'node', 'mongo', 'express', 'javascript', 'frontend', 'front end'],
    reply: "Fiqre's primary stack is MERN: MongoDB, Express.js, React, and Node.js — building full-stack apps end-to-end. He's also strong in TypeScript and modern JS patterns. 💪",
  },
  {
    keys: ['java', 'spring', 'backend', 'back-end', 'server', 'api', 'database', 'sql', 'python'],
    reply: "On the back-end, Fiqre works with Node.js/Express for JS projects and Java/Spring Boot for enterprise apps. Comfortable with REST APIs, GraphQL, and multiple databases. ⚙️",
  },
  {
    keys: ['3d', 'three', 'threejs', 'globe', 'animation', 'visual', 'design', 'cool', 'nice portfolio'],
    reply: "That spinning 3D globe with the floating tech labels? Built with Three.js and React Three Fiber! ✨ Fiqre loves mixing strong engineering with impressive visuals.",
  },
  {
    keys: ['help', 'can you', 'what do', 'options', 'feature', 'what can', 'commands'],
    reply: "I can answer questions about:\n\n• Fiqre's skills & tech stack\n• Projects & portfolio\n• Contact / hiring info\n• Games section\n• Resume & experience\n• This portfolio itself\n\nJust ask anything! 😊",
  },
  {
    keys: ['location', 'where', 'country', 'city', 'based', 'live'],
    reply: "Fiqre is a remote-friendly developer, open to opportunities worldwide. 🌍 Reach out via the Contact page for details!",
  },
  {
    keys: ['education', 'degree', 'study', 'university', 'school', 'college', 'training', 'revature'],
    reply: "Fiqre trained at Revature, an intensive full-stack development program focused on Java and MERN stack technologies. Combined with hands-on project experience, he's production-ready! 🎓",
  },
  {
    keys: ['github', 'code', 'repo', 'source', 'open source', 'contribution'],
    reply: "Check out Fiqre's GitHub for his open source work and project source code — the link is in the footer! 💻",
  },
];

const QUICK = ['About Fiqre', 'Skills', 'Projects', 'Games', 'Contact', 'Help'];

/* Casual one-word / short replies */
const CASUAL_MAP = {
  'ok': "Sure thing! Ask me anything about Fiqre. 😊",
  'okay': "Got it! What would you like to know? 😊",
  'yes': "Great! What would you like to know? Try asking about skills, projects, or games! 😊",
  'no': "No worries! I'm here whenever you need me. 👋",
  'thanks': "You're welcome! 😊 Anything else?",
  'thank you': "Happy to help! 🙂 Let me know if you have more questions.",
  'cool': "Right?! 😎 Fiqre puts a lot of love into every detail. Anything else?",
  'wow': "I know! 🤩 Fiqre really goes all out. Want to know more about a specific part?",
  'nice': "Thanks! 😊 Want to know more about the portfolio?",
  'great': "Awesome! 🎉 Anything else you'd like to explore?",
  'good': "Glad you think so! 😊 Anything I can help with?",
  'lol': "Haha! 😄 Anything else you'd like to know?",
  'haha': "😄 Always happy to chat! Ask me anything.",
  'interesting': "Agreed! 🤓 There's a lot more to explore — try asking about the projects or games!",
  'bye': "Goodbye! 👋 Come back anytime if you have more questions!",
  'test': "I'm working perfectly! 🟢 Go ahead and ask me something real. 😄",
};

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function getReply(rawText) {
  const trimmed = rawText.trim();

  // Too short to be a real question
  if (trimmed.length <= 1) {
    return "Hmm, that was a bit short! 😄 Try asking something like:\n• \"What skills does Fiqre have?\"\n• \"Show me his projects\"\n• \"How can I contact him?\"";
  }

  const normalized = normalize(trimmed);

  // Exact or near-exact casual match
  if (CASUAL_MAP[normalized]) return CASUAL_MAP[normalized];
  // Partial casual match (starts with)
  for (const [key, val] of Object.entries(CASUAL_MAP)) {
    if (normalized === key || normalized.startsWith(key + ' ') || normalized.endsWith(' ' + key)) {
      return val;
    }
  }

  const words = normalized.split(/\s+/);

  // Check KB — word-level match (more forgiving than substring)
  for (const entry of KB) {
    const matched = entry.keys.some(k => {
      const kn = k.toLowerCase();
      // Full text contains keyword
      if (normalized.includes(kn)) return true;
      // Any word starts with a keyword of length ≥ 4
      if (kn.length >= 4 && words.some(w => w.startsWith(kn) || kn.startsWith(w) && w.length >= 3)) return true;
      return false;
    });
    if (matched) return entry.reply;
  }

  // Smart fallback
  return `I'm not sure about "${trimmed}" 🤔 Here's what I can help with:\n\n• Skills & tech stack\n• Projects & portfolio\n• Contact info\n• Games section\n• Resume\n\nOr just click a quick button below! 👇`;
}

/* ---------- Component ---------- */

let idCounter = 0;
const uid = () => ++idCounter;

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: uid(), from: 'ai', text: "Hi! I'm Letekidan, Fiqre's AI assistant. 🤖 Ask me anything about his skills, projects, or how to get in touch!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const send = (text) => {
    const userText = text.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { id: uid(), from: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: uid(), from: 'ai', text: getReply(userText) }]);
    }, 800 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') send(input);
  };

  return (
    <Wrapper>
      <AnimatePresence>
        {open && (
          <ChatWindow
            key="chat"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChatHeader>
              <AvatarDot>🤖</AvatarDot>
              <HeaderInfo>
                <h4>Letekidan</h4>
                <span>● Online — Portfolio Assistant</span>
              </HeaderInfo>
              <CloseBtn onClick={() => setOpen(false)}>✕</CloseBtn>
            </ChatHeader>

            <Messages>
              {messages.map(msg => (
                <Bubble key={msg.id} $from={msg.from}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}
                </Bubble>
              ))}
              {isTyping && (
                <TypingIndicator>
                  <span /><span /><span />
                </TypingIndicator>
              )}
              <div ref={bottomRef} />
            </Messages>

            <QuickReplies>
              {QUICK.map(q => (
                <QuickBtn key={q} onClick={() => send(q)}>{q}</QuickBtn>
              ))}
            </QuickReplies>

            <InputRow>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
              />
              <SendBtn onClick={() => send(input)}>➤</SendBtn>
            </InputRow>
          </ChatWindow>
        )}
      </AnimatePresence>

      <FAB
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        title="Chat with Letekidan"
      >
        {open ? '✕' : '🤖'}
        {!open && unread > 0 && <Badge>{unread}</Badge>}
      </FAB>
    </Wrapper>
  );
}
