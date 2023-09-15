import React, { useEffect, useState } from 'react'

// EditItem component will have a label, a value, and a edit button
// when the edit button is pressed, the value changes to an input
// When the edit button is pressed again, the value changes back
function EditItem({label, value, onUpdateFunction, initialVisibility=false}) {
    const [isInputVisible, setInputVisible] = useState(initialVisibility);

    const handleButtonClick = () => {
        setInputVisible(!isInputVisible);
    };

    const handleInputChange = (event) => {
        onUpdateFunction(event.target.value);
    };

    return (
        <div>
            {isInputVisible ? (
                <div className="editItemDiv">
                    <span className="editItemLabel">{label}: </span>
                    <input
                        type="text"
                        value={value}
                        placeholder={`Enter ${label}`}
                        onChange={handleInputChange}
                        className="editItemInput"
                    />
                    <button onClick={handleButtonClick} className="editItemButton">Save</button>
                </div>
            ) : (
                <div className="editItemDiv">
                    <span className="editItemLabel">{label}: </span>
                    <span className="editItemValue">{value}</span>
                    <button onClick={handleButtonClick} className="editItemButton">Edit</button>
                </div>
            )}
        </div>
    );
}

export default EditItem;