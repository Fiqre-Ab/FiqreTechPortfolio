import  { useState } from 'react';
import styled from 'styled-components';

const Section = styled.div`
margin-top:20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto; /* Adjusted height to 100% of the viewport height */
`;

const FlipContainer = styled.div`
  width: 350px;
  height: 450px;
  perspective: 1000px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Flipper = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  border-radius: 20px;
  transform: ${props => (props.flipped ? 'rotateY(180deg)' : 'none')};
`;

const CardSide = styled.div`
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5em;
  cursor: pointer;
  background: rgba(14, 61, 88, 0.8); /* Semi-transparent background */
`;

const Front = styled(CardSide)`
  color: white;
  font-size: 1.5em;
  &:hover {
    background: rgba(14, 61, 88, 0.9); /* Slightly darker on hover */
  }
`;

const Back = styled(CardSide)`
  background: url('../img/contact.png') center/cover;
  transform: rotateY(180deg);
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75em;
  margin-bottom: 1em;
  border-radius: 10px;
  border: 1px solid #ccc;
  
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75em;
  margin-bottom: 1em;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: none;
`;

const SubmitButton = styled.button`
  margin-bottom: 5px;
  padding: 0.75em 2em;
  color: white;
  background-color: #e63946;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #a52834;
  }
`;
// Styled component for error messages
const ErrorMessage = styled.p`
  

  color: purple; /* bright yellow for contrast */
  background-color:red;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 1em;
  @media (max-width: 768px) { /* Adjust size for smaller screens */
    font-size: 80px;
  }
`;
const SuccessMessage = styled.p`
  color: white; /*  color for success message */
  font-weight:bold;
  margin-bottom: 1em;
`;

function Contact() {
  const [flipped, setFlipped] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  const toggleFlip = () => {
    setFlipped(!flipped);
    setErrorMessage(''); // Reset error message when flipping
    setSuccessMessage(''); // Reset success message when flipping
    setFormVisible(true); // Show the form again when flipping
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.message) {
      setErrorMessage('');
      setFormVisible(false); // Hide the form after submission
      setSuccessMessage('Thanks for the contact! I will keep in touch soon.');
    } else {
      setErrorMessage('Please fill out all fields');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Section>
      <FlipContainer>
        <Flipper flipped={flipped}>
          <Front onClick={toggleFlip}>Click to Contact!</Front>
          <Back>
            {formVisible ? (
              <StyledForm onSubmit={handleSubmit}>
                <StyledInput type="text" name="name" placeholder="Your Name" onChange={handleChange} />
                <StyledInput type="email" name="email" placeholder="Your Email" onChange={handleChange} />
                <StyledTextArea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  onChange={handleChange}
                />
                <SubmitButton type="submit">Send 🚀</SubmitButton>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              </StyledForm>
            ) : (
              <SuccessMessage>{successMessage}</SuccessMessage>
            )}
          </Back>
        </Flipper>
      </FlipContainer>
    </Section>
  );
}

export default Contact;
