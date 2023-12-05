
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Section = styled.section`
 padding: 4rem 0;

  min-height: 100vh; // Ensure it's at least as tall as the viewport, but can grow
  scroll-snap-align: start; // Align to the start of the section
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 15px;
`;

const Card = styled.div`
  background-color: #252934; // Card background color
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;
const CardImage = styled.img`
  width: 100%;
  height: 200px; // Set a fixed height or use min-height
  object-fit: cover; // This will cover the area, preserving aspect ratio
`;

const CardBody = styled.div`
  padding: 1rem;
  color: white;
  min-height: 150px; // Ensure all card bodies are at least this tall
`;

const CardTitle = styled.h3`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #da43a2; // Adjust to your theme color
  color: white;
  text-align: center;
  text-decoration: none;
  &:hover {
    background-color: #c23d87;
  }
`;
const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: white;
  font-size: 2rem;
  margin: 0;
`;

function Works() {
  return (
    <Section>
          <TitleSection>
        <Title>Portfolio Highlights</Title> {/* Replace with your chosen title */}
      </TitleSection>
      <Container>
        {/* Repeat this Card component for each project */}
        <Card>
          <CardImage src="../worksImg/game.png" alt="Game Image" />
          <CardBody>
            <CardTitle>My Sequel Adventure</CardTitle>
            <CardText> A game application where users can first create a character. Then they can use their character to fight against to win battles and grow their strength points and add up their wins</CardText>
            <ButtonGroup>
              <Button to="https://github.com/taylasagerios/my-sequel-adventure">Github</Button>
              <Button to="https://my-sequel-adventure-a9247b63bc9a.herokuapp.com/">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
            <Card>
          <CardImage src="../worksImg/Note.png" alt="Note Image" />
          <CardBody>
            <CardTitle>The Note Flow</CardTitle>
            <CardText>a web application that allows users to create, save, and manage notes. It provides a simple and intuitive interface for keeping track of important information</CardText>
            <ButtonGroup>
              <Button to="https://github.com/Fiqre-Ab/NoteFlow">Github</Button>
              <Button to="https://morning-wave-57359-f028f2740766.herokuapp.com/">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
            <Card>
          <CardImage src="../worksImg/Movie.png" alt="Movie Image" />
          <CardBody>
            <CardTitle>What a Watch</CardTitle>
            <CardText>a web application that simplifies the process of searching for movies and customizing the information displayed according to the user's interests.</CardText>
            <ButtonGroup>
              <Button to="https://github.com/d-a-v-i-d-w-r-i-g-h-t/what-to-watch">Github</Button>
              <Button to="https://jamessahunter.github.io/What-to-watch/">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
            <Card>
          <CardImage src="../worksImg/codeQuiz.png" alt="JATE Image" />
          <CardBody>
            <CardTitle>Code Quiz </CardTitle>
            <CardText> a web application that allows users to test their knowledge of JavaScript fundamentals</CardText>
            <ButtonGroup>
               <Button to="https://github.com/Fiqre-Ab/code-quize">Github</Button>
              <Button to="https://fiqre-ab.github.io/code-quize/">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
            <Card>
          <CardImage src="../worksImg/techBlog.png" alt="Project Image" />
          <CardBody>
            <CardTitle>TechInsightsBlog</CardTitle>
            <CardText> Content Management System (CMS)-style blog site designed to allow users to create, manage, and share blog posts.</CardText>
            <ButtonGroup>
              <Button to="https://github.com/Fiqre-Ab/TechInsightsBlog">Github</Button>
              <Button to="https://polar-harbor-69184-86e07a8cf684.herokuapp.com/">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
            <Card>
          <CardImage src="../worksImg/J.A.T.E.png" alt="JATE Image"  />
          <CardBody>
            <CardTitle>WebPackTextEditor</CardTitle>
            <CardText> A simple text editor application built using Webpack, PWA (Progressive Web App) features, and IndexedDB for data storage.</CardText>
            <ButtonGroup>
              <Button to="https://github.com/Fiqre-Ab/WebPackTextEditor">Github</Button>
              <Button to="https://texteditor-7odd.onrender.com//">Live Demo</Button>
            </ButtonGroup>
          </CardBody>
        </Card>
      
        {/* ...other cards */}
      </Container>
    </Section>
  );
}

export default Works;
