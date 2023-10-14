import React, { useState } from 'react';

const ComponentButton = ({ defaultComponent, hoverComponent, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className='componentButton'
    >
      {isHovered ? hoverComponent : defaultComponent}
    </button>
  );
};

export default ComponentButton;