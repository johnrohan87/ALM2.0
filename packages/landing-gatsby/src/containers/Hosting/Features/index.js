import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Box from 'common/components/Box';
import Text from 'common/components/Text';
import Heading from 'common/components/Heading';
import Container from 'common/components/UI/Container';
import { FeatureItem } from '../hosting.style';

const FeatureSection = ({
  sectionWrapper,
  row,
  col,
  secTitleWrapper,
  secHeading,
  secText,
  featureItemHeading,
  featureItemDes,
}) => {
  const features = [
    {
      title: 'Multi-Device Syncing',
      description: 'Access your feeds on any device, be it desktop, tablet, or mobile, with automatic syncing.',
    },
    {
      title: 'Personalized Dashboard',
      description: 'Customize your dashboard layout and prioritize feeds, ensuring you see the most important updates first.',
    },
    {
      title: 'Real-Time Notifications',
      description: 'Get notified whenever a new story drops in your favorite feeds.',
    },
  ];

  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...secTitleWrapper}>
          <Fade bottom cascade>
            <Text {...secText} content="FEATURES OVERVIEW" />
            <Heading
              {...secHeading}
              content="Features Tailored for the Ultimate Content Experience"
            />
          </Fade>
        </Box>

        <Box {...row}>
          {features.map((feature, index) => (
            <Box {...col} key={`feature-${index}`}>
              <Fade bottom delay={index * 120}>
                <FeatureItem
                  title={
                    <Heading
                      {...featureItemHeading}
                      content={feature.title}
                    />
                  }
                  description={
                    <Text
                      {...featureItemDes}
                      content={feature.description}
                    />
                  }
                />
              </Fade>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

FeatureSection.propTypes = {
  sectionWrapper: PropTypes.object,
  secTitleWrapper: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  secHeading: PropTypes.object,
  secText: PropTypes.object,
  featureItemHeading: PropTypes.object,
  featureItemDes: PropTypes.object,
};

FeatureSection.defaultProps = {
  sectionWrapper: {
    as: 'section',
    pt: ['60px', '80px', '80px', '80px'],
    pb: ['60px', '80px', '80px', '80px'],
    id: 'feature_section',
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
    fontSize: ['20px', '24px'],
    fontWeight: '400',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: '0',
  },
  row: {
    flexBox: true,
    flexWrap: 'wrap',
    ml: '-15px',
    mr: '-15px',
  },
  col: {
    className: 'col',
    width: [1, 1 / 2, 1 / 3, 1 / 3],
    pr: '15px',
    pl: '15px',
    mb: '30px',
  },
  featureItemHeading: {
    fontSize: ['18px', '18px', '16px', '20px'],
    fontWeight: '400',
    color: '#0f2137',
    lineHeight: '1.5',
    mb: ['10px', '10px', '10px', '10px'],
    letterSpacing: '-0.020em',
    maxWidth: ['auto', 'auto', 'auto', '180px'],
  },
  featureItemDes: {
    fontSize: ['14px', '14px', '14px', '15px'],
    lineHeight: '1.75',
    color: '#343d48cc',
    mb: ['20px', '20px', '20px', '20px'],
  },
};

export default FeatureSection;