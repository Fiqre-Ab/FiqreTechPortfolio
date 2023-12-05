    import React, { useState } from 'react';
    import styled from 'styled-components';





    const AboutContainer = styled.div`
    color: #white;
    padding: 10px 0;
    height: 100vh;
    scroll-snap-align: center;
    display:flex;
    flex-direction:column
    
    `;

    const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 2px; /* Space between text/image and the skills orbit */
    `;

    const Column = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    `;

    const Title = styled.h1`
    font-size: 48px;
    color: #da4ea2;
    font-weight: bold;
    `;

    const Subtitle = styled.h2`
    color: #da4ea2;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    `;

    const Desc = styled.p`
    font-size: 18px;
    text-align: center;
    max-width: 400px; /* To prevent the description from becoming too wide */
    `;

    const Button = styled.button`
    background-color: #da4ea2;
    color: white;
    font-weight: bold;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 20px;

    &:hover {
        background-color: #c23d87;
    }
    `;

    const Img = styled.img`
    width: 100%;
    max-width: 400px;
    height: auto;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `;

const SkillsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 400px;
  margin-top: -130px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
  
`

    const SkillOrbit = styled.div`
    position: absolute;
    width: ${(props) => props.diameter}px;
    height: ${(props) => props.diameter}px;
    border-radius: 50%;
    border: 3px solid #da4ea2;
    display: flex;
    justify-content: center;
    align-items: center;
    `;

    const SkillLabel = styled.span`
    position: absolute;
    color: white;
    font-weight: bold;
    transform: translate(-50%, -50%);
    z-index: 10; // Position the label above the orbit line
    `;

  const About = () => {
  const [skillsVisible, setSkillsVisible] = useState(false);

  const toggleSkills = () => {
    setSkillsVisible(!skillsVisible);
  };


    return (
   
        <AboutContainer>
        <div className="container">
            <Row>
            <Column className="col-md-6">
                <Title>About Me</Title>
                <Subtitle>I'm a versatile web designer and full-stack developer</Subtitle>
                <Desc>My expertise is in Web design, WordPress development, eCommerce stores, and SEO optimization. If you'd like me to get involved with helping your business grow, I'm all ears!</Desc>
                 <Button onClick={toggleSkills}>Skills</Button>
            </Column>
            <Column className="col-md-6">
                <Img src="../img/About.jpeg" alt="Profile" />
            </Column>
            </Row>
        </div>
        {skillsVisible && (
            <SkillsContainer visible={skillsVisible} className="v">
            <SkillOrbit diameter={350}>
                <SkillLabel style={{ top: '50%', left: '50%' }}>Web</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={300}>
                <SkillLabel style={{ top: '50%', left: '100%' }}>CSS</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={250}>
                <SkillLabel style={{ top: '50%', left: '0%' }}>HTML</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={200}>
                <SkillLabel style={{ bottom: '6%', left: '50%' }}>JavaScript</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={150}>
                <SkillLabel style={{ top: '0%', left: '50%' }}>React</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={100}>
                <SkillLabel style={{ top: '10%', right: '100%' }}>Node.js</SkillLabel>
            </SkillOrbit>
            <SkillOrbit diameter={50}>
                <SkillLabel style={{ bottom: '100%', left: '50%' }}>MongoDB</SkillLabel>
            </SkillOrbit>
            {/* Add more SkillOrbits as needed */}
            </SkillsContainer>
        )}
        </AboutContainer>
  
    );
    };

    export default About;
