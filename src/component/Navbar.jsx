import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
 background-color: rgba(218, 74, 162, 0.8);
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Icon = styled.img`
  width: 50px;
  height: 30px;
  cursor: pointer;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;


const Logo = styled.img`
  width: 190px;
  height: 80px;
  cursor: pointer;

  @media (max-width: 768px) {
    order: -1; // This will move the logo to the first position on small screens
  }
`

const List = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  background-color: #da43a2;
  border-radius: 5px;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c23d87;
  }
`;

function Navbar() {
  return (
    <Section>
      <Container>
        <Links>
          <Logo src="../img/logo.png" alt="logo" />
          <List>
            <StyledLink to="/"><ListItem>Home</ListItem></StyledLink>
            <StyledLink to="/about"><ListItem>About</ListItem></StyledLink>
            <StyledLink to="/portfolio"><ListItem>Portfolio</ListItem></StyledLink>
            <StyledLink to="/resume"><ListItem>Resume</ListItem></StyledLink>
            <StyledLink to="/contact"><ListItem>Contact</ListItem></StyledLink>
            
          </List>
        </Links>
        <Icons>
          <Icon src="../img/searchicon.png" alt="Search Icon" />
          <Button>Search Now</Button>
        </Icons>
      </Container>
    </Section>
  );
}

export default Navbar;
