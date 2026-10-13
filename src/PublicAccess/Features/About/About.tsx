import React from 'react';
import AboutOnlyText from './AboutOnlyText';
import AboutPictured from './AboutPictured';
import AboutSkeleton from './AboutSkeleton';
import type { IAbout } from '../../../types/about';

type AboutProps = {
  feature: IAbout;
  isLoading: boolean;
};

const About: React.FC<AboutProps> = ({ feature, isLoading }) => {
  if (isLoading) {
    return <AboutSkeleton />;
  }

  if (feature.imgShow) {
    return <AboutPictured feature={feature} isLoading={false} />;
  }

  return <AboutOnlyText feature={feature} />;
};

export default About;
