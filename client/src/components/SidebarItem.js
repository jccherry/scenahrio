import React from 'react';

const SidebarItem = ({ label, onClick }) => {
  return (
    <div className='sidebarItem'>
      <button className='sidebarButton' onClick={onClick}>
        {label}
      </button>
    </div>
  );
};

export default SidebarItem;