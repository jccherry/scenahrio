import React, {useState, useEffect} from 'react'

function ObjectDropdown({
    objectList,
    displayKey,
    onUpdateFunction,
    defaultText = 'Select',
}) {
    const onOptionChangeHandler = (event) => {
        if (event.target.value !== -1) {
            onUpdateFunction(objectList[event.target.value]);
        } else {
            onUpdateFunction(null);
        }
    };

    return (
        <select 
            onChange = {onOptionChangeHandler}
        >
            <option value={-1}>{defaultText}</option>
            {objectList &&
                (objectList.map((object, index) => (
                <option key={index} value={index}>
                    {object[displayKey]}
                </option>)
            ))}
        </select>
    );
}

export default ObjectDropdown
