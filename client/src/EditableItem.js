import React, { useEffect, useState } from 'react'

// EditItem component will have a label, a value, and a edit button
// when the edit button is pressed, the value changes to an input
// When the edit button is pressed again, the value changes back
function EditItem({label, value, onSaveFunction, initialVisibility=false, autosave = false}) {
    const [isInputVisible, setInputVisible] = useState(initialVisibility);
    const [editInputValue, setEditInputValue] = useState(value);

    const handleCancelButton = () => {
        console.log("Cancel Button Pressed");
        setInputVisible(!isInputVisible);
        setEditInputValue(value);
    };

    const handleSaveButton = () => {
        console.log("Save Button Pressed");
        console.log(`edit Input Value: ${editInputValue}`)
        onSaveFunction(editInputValue);
        setInputVisible(!isInputVisible);
    };

    const handleEditButton = () => {
        console.log("Edit Button Pressed");
        setInputVisible(!isInputVisible);
    };

    const handleInputChange = (event) => {
        //onUpdateFunction(event.target.value);
        setEditInputValue(event.target.value);
        if (autosave) {
            onSaveFunction(event.target.value);
        }
    };

    return (
        <div>
            {isInputVisible ? (
                <div className="editItemDiv">
                    <span className="editItemLabel">{label}: </span>
                    <input
                        type="text"
                        value={editInputValue}
                        placeholder={`Enter ${label}`}
                        onChange={handleInputChange}
                        className="editItemInput"
                    />
                    {autosave ? <></> :
                        <div className='editItemButtonContainer'>
                        <button onClick={handleSaveButton} className="editItemButton">Save</button>
                        <button onClick={handleCancelButton} className="editItemButton">Cancel</button>
                    </div>
                    }
                </div>
            ) : (
                <div className="editItemDiv">
                    <span className="editItemLabel">{label}: </span>
                    <span className="editItemValue">{value}</span>
                    <div className='editItemButtonContainer'>
                        <button onClick={handleEditButton} className="editItemButton">Edit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditItem;