import './App.css';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  scroll-snap-type: y mandatory;
  background: url("../img/bg.png");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;

  /* Smooth scrolling behavior */
  scroll-behavior: smooth;

  /* Hide default scrollbar for Webkit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 8px; /* Set the width of the scrollbar */
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #da4ea2; /* Set the color of the scrollbar handle */
    border-radius: 4px; /* Round the corners of the scrollbar handle */
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent; /* Set the color of the scrollbar track */
  }
`;
const Content = styled.div`
  flex: 1; // Allows content to grow and push the footer down
`;

function App() {
  return (
    <StyledContainer>
      <Navbar />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </StyledContainer>
  );
}

export default App;
