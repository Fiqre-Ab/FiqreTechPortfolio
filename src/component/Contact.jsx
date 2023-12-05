import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
 
`;

const FlipContainer = styled.div`
  width: 350px; // Slightly larger width
  height: 450px;
  perspective: 1000px;
  border-radius: 20px; // Rounded corners for the card
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); // A subtle shadow for depth
`;

const Flipper = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  border-radius: 20px; // Rounded corners for the flipper
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'none'};
`;

const CardSide = styled.div`
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px; // Rounded corners for each side
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5em;
`;

const Front = styled(CardSide)`
  background: url('../public/img/contact.png') center/cover; // image URL 
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  &:hover {
    background: #0e3d58; // A darker shade for hover effect
  }
`;

const Back = styled(CardSide)`
  background: url('../public/img/contact.png') center/cover; // image URL 
  transform: rotateY(180deg);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75em;
  margin-bottom: 1em;
  border-radius: 10px;
  border: 1px solid #ccc;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75em;
  margin-bottom: 1em;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: none; // Disables resizing
  
`;

const SubmitButton = styled.button`
  padding: 0.75em 2em;
  color: white;
  background-color: #e63946; // Bright red for the submit button
  border: none;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #a52834; // Darker shade when hovered
  }
`;

function Contact() {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped(!flipped);

  return (
    <Section>
      <FlipContainer>
        <Flipper flipped={flipped}>
          <Front onClick={toggleFlip}>
            🎁 Click to Contact!
  </Front>
          <Back>
            <form>
              <StyledInput type="text" placeholder="Your Name" />
              <StyledInput type="email" placeholder="Your Email" />
              <StyledTextArea rows="4" placeholder="Your Message" />
              <SubmitButton type="submit">Send 🚀</SubmitButton>
            </form>
          </Back>
        </Flipper>
      </FlipContainer>
    </Section>
  );
}

export default Contact;
