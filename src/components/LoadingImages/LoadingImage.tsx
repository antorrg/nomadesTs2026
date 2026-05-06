import React from 'react';
import './loadingImage.css';
import { useTheme } from '../../hooks/useTheme';

interface LoadingImageProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LoadingImage({ className = '', style }: LoadingImageProps) {
  const { appliedTheme } = useTheme();
  const imgSrc = appliedTheme === 'dark' ? '/baseImage.jpg' : '/base1.jpg';

  return (
    <div className={`loading-image ${className}`} style={style}>
      <img src={imgSrc} alt="Cargando imagen" />
      <div className="loading-bars" />
    </div>
  );
}