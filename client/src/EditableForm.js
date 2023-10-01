import { useState, useEffect } from "react";
import EditableItem from "./EditableItem";

// Takes in a dictionary and generates a editable form
function EditableForm({
    header = <></>
    , formDict
    , footer = <></>
    , initialVisibility = false
    , saveFunction
}) {

    const [formState, setFormState] = useState(formDict);

    const updateFormState = (attributeName, value) => {
        console.log('Update Form State Run');
        console.log(`key: ${attributeName} value: ${value}`)
        setFormState({
            ...formState
            , [attributeName]: value
            ,
        });
    }

    // Use useEffect to trigger saveFunction when formState changes
    useEffect(() => {
        console.log('New Form State:');
        console.log(formState);
        saveFunction(formState);
    }, [formState]); // Only run this effect when formState changes

    return (
        <div className="editForm">
            <div className="editFormHeader">
                {header}
            </div>
            <div className="editFormItems">
                {Object.entries(formState).map(([key, value]) => (
                    <EditableItem
                        label={key}
                        value={formState[key]}
                        onSaveFunction={(value) => updateFormState(key, value)}
                        initialVisibility={false}
                    />
                ))}
            </div>
            <div className="editFormFooter">
                {footer}
            </div>
        </div>
    );
}

export default EditableForm;