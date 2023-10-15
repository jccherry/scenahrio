import React from 'react';
import ComponentButton from './ComponentButton';

const SidebarItem = ({ label, onClick, defaultSvg, hoverSvg }) => {
  return (
    <div className='sidebarItem'>
      <ComponentButton
        className='sidebarButton'
        defaultComponent={
          <div className='sidebarItemComponent'>
            <div className='sidebarItemIcon'>
              {defaultSvg}
            </div>
            <span className='sidebarItemLabel'>
              {label}
            </span>
          </div>
        }
        hoverComponent={
          <div className='sidebarItemComponentHovered'>
            <div className='sidebarItemIcon'>
              {hoverSvg}
            </div>
            <span className='sidebarItemLabel'>
              {label}
            </span>
          </div>
        }
        onClick={onClick}
      />
    </div>
  );
};

export default SidebarItem;