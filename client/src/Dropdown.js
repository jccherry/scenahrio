import React, { useState, useEffect } from 'react';

function Dropdown({
  defaultText = 'Select',
  itemList,
  callbackFunction,
  fieldName
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(defaultText);

  return (
    <div className='dropdown'>
      <button className='dropdownHeading dropdownButton' onClick={() => setIsOpen(!isOpen)}>
        {selectedLabel}
      </button>
      {isOpen && (
        <div className='dropdownItems'>
          {itemList.map((item, index) => (
            <button
              key={index} // Add a unique key here
              className='dropdownButton'
              onClick={() => {
                setSelectedLabel(item[fieldName]);
                callbackFunction(item);
                setIsOpen(false);
              }}
            >
              {item[fieldName]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
