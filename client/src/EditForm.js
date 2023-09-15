import { useState } from "react";
import EditItem from "./EditItem";

function EditForm({
    header_text = "Form"
    , formAttributes
    , onSubmitFunction = (form) => { console.log(`Form submitted:`); console.log(form) }
    , footer = <div><hr></hr></div>
}) {

    const [formState, setFormState] = useState(
        formAttributes.reduce((acc, attributeName) => {
            acc[attributeName] = '';
            return acc;
        }, {})
    );

    const updateFormState = (attributeName, value) => {
        setFormState({
            ...formState
            , [attributeName]: value
            ,
        });
    }

    const header =
        <div>
            <span>{header_text}</span>
            <button onClick={() => onSubmitFunction(formState)}>Submit</button>
            <hr></hr>
        </div>

    return (
        <div className="editForm">
            <div className="editFormHeader">
                {header}
            </div>
            <div className="editFormItems">
                {formAttributes.map((attributeName) => (
                    <EditItem
                        label={attributeName}
                        value={formState[attributeName]}
                        onUpdateFunction={(value) => { updateFormState(attributeName, value) }}
                        initialVisibility={true}
                    />
                ))}
            </div>
            <div className="editFormFooter">
                {footer}
            </div>
        </div>
    );
}

export default EditForm;