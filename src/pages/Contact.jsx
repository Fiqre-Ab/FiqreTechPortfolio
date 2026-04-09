import { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- animations ---------- */

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmer = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(218,78,162,0.4); }
  70%  { box-shadow: 0 0 0 12px rgba(218,78,162,0); }
  100% { box-shadow: 0 0 0 0 rgba(218,78,162,0); }
`;

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const successPop = keyframes`
  0%   { transform: scale(0.7); opacity: 0; }
  70%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
`;

/* ---------- layout ---------- */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px 80px;
  position: relative;
  color: white;

  @media (max-width: 480px) { padding: 40px 14px 60px; }
`;

const InnerGrid = styled.div`
  width: 100%;
  max-width: 940px;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

/* ---------- left column ---------- */

const LeftCol = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Headline = styled.div``;

const PageTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  background: linear-gradient(135deg, #da4ea2, #3498db, #da4ea2);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  line-height: 1.15;
`;

const PageSub = styled.p`
  color: #7a9bbf;
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 340px;
`;

const InfoCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoCard = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  text-decoration: none;
  color: white;
  transition: border-color 0.25s, background 0.25s, transform 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${p => p.$accent || 'rgba(218,78,162,0.4)'};
    background: rgba(255,255,255,0.05);
    transform: translateX(4px);
  }
`;

const InfoIcon = styled.div`
  width: 42px; height: 42px;
  border-radius: 12px;
  background: ${p => p.$bg || 'rgba(218,78,162,0.1)'};
  border: 1px solid ${p => p.$border || 'rgba(218,78,162,0.25)'};
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  display: flex; flex-direction: column; gap: 2px;
`;

const InfoLabel = styled.div`
  font-size: 0.7rem;
  color: #7a9bbf;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const InfoValue = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: #d0dde8;
`;

const StatusPill = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.8rem;
  color: #4ade80;
  font-weight: 600;
  width: fit-content;
  animation: ${pulseRing} 2.5s ease-in-out infinite;

  &::before {
    content: '';
    width: 8px; height: 8px;
    background: #4ade80;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

/* ---------- form card (glass) ---------- */

const FormCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 22px;
  padding: 36px 32px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(6px);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: -60%;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
    animation: ${shimmer} 5s ease-in-out infinite;
    pointer-events: none;
  }

  /* top gradient border */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #da4ea2, #3498db, #da4ea2);
    background-size: 200%;
    animation: ${gradientShift} 4s ease infinite;
    border-radius: 22px 22px 0 0;
  }

  @media (max-width: 480px) { padding: 24px 18px; }
`;

const FormTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #da4ea2;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 24px;
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

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 22px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  color: #7a9bbf;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const InputBase = `
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: rgba(255,255,255,0.2); }

  &:focus {
    border-color: rgba(218,78,162,0.5);
    background: rgba(218,78,162,0.04);
    box-shadow: 0 0 0 3px rgba(218,78,162,0.1);
  }
`;

const StyledInput = styled.input`
  ${InputBase}
  padding: 11px 14px;
`;

const StyledTextArea = styled.textarea`
  ${InputBase}
  padding: 12px 14px;
  resize: vertical;
  min-height: 120px;
  line-height: 1.55;
`;

const SendBtn = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ErrorMsg = styled(motion.div)`
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(255,50,50,0.08);
  border: 1px solid rgba(255,80,80,0.25);
  border-radius: 8px;
  color: #ff8888;
  font-size: 0.82rem;
  text-align: center;
`;

/* ---------- success state ---------- */

const SuccessCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
  animation: ${successPop} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  width: 64px; height: 64px;
  background: rgba(74,222,128,0.12);
  border: 2px solid rgba(74,222,128,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
`;

const SuccessTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
`;

const SuccessSub = styled.div`
  font-size: 0.88rem;
  color: #7a9bbf;
  line-height: 1.6;
  max-width: 280px;
`;

const ResetBtn = styled(motion.button)`
  background: rgba(52,152,219,0.1);
  border: 1px solid rgba(52,152,219,0.3);
  border-radius: 20px;
  color: #61dafb;
  font-size: 0.8rem;
  padding: 7px 20px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.2s;
  &:hover { background: rgba(52,152,219,0.2); }
