import React from 'react';
import {navigate} from 'gatsby'
import PropTypes from 'prop-types';
import Box from 'common/components/Box';
import Text from 'common/components/Text';
import Heading from 'common/components/Heading';
import Button from 'common/components/Button';
import Container from 'common/components/UI/Container';
import ParticlesComponent from '../../Hosting/Particle';
import BannerWrapper from './banner.style';

const BannerSection = ({ row, title, description, button, textArea }) => {
  return (
    <BannerWrapper id="banner_section">
      <ParticlesComponent />
      <Container className="banner_container">
        <Box {...row}>
          <Box {...textArea}>
            <Heading
              {...title}
              content="Stay Updated with All Your Favorite Feeds in One Place!"
            />
            <Text
              {...description}
              content="The ultimate tool for managing, organizing, and personalizing your news, blogs, and content feeds."
            />
            <Box mt="20px" textAlign="center">
              <Button
                {...button}
                title="Get Started for Free"
                onClick={() => {
                  navigate("/account")
                }}
              />
              <Button
                {...button}
                title="Explore Features"
                ml="15px"
                onClick={() => {
                  // Navigate to features section or relevant action
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </BannerWrapper>
  );
};

BannerSection.propTypes = {
  row: PropTypes.object,
  col: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  searchArea: PropTypes.object,
};

BannerSection.defaultProps = {
  row: {
    flexBox: true,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    width: ['100%', '100%', '90%', '100%', '55%'],
  },
  title: {
    fontSize: ['26px', '32px', '42px', '46px', '55px'],
    fontWeight: '400',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: ['20px', '25px', '25px', '25px', '25px'],
    lineHeight: '1.31',
    textAlign: 'center',
  },
  description: {
    fontSize: ['15px', '16px', '16px', '16px', '16px'],
    color: '#343d48cc',
    lineHeight: '1.75',
    mb: '0',
    textAlign: 'center',
  },
  button: {
    type: 'button',
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
    pl: '22px',
    pr: '22px',
    colors: 'primaryWithBg',
  },
};

export default BannerSection;