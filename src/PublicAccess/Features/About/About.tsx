import React from 'react';
import AboutOnlyText from './AboutOnlyText';
import AboutPictured from './AboutPictured';
import type { IAbout } from '../../../types/about';

type AboutProps = {
  feature: IAbout;
  isLoading: boolean;
};

const About: React.FC<AboutProps> = ({ feature, isLoading }) => {
  if (feature?.imgShow) {
    return <AboutPictured feature={feature} isLoading={isLoading} />;
  }

  return <AboutOnlyText feature={feature} />;
};

export default About;
