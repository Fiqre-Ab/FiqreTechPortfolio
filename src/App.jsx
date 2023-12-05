import './App.css'
import Home from "./component/Home"
import About from "./component/About"
import Works from "./component/Works"
import Contact from "./component/Contact"
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from './component/Navbar'
const StyledContainer = styled.div`
  height: auto;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior:smooth;
  scrollbar-width: none; /* For Firefox */
  background: url("../img/bg.png");
  background-attachment: fixed; /* Keep the background fixed in place */
  background-size: cover; /* Cover the entire viewport */
  background-repeat: no-repeat;
  color:white;
`;
function App() {
  return (
    <StyledContainer>
      <Navbar/>
      <Outlet/>
    </StyledContainer>
  );
}

export default App