`;

/* ---------- component ---------- */

const INFO_LINKS = [
  {
    icon: '📧',
    label: 'Email',
    value: 'fiqre.abate@example.com',
    href: 'mailto:fiqre.abate@example.com',
    bg: 'rgba(218,78,162,0.1)', border: 'rgba(218,78,162,0.25)',
    accent: 'rgba(218,78,162,0.4)',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/Fiqre-Ab',
    href: 'https://github.com/Fiqre-Ab',
    bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)',
    accent: 'rgba(255,255,255,0.25)',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'linkedin.com/in/fiqre',
    href: 'https://linkedin.com',
    bg: 'rgba(52,152,219,0.1)', border: 'rgba(52,152,219,0.25)',
    accent: 'rgba(52,152,219,0.4)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: 'easeOut' } }),
};

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error,    setError]    = useState('');
  const [sent,     setSent]     = useState(false);
  const [sending,  setSending]  = useState(false);

  const handleChange = e =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields before sending.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    setError(''); setSending(true);
    // Simulate async send
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const reset = () => {
    setSent(false); setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Page>
      <InnerGrid>
        {/* LEFT */}
        <LeftCol variants={fadeUp} custom={0} initial="hidden" animate="show">
          <Headline>
            <PageTitle>Let's Build<br />Something Great</PageTitle>
            <PageSub>
              Open to backend engineering roles, full stack projects, and
              interesting collaborations. Drop a message — I read every one.
            </PageSub>
          </Headline>

          <StatusPill
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Available for opportunities
          </StatusPill>

          <InfoCards>
            {INFO_LINKS.map((link, i) => (
              <InfoCard
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                $accent={link.accent}
                variants={fadeUp}
                custom={0.2 + i * 0.1}
                initial="hidden"
                animate="show"
              >
                <InfoIcon $bg={link.bg} $border={link.border}>{link.icon}</InfoIcon>
                <InfoText>
                  <InfoLabel>{link.label}</InfoLabel>
                  <InfoValue>{link.value}</InfoValue>
                </InfoText>
              </InfoCard>
            ))}
          </InfoCards>
        </LeftCol>

        {/* RIGHT — form card */}
        <FormCard
          variants={fadeUp}
          custom={0.15}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <FormTitle>Send a Message</FormTitle>

                <form onSubmit={handleSubmit} noValidate>
                  <FieldGroup>
                    <FieldRow>
                      <Field>
                        <FieldLabel>Name</FieldLabel>
                        <StyledInput
                          type="text" name="name" placeholder="Your name"
                          value={formData.name} onChange={handleChange}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <StyledInput
                          type="email" name="email" placeholder="you@example.com"
                          value={formData.email} onChange={handleChange}
                        />
                      </Field>
                    </FieldRow>
                    <Field>
                      <FieldLabel>Message</FieldLabel>
                      <StyledTextArea
                        name="message"
                        placeholder="Tell me about your project or opportunity..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Field>
                  </FieldGroup>

                  <SendBtn
                    type="submit"
                    disabled={sending}
                    whileHover={!sending ? { scale: 1.02 } : {}}
                    whileTap={!sending ? { scale: 0.98 } : {}}
                  >
                    {sending ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block' }}
                        >⟳</motion.span>
                        Sending...
                      </>
                    ) : (
                      <>Send Message 🚀</>
                    )}
                  </SendBtn>

                  <AnimatePresence>
                    {error && (
                      <ErrorMsg
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {error}
                      </ErrorMsg>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            ) : (
              <SuccessCard
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SuccessIcon>✅</SuccessIcon>
                <SuccessTitle>Message Sent!</SuccessTitle>
                <SuccessSub>
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </SuccessSub>
                <ResetBtn onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  Send another message
                </ResetBtn>
              </SuccessCard>
            )}
          </AnimatePresence>
        </FormCard>
      </InnerGrid>
    </Page>
  );
}

export default Contact;
