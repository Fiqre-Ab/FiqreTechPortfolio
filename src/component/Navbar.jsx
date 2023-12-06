import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Main container
const Section = styled.div`
  display: flex;
  justify-content: center;
`;

// Container for the Navbar content
const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #da4ea2;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Icons container
const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

// Individual icon
const Icon = styled.img`
  width: 50px;
  height: 30px;
  cursor: pointer;
`;

// Navigation links container
const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Logo image
const Logo = styled.img`
  width: 190px;
  height: 80px;
  cursor: pointer;
`;

// List for navigation links
const List = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Individual list item
const ListItem = styled.li`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// Styled link
const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Button
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

// Hamburger menu icon for mobile view
const HamburgerIcon = styled.div`
  width: 30px;
  height: 20px;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  & span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: white;
  }
`;

// Mobile menu container
const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <Section>
      <Container>
        <Links>
          <Logo src="../img/logo.png" alt="logo" />
          <List>
            <StyledLink to="/"><ListItem>Home</ListItem></StyledLink>
            <StyledLink to="/about"><ListItem>About</ListItem></StyledLink>
            <StyledLink to="/portfolio"><ListItem>Portfolio</ListItem></StyledLink>
            <StyledLink to="/contact"><ListItem>Contact</ListItem></StyledLink>
            <StyledLink to="/resume"><ListItem>Resume</ListItem></StyledLink>
          </List>
        </Links>
        <Icons>
          <Icon src="../img/searchicon.png" alt="Search Icon" />
          <Button>Search Now</Button>
          {/* Hamburger menu icon */}
          <HamburgerIcon onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </HamburgerIcon>
        </Icons>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <MobileMenu>
            <StyledLink to="/"><ListItem onClick={toggleMenu}>Home</ListItem></StyledLink>
            <StyledLink to="/about"><ListItem onClick={toggleMenu}>About</ListItem></StyledLink>
            <StyledLink to="/portfolio"><ListItem onClick={toggleMenu}>Portfolio</ListItem></StyledLink>
            <StyledLink to="/contact"><ListItem onClick={toggleMenu}>Contact</ListItem></StyledLink>
            <StyledLink to="/resume"><ListItem onClick={toggleMenu}>Resume</ListItem></StyledLink>
          </MobileMenu>
        )}
      </Container>
    </Section>
  );
}

export default Navbar;
