import React, {useState} from 'react';
import ProfileSelector from "./ProfileSelector";

function ScenarioSelector({
    submitCallback
}) {

    const [name, setName] = useState(null);
    const [employee, setEmployee] = useState({});
    const [desiredOutcome, setDesiredOutcome] = useState(null);
    const [context, setContext] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleOutcomeChange = (event) => {
        setDesiredOutcome(event.target.value);
    };

    const handleContextChange = (event) => {
        setContext(event.target.value);
    };

    return (
        <div className="scenarioSelector">
            <div className="scenarioSelectorItem">
                <div className="scenarioSelectorLabel">Scenario Name:</div>
                <input className="scenarioSelectorInput" onChange={handleNameChange} value={name}></input>
            </div>
            <div className="scenarioSelectorItem">
                <div className="scenarioSelectorLabel">Employee:</div>
                <ProfileSelector handleProfileSelection={(employee) => { setEmployee(employee); }} />
            </div>
            <div className="scenarioSelectorItem">
                <div className="scenarioSelectorLabel">Desired Outcome:</div>
                <input className="scenarioSelectorInput" onChange={handleOutcomeChange} value={desiredOutcome}></input>
            </div>
            <div className="scenarioSelectorItem">
                <div className="scenarioSelectorLabel">Context:</div>
                <textarea className="scenarioSelectorTextArea" onChange={handleContextChange} value={context}></textarea>
            </div>
            <div className="scenarioSaveButtonDiv">
                <button
                    className="scenarioSaveButton"
                    onClick={() => {
                        submitCallback({
                            name: name
                            , employee: employee
                            , desiredOutcome: desiredOutcome
                            , context: context
                        });
                    }}
                >
                    Create Scenario
                </button>
            </div>
        </div>

    );
}

export default ScenarioSelector;