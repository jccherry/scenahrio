import React, { useState } from 'react'

function DictForm({
    header = null
    , formDict
    , footer = null
    , updateFunction
}) {

    const [editItems, setEditItems] = useState(formDict);

    return (
        <div className="editForm">
            {header &&
                <div className="editFormHeader">
                    {header}
                </div>
            }
            <div className="editFormItems">
                {Object.entries(editItems).map(([key, value]) => (
                    <div key={key} className="editItemDiv">
                        <span className="editItemLabel">{key}: </span>
                        <input
                            type="text"
                            value={editItems[key]}
                            placeholder={`Enter ${key}`}
                            onChange={(event) => {
                                const updatedFormDict = { ...editItems };
                                updatedFormDict[key] = event.target.value;
                                setEditItems(updatedFormDict);
                                updateFunction(updatedFormDict);
                            }}
                            className="editItemInput"
                        />
                    </div>
                ))}
            </div>
            {footer &&
                <div className="editFormFooter">
                    {footer}
                </div>
            }
        </div>
    );
}

export default DictForm
