import React from 'react';

const SidebarItem = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default SidebarItem;