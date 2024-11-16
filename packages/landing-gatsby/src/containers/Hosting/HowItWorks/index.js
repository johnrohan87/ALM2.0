import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Box from 'common/components/Box';
import Text from 'common/components/Text';
import Heading from 'common/components/Heading';
import Container from 'common/components/UI/Container';
import { HowItWorksWrapper, StepBox, StepNumber, StepContent } from './howItWorks.style.js';

const HowItWorksSection = ({
  sectionWrapper,
  secTitleWrapper,
  secHeading,
  secText,
  stepWrapper,
  stepNumberStyle,
  stepContentStyle,
}) => {
  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create an account to get started in seconds.'
    },
    {
      number: '2',
      title: 'Add Feeds',
      description: 'Import your favorite RSS feeds or use the search feature to discover new sources.'
    },
    {
      number: '3',
      title: 'Organize and Customize',
      description: 'Tag, filter, and personalize your feed categories to match your interests.'
    },
    {
      number: '4',
      title: 'Enjoy Your Content',
      description: 'Stay informed, save for later, and share content effortlessly.'
    }
  ];

  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...secTitleWrapper}>
          <Fade bottom cascade>
            <Text {...secText} content="HOW IT WORKS" />
            <Heading
              {...secHeading}
              content="How It Works"
            />
          </Fade>
        </Box>

        <HowItWorksWrapper>
          {steps.map((step, index) => (
            <StepBox {...stepWrapper} key={`step-${index}`}>
              <Fade bottom delay={index * 100}>
                <StepNumber {...stepNumberStyle}>{step.number}</StepNumber>
                <StepContent {...stepContentStyle}>
                  <Heading as="h4" content={step.title} />
                  <Text content={step.description} />
                </StepContent>
              </Fade>
            </StepBox>
          ))}
        </HowItWorksWrapper>
      </Container>
    </Box>
  );
};

HowItWorksSection.propTypes = {
  sectionWrapper: PropTypes.object,
  secTitleWrapper: PropTypes.object,
  secHeading: PropTypes.object,
  secText: PropTypes.object,
  stepWrapper: PropTypes.object,
  stepNumberStyle: PropTypes.object,
  stepContentStyle: PropTypes.object,
};

HowItWorksSection.defaultProps = {
  sectionWrapper: {
    as: 'section',
    pt: ['60px', '80px', '80px', '80px'],
    pb: ['60px', '80px', '80px', '80px'],
    id: 'how_it_works_section',
  },
  secTitleWrapper: {
    mb: ['50px', '60px'],
  },
  secText: {
    as: 'span',
    display: 'block',
    textAlign: 'center',
    fontSize: '14px',
    letterSpacing: '0.15em',
    fontWeight: '700',
    color: '#eb4d4b',
    mb: '10px',
  },
  secHeading: {
    textAlign: 'center',
    fontSize: ['24px', '28px'],
    fontWeight: '400',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: '0',
  },
  stepWrapper: {
    flexBox: true,
    flexDirection: 'column',
    alignItems: 'center',
    mb: '30px',
  },
  stepNumberStyle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#eb4d4b',
    mb: '15px',
  },
  stepContentStyle: {
    textAlign: 'center',
    h4: {
      fontSize: ['18px', '20px'],
      fontWeight: '500',
      color: '#0f2137',
      mb: '10px',
    },
    p: {
      fontSize: '15px',
      color: '#343d48cc',
      lineHeight: '1.75',
    },
  },
};

export default HowItWorksSection;