import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Box from 'common/components/Box';
import Text from 'common/components/Text';
import Heading from 'common/components/Heading';
import Container from 'common/components/UI/Container';
import { BenefitsWrapper, BenefitItem } from './benefits.style';

const BenefitsSection = ({
  sectionWrapper,
  secTitleWrapper,
  secHeading,
  secText,
  benefitItemWrapper,
  benefitItemHeading,
  benefitItemText,
}) => {
  const benefits = [
    {
      title: 'Stay Organized',
      description: 'Never miss an important update again.'
    },
    {
      title: 'Reduce Overwhelm',
      description: 'Cut through the clutter and focus only on what matters.'
    },
    {
      title: 'Save Time',
      description: 'Spend less time browsing and more time reading.'
    },
    {
      title: 'Privacy Focused',
      description: 'We respect your privacy. No data tracking or selling.'
    }
  ];

  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...secTitleWrapper}>
          <Fade bottom cascade>
            <Text {...secText} content="BENEFITS" />
            <Heading
              {...secHeading}
              content="Why You'll Love It"
            />
          </Fade>
        </Box>

        <BenefitsWrapper>
          {benefits.map((benefit, index) => (
            <BenefitItem {...benefitItemWrapper} key={`benefit-${index}`}>
              <Fade bottom delay={index * 100}>
                <Heading as="h4" {...benefitItemHeading} content={benefit.title} />
                <Text {...benefitItemText} content={benefit.description} />
              </Fade>
            </BenefitItem>
          ))}
        </BenefitsWrapper>
      </Container>
    </Box>
  );
};

BenefitsSection.propTypes = {
  sectionWrapper: PropTypes.object,
  secTitleWrapper: PropTypes.object,
  secHeading: PropTypes.object,
  secText: PropTypes.object,
  benefitItemWrapper: PropTypes.object,
  benefitItemHeading: PropTypes.object,
  benefitItemText: PropTypes.object,
};

BenefitsSection.defaultProps = {
  sectionWrapper: {
    as: 'section',
    pt: ['60px', '80px', '80px', '80px'],
    pb: ['60px', '80px', '80px', '80px'],
    id: 'benefits_section',
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
  benefitItemWrapper: {
    flexBox: true,
    flexDirection: 'column',
    alignItems: 'center',
    mb: '30px',
  },
  benefitItemHeading: {
    fontSize: ['18px', '20px'],
    fontWeight: '500',
    color: '#0f2137',
    mb: '10px',
  },
  benefitItemText: {
    fontSize: '15px',
    color: '#343d48cc',
    lineHeight: '1.75',
    textAlign: 'center',
  },
};

export default BenefitsSection;