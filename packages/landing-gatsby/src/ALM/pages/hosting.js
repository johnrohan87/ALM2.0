import React from 'react';
import { ThemeProvider } from 'styled-components';
import Sticky from 'react-stickynode';
import { hostingTheme } from 'common/theme/hosting';
import { GlobalStyle, ContentWrapper } from 'containers/Hosting/hosting.style';
import { ResetCSS } from 'common/assets/css/style';
import Navbar from 'containers/Hosting/Navbar';
import FeatureSection from 'containers/Hosting/Features';
import BannerSection from 'containers/Hosting/Banner';
import ContactSection from 'containers/Hosting/Contact';
import Footer from 'containers/Hosting/Footer';
import { DrawerProvider } from 'common/contexts/DrawerContext';
import { ParallaxProvider } from 'react-scroll-parallax';
import Seo from 'components/seo';
import HowItWorksSection from 'containers/Hosting/HowItWorks';
import PricingSection from 'containers/Hosting/Pricing';
//import TestimonialSection from 'containers/Hosting/Testimonials';
import BenefitsSection from 'containers/Hosting/Benefits';

const Hosting = () => {
  return (
    <ThemeProvider theme={hostingTheme}>
      <ParallaxProvider>
        <Seo title="Affiliate Lead Marketing | Your website development company" />

        <ResetCSS />
        <GlobalStyle />

        <ContentWrapper>
          <Sticky top={0} innerZ={9999} activeClass="sticky-nav-active">
            <DrawerProvider>
              <Navbar />
            </DrawerProvider>
          </Sticky>

          <BannerSection />
          <FeatureSection />
          <HowItWorksSection />
          <BenefitsSection />
          {/*<TestimonialSection />*/}
          <PricingSection />
          <ContactSection />
          <Footer />
        </ContentWrapper>
      </ParallaxProvider>
    </ThemeProvider>
  );
};
export default Hosting;
