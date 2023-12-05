import React from 'react';
import styled from 'styled-components';


const Section = styled.div`
  height: 100vh;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
`;

const Containers = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 90px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 20px;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 74px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Whatido = styled.div`
  display: flex;
  align-items: center;
`;

const Subtitle = styled.h2`
  color: #da4ea2;
`;

const Desc = styled.p`
  font-size: 24px;
  color: lightgray;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  background-color: #da4ea2;
  color: white;
  font-weight: 500;
  width: 160px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // Adjusted for absolute positioning of Img

  @media (max-width: 768px) {
    order: -1; // Image above the text on mobile
  }
`;

const Img = styled.img`
  width: 600px;
  height: 400px;
  object-fit: contain;
  margin: auto;
  animation: animate 2s infinite ease alternate;

  @keyframes animate {
    100% {
      transform: translateY(20px);
    }
  }

  @media (max-width: 768px) {
    width: 100%; // Full width on mobile
    height: auto; // Adjust height automatically
  }
`;

function Home() {
  return (
    <Section>
    
      <Containers>
        <Left>
          <Title>Hi, I'm Fiqre</Title>
          <Whatido>
            <Subtitle>What I Do</Subtitle>
          </Whatido>
          <Desc>Crafting Digital Experiences as a Full Stack Developer</Desc>
          <Button>Discover My Journey</Button>
        </Left>
        <Right>
          <Img src="../img/space.png" alt="Innovative Space" />
        </Right>
      </Containers>
    </Section>
  );
}

export default Home;
