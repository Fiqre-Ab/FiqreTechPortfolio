 
 import Navbar  from './Navbar';
import styled from 'styled-components';
 
const Section = styled.div`

    height: 100vh;
    scroll-snap-align: center;
    display:flex;
    flex-direction:column
//     align-item:center;
//    justify-content:center
   
`
const Containers = styled.div`
  flex: 2; // Take up remaining space after navbar
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 90px; // Add some padding on the sides
`;
const Left = styled.div`
  flex: 2; // Half the space
  display: flex;
  flex-direction: column;
  justify-content: center; // Center vertically inside Left
  align-items: flex-start; // Align text to the start (left)
gap:5px
  `;
const Title = styled.h1`
 font-size:74px
    
`
const Whatido = styled.div`

 display:flex;
 align-items:center;

    
`

const Subtitle = styled.h2`
color:#da4ea2;
    
`
const Desc = styled.p`
 font-size:24px;
 color:lightgray;
    
`
const Button = styled.button`
background-color:#da4ea2;
color:white;
font-weight:500;
 width:160px;
 padding:10px;
 border:none;
 border-radius:6px;
 cursor: pointer;
    
`
const Right = styled.div`
  flex: 4; // Half the space
  display: flex;
  justify-content: center; // Center horizontally inside Right
  align-items: center; // Center vertically inside Right
`;

const Img=styled.img`
width:600px;
height:400px;
object-fit:contain;
position:absolute;
top:0;
bottom:0;
left:0;
right:0;
margin:auto;
position:relative;
animation:animate 2s infinite ease alternate;   
@keyframes animate{
    100%{
        transform:translateY(20px);

    }
}

`

function Home() {
    return (
    <Section>
      <Navbar/>
      <Containers>
        <Left>
          <Title>Hi, I'm Fiqre</Title>
          <Whatido>
            <Subtitle>What I Do</Subtitle>
          </Whatido>
          <Desc>
            Crafting Digital Experiences as a Full Stack Developer
          </Desc>
          <Button>Discover My Journey</Button>
        </Left>
        <Right>
          {/* Interactive Element: 3D Model or Animated Background */}
          <Img src="../img/space.png" alt="Innovative Space" />
        </Right>
      </Containers>
    </Section>
  );
}


export default Home
