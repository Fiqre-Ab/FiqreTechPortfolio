
import styled from 'styled-components';//to style 
import { Link } from 'react-router-dom';//link 
import { useSpring, animated, config } from 'react-spring';//adding animated spring text
import Typist from 'react-typist';//adding animated  typist for text


const Section = styled.div`
  height: auto;
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
  gap: 10px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled(animated.h1)`
 color: #3498db;
  font-size: 75px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Whatido = styled.div`
  display: flex;
  align-items: center;
  gap:10px;
`;

const Subtitle = styled(animated.h2)`
  color: #da4ea2;
`;

const Desc = styled(animated.p)`
  font-size: 24px;
  color: lightgray;
  gap:10px;
  @media (max-width: 768px) {
    font-size: 1rem;

  }
`;

const Button = styled(Link)`
  background-color: #da4ea2;
  color: white;
  font-weight: 500;
  width: 160px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  text-decoration: none; /* Remove default link underline and make them none */
  transition: background-color 0.3s ease; /* Smooth transition on hover */

  &:hover {
    background-color: #c23d87;
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // absolute positioning of Img

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
    width: 50%; // Full width on mobile
    height: auto; //  height automatically
  }
`;


function Home() {
  const subtitleAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.wobbly,
    delay: 300, // Delay for a cool one-by-one effect
  });

  const descAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.wobbly,
    delay: 600,
  });
  

  return (
    <Section>
      <Containers>
        <Left>
          <Typist startDelay={1000} cursor={{ hideWhenDone: true }}>
            <Title style={subtitleAnimation}>
              <Typist.Delay ms={500} />
              Hi, I am Fiqre
            </Title>
          </Typist>
          <Whatido>
            <Subtitle style={subtitleAnimation}>What I Do</Subtitle>
          </Whatido>
         <Desc style={descAnimation}>
            As a dedicated Full Stack Developer specializing in the MERN stack, I bring a robust blend of technical expertise and innovative problem-solving skills to the table. My passion lies in exploring cutting-edge technologies and developing scalable, efficient solutions that drive business success.
       </Desc>
          <Button to="/contact">Contact me</Button>
        </Left>
        <Right>
          <Img src="../img/space.png" alt="Innovative Space" />
        </Right>
      </Containers>
    </Section>
  );
}

export default Home;
