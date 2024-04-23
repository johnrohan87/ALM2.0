import React from 'react';
//import {navigate} from 'gatsby'
import PropTypes from 'prop-types';
import Box from 'common/components/Box';
import Text from 'common/components/Text';
import Heading from 'common/components/Heading';
import Button from 'common/components/Button';
//import {ButtonStyle} from '../../../common/components/Button/button.style';
import Input from 'common/components/Input';
import Container from 'common/components/UI/Container';

import ContactFromWrapper from './contact.style';

const ContactSection = ({
  sectionWrapper,
  row,
  contactForm,
  secTitleWrapper,
  secHeading,
  secText,
  button,
  note,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log(event.currentTarget)
    const formData = new FormData(event.currentTarget);
  
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => alert("Thank you for your submission"))
      .catch((error) => alert(error));
  };
  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...secTitleWrapper}>
          <Text {...secText} content="CONTACT US" />
          <Heading
            {...secHeading}
            content="Send us your contact information here "
          />
        </Box>
        <Box {...row} >
          <Box {...contactForm}>
            <ContactFromWrapper>
              <form name="contact" data-netlify="true" onSubmit={handleSubmit} action="/">
              <Input
                inputType="email"
                placeholder="Email address"
                iconPosition="right"
                isMaterial={false}
                className="email_input"
                aria-label="email"
                name="email"
              />
              <Input
                inputType="message"
                placeholder="Your Message"
                iconPosition="right"
                isMaterial={false}
                className="email_input"
                aria-label="message"
                name="message"
              />
              
              <Button {...button} title="SEND MESSAGE" type="submit" />
              
              </form>
            </ContactFromWrapper>
            {/*<Text
              {...note}
              content="Note: Please call us at 12pm to 8am. otherwise our customer supporter will not  available to reach your call, but you can drop mail anytime."
            />*/}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

ContactSection.propTypes = {
  sectionWrapper: PropTypes.object,
  secTitleWrapper: PropTypes.object,
  row: PropTypes.object,
  contactForm: PropTypes.object,
  secHeading: PropTypes.object,
  secText: PropTypes.object,
  button: PropTypes.object,
  note: PropTypes.object,
};

ContactSection.defaultProps = {
  sectionWrapper: {
    id: 'contact_section',
    as: 'section',
    pt: ['0px', '10px', '20px', '80px'],
    pb: ['0px', '0px', '0px', '0px', '80px'],
    bg: '#f9fbfd',
  },
  secTitleWrapper: {
    mb: ['45px', '50px', '60px'],
  },
  secText: {
    as: 'span',
    display: 'block',
    textAlign: 'center',
    fontSize: `${2}`,
    letterSpacing: '0.15em',
    fontWeight: `${6}`,
    color: 'primary',
    mb: `${3}`,
  },
  secHeading: {
    textAlign: 'center',
    fontSize: [`${6}`, `${8}`],
    fontWeight: '400',
    color: 'headingColor',
    letterSpacing: '-0.025em',
    mb: `${0}`,
  },
  row: {
    flexBox: true,
    justifyContent: 'center',
  },
  contactForm: {
    width: [1, 1, 1, 1 / 2],
  },
  button: {
    type: 'button',
    fontSize: `${2}`,
    fontWeight: '600',
    borderRadius: '4px',
    pl: '22px',
    pr: '22px',
    colors: 'primaryWithBg',
    height: `${4}`,
  },
  note: {
    fontSize: ['13px', '14px', '15px', '15px', '15px'],
    color: '#5d646d',
    lineHeight: '1.87',
    textAlign: 'center',
  },
};

export default ContactSection;
