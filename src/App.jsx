import './App.css';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';

const StyledContainer = styled.div`
  display: flex; // Set display to flex
  flex-direction: column; // Align children vertically
  min-height: 100vh; // Minimum height of the entire viewport
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* For Firefox */
  background: url("../img/bg.png");
  background-attachment: fixed; /* Keep the background fixed in place */
  background-size: cover; /* Cover the entire viewport */
  background-repeat: no-repeat;
  color: white;
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
