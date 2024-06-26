import React from 'react';//, { useContext }
import PropTypes from 'prop-types';
//import { useStaticQuery, graphql } from 'gatsby';
import NavbarWrapper from 'common/components/Navbar';
//import Drawer from 'common/components/Drawer';
//import Button from 'common/components/Button';
import Logo from 'common/components/UIElements/Logo';
import Box from 'common/components/Box';
//import HamburgMenu from 'common/components/HamburgMenu';
import Container from 'common/components/UI/Container';
//import { DrawerContext } from 'common/contexts/DrawerContext';
//import ScrollSpyMenu from 'common/components/ScrollSpyMenu';

import LogoImage from 'common/assets/image/ALM/logo.png';

const Navbar = ({ navbarStyle, logoStyle, button, row, menuWrapper }) => {
  //const { state, dispatch } = useContext(DrawerContext);

  // Toggle drawer
  /*const toggleHandler = () => {
    dispatch({
      type: 'TOGGLE',
    });
  };

  const Data = useStaticQuery(graphql`
    query {
      hostingJson {
        MENU_ITEMS {
          label
          path
          offset
        }
      }
    }
  `);*/

  return (
    <NavbarWrapper {...navbarStyle}>
      <Container>
        <Box {...row}>
          <Logo
            href="https://affiliateleadmarketing.com/"
            logoSrc={LogoImage}
            title="Agency"
            logoStyle={logoStyle}
          />
          <Box {...menuWrapper}>
            {/*<ScrollSpyMenu
              className="main_menu"
              menuItems={Data.hostingJson.MENU_ITEMS}
              offset={-70}
            />

            <a className="navbar_button" href="#1">
              <Button {...button} title="BUY NOW" />
            </a>
             
            <Drawer
              width="420px"
              placement="right"
              drawerHandler={<HamburgMenu barColor="#eb4d4b" />}
              open={state.isOpen}
              toggleHandler={toggleHandler}
            >
              <ScrollSpyMenu
                className="mobile_menu"
                menuItems={Data.hostingJson.MENU_ITEMS}
                drawerClose={true}
                offset={-100}
              />
              <a className="navbar_drawer_button" href="#1">
                <Button {...button} title="BUY NOW" />
              </a>
            </Drawer>
           */}
          </Box>
        </Box>
      </Container>
    </NavbarWrapper>
  );
};


Navbar.propTypes = {
  navbarStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  button: PropTypes.object,
  row: PropTypes.object,
  menuWrapper: PropTypes.object,
};

Navbar.defaultProps = {
  navbarStyle: {
    className: 'hosting_navbar',
    minHeight: '70px',
    display: 'block',
  },
  row: {
    flexBox: true,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoStyle: {
    maxWidth: ['120px', '130px'],
  },
  button: {
    type: 'button',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
    borderRadius: '4px',
    pl: '15px',
    pr: '15px',
    colors: 'primaryWithBg',
    minHeight: 'auto',
    height: `${1}`,
  },
  menuWrapper: {
    flexBox: true,
    alignItems: 'center',
  },
};

export default Navbar;
