
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Global style for the section
const Section = styled.section`
   color: #fff;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
   height: auto;
  
`;

// Styled container to center the content and apply grid, responsive for mobile
const ResumeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Styled column for each proficiency list
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styled heading for each proficiency list with responsive font size
const ResumeHeading = styled.h2`
  font-size: 1.75rem;
  color: #007bff;
  margin-bottom: 1rem;
  text-align: left;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Styled list without default list styling
const ResumeList = styled.ul`
  list-style: none;
  padding: 0;
`;

// Styled list item with motion for animation and hover effect
const ListItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

// Dot to serve as a custom bullet point with animation
const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #007bff;
  margin-right: 1rem;
`;

// Animation variants for list items
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Skill data for front-end and back-end proficiencies
// Skill data for front-end and back-end proficiencies
const frontEndSkills = [
  'HTML', 
  'CSS', 
  'JavaScript', 
  'React', 
  'Tailwind CSS', 
  'SASS',
  'Bootstrap',
  'jQuery',
  'AJAX',
  'Fetch',
  'JSON',
  'Developer Tools (Elements, Console, Network, Sources, Application, etc)',
  'Web API', 
  'Day.js',
  'indexDB',
  'PWA', 
  'Webpack',
  'React Hooks',
  'JSX',
  'Context API',
  'Redux'
];

const backEndSkills = [
  'Node.js', 
  'Express.js', 
  'MongoDB', 
  'MySQL', 
  'SQL', 
  'Java',
  'Server Side API',
  'Insomnia / Postman',
  'Rest API',
  'Serverside Templating (Handlebars.js)',
  'Heroku',
  'Express Sessions',
  'bcrypt',
  'JWT Javascript Web Token',
  'Relational Databases',
  'Sequelize ORM',
  'Non-Relational Databases',
  'Mongoose ODM',
  'Apollo GraphQL',
  'MERN Stack',
  'Stripe API'
];

// Additional skills relevant to both front-end and back-end
const generalSkills = [
  'Problem-Solving',
  'Pseudocode',
  'Git',
  'GitHub',
  'Command Line',
  'Object-oriented Programming (OOP)',
  'Imperative Programming',
  'Declarative Programming',
  'TDD',
  'Unit Testing w/ JEST',
  'Data Structures and Algorithms',
  'Full Stack Development',
  'Performance'
];

// Main resume component
const Resume = () => {
  return (
    <Section>
      <h1 style={{ color: '#007bff', marginBottom: '2rem', fontSize: '2.5rem' }}>Resume</h1>
      <ResumeContainer>
        <Column>
          <ResumeHeading>Front-end Proficiencies</ResumeHeading>
          <ResumeList>
            {frontEndSkills.map((skill, i) => (
              <ListItem
                key={skill}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Dot />
                {skill}
              </ListItem>
            ))}
          </ResumeList>
        </Column>
        <Column>
          <ResumeHeading>Back-end Proficiencies</ResumeHeading>
          <ResumeList>
            {backEndSkills.map((skill, i) => (
              <ListItem
                key={skill}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Dot />
                {skill}
              </ListItem>
            ))}
          </ResumeList>
        </Column>
        <Column>
         <ResumeHeading>General Skills</ResumeHeading>
          <ResumeList>
            {generalSkills.map(skill => (
              <ListItem
                key={skill}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Dot />
                {skill}
              </ListItem>
            ))}
          </ResumeList>
        </Column>
      </ResumeContainer>
    </Section>
  );
};

export default Resume;