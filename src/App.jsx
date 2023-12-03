import './App.css'
import Home from "./component/Home"
import About from "./component/About"
import Works from "./component/Works"
import Contact from "./component/Contact"
import styled from 'styled-components';

const StyledContainer = styled.div`
  height: auto;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior:smooth;
  scrollbar-width: none; /* For Firefox */
`;

function App() {

  return (
    <StyledContainer>
  <Home/>
  <About/>
  <Works/>
  <Contact/>

    </StyledContainer>
  )
}

export default App
