import React from 'react';
import logo from '../images/logo.png';

interface BrainLottieProps {
  size?: number;
}

const BrainLottie: React.FC<BrainLottieProps> = ({ size = 48 }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img 
        src={logo} 
        alt="Mindmodel"
        style={{
          width: '100%',
          height: '100%',
          filter: 'brightness(0) invert(1)',
          transition: 'transform 0.3s ease-in-out',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />
    </div>
  );
};

export default BrainLottie;