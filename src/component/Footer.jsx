
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

// Footer components
const FooterContainer = styled.div`
  background-color: #333;
  color: white;
  padding: 1rem; // Increased padding for bigger height
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 30px; // Increased gap for better spacing
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 30px; // Increased icon size
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1); // Scale icon on hover for a nice effect
  }

  & i {
    vertical-align: middle; // Align FontAwesome icons vertically
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <SocialIcons>
        <SocialIcon href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i> {/*  GitHub icon */}
        </SocialIcon>
        <SocialIcon href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i> {/*  Twitter icon */}
        </SocialIcon>
      
      </SocialIcons>
    </FooterContainer>
  );
}

export default Footer;
