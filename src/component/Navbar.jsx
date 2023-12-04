 
 import styled from 'styled-components';

const Section = styled.div`

// height:100vh;
// scroll-snap-align:center;
display:flex;
// flex-direction:columns;
justify-content:center;

`
const Container = styled.div`
// height:100vh;
width:1400px;
display:flex;
justify-content:space-between;
padding:10px 0px;
// color:white;
`
const Icons = styled.div`
display:flex;
align-item:center;
gap:20px;

`
const Icon = styled.img`
width:50px;
height:30px;
cursor:pointer;


`
const Links = styled.div`
display:flex;
align-item:center;
gap:50px;
color:white;



`

const Logo = styled.img`
  // Styles for the logo
  width:90px;
  height:50px
 
`;

const List = styled.ul`
  list-style-type: none;
  display: flex;
  gap:20px;
  // Additional styles
`;

const ListItem = styled.li`
  // margin-right: 20px;
  cursor:pointer;
  // Additional styles
`;
const Button=styled.button`
width:100px;
height:30px;
padding:10px; 
background-color:#da43a2;
border-radius:5px;
color:white;
border:none;
  cursor:pointer;

`

function Navbar() {
  return (
   
      <Section>
      <Container> 
        <Links>
        <Logo src="../img/logo.png" alt="logo"/>
        <List>
          <ListItem>Home</ListItem>
             <ListItem>About</ListItem>
                <ListItem>Portfolio</ListItem>
                   <ListItem>Contact</ListItem>
                    <ListItem>Resume</ListItem>
        </List>
        </Links>
        <Icons>
          <Icon src="../img/searchicon.png"></Icon>
          <Button>Search Now</Button>
        </Icons>
        </Container>
      </Section>
  )
}

export default Navbar
