import React, { useState, useEffect } from "react";
import TreeDisplay from "./TreeDisplay";
import ScenarioSelector from "./ScenarioSelector";
import Modal from "./Modal";
import ComponentButton from "./ComponentButton";

import plus_button from '../assets/images/plus_button.png';
import { ReactComponent as PencilIcon } from '../assets/icons/pencil.svg';
import { ReactComponent as FilledPencilIcon } from '../assets/icons/pencil-fill.svg';
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as FilledTrashIcon } from '../assets/icons/trash-fill.svg';
import { ReactComponent as CheckIcon } from '../assets/icons/check-square.svg';
import { ReactComponent as FilledCheckIcon } from '../assets/icons/check-square-fill.svg';
import { ReactComponent as SendIcon } from '../assets/icons/send.svg';
import { ReactComponent as FilledSendIcon } from '../assets/icons/send-fill.svg';
import EditableForm from "./EditableForm";
import SlidingComponent from "./SlidingComponent";
import ConversationView from "./ConversationView";

function ScenarioListItem({
    scenario
    , sendCallback
    , deleteCallback
}) {
    const [expanded, setExpanded] = useState(false);

    const editScenario = async () => {
        console.log('Edit Scenario Async');
        fetch('/edit_scenario_settings', {
            method: 'POST'
            , headers: {
                'Content-Type': 'application/json'
            }
            , body: JSON.stringify({ scenario: scenario }),
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            })
            .catch(err => console.error(err));
    }

    const deleteScenario = async () => {
        console.log('Delete Scenario Async');
        fetch('/delete_scenario', {
            method: 'POST'
            , headers: {
                'Content-Type': 'application/json'
            }
            , body: JSON.stringify({ scenario_id: scenario.scenario_id })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            }).then(() => { deleteCallback(); })
    }

    return (
        <div className="scenarioCell">
            <div className="scenarioCellHeader">
                <div className="scenarioCellName">{scenario.scenario_name}</div>
                <div className="scenarioProfileName">{scenario.profile_name}</div>
                <div className="buttonContainer">
                    {expanded ?
                        <>
                            <ComponentButton
                                defaultComponent={<TrashIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledTrashIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    setExpanded(false);
                                    deleteScenario();
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<CheckIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledCheckIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("EDITED");
                                    setExpanded(false);
                                    console.log(scenario);
                                    editScenario();
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<SendIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledSendIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("SENDING");
                                    setExpanded(false);
                                    sendCallback();
                                }}
                            />
                        </>
                        :
                        <>
                            <ComponentButton
                                defaultComponent={<PencilIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledPencilIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    setExpanded(true);
                                    console.log("EDITING");
                                    console.log(scenario);
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<SendIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledSendIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("SENDING");
                                    sendCallback();
                                }}
                            />
                        </>
                    }
                </div>
            </div>
            {expanded &&
                <div className="scenarioCellExpanded">
                    <EditableForm
                        formDict={{
                            'Name': scenario.scenario_name
                            , 'Desired Outcome': scenario.desired_outcome
                            , 'Context': scenario.context
                        }}
                        saveFunction={(updatedDict) => {
                            scenario.scenario_name = updatedDict['Name']
                            scenario.desired_outcome = updatedDict['Desired Outcome']
                            scenario.context = updatedDict['Context']
                        }}
                        initialVisibility={true}
                        autosave={true}
                    />
                </div>
            }
        </div>
    );
}

function Scenarios() {
    const [scenarios, setScenarios] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [sliderScenario, setSliderScenario] = useState(null);

    const fetchScenarios = async () => {
        await fetch('/get_scenarios', {
            method: 'GET'
            , headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(scenarios => {
                console.log(scenarios);
                setScenarios(scenarios);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchScenarios();
    }, [])

    useEffect(() => {
        console.log('Scenarios Updated:');
        console.log('Scenarios:');
        console.log(scenarios);
    }, [scenarios])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const uploadScenario = async (scenario) => {
        console.log('Scenario upload');
        fetch('/create_scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario: scenario }),
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            }).then(() => { fetchScenarios(); });
    };

    return (
        <div className="scenariosPage">
            <div className="scenariosHeader">
                <h1 className="scenariosHeading">Scenarios</h1>
                <button className='addProfileButton' onClick={() => { openModal(); }}>
                    <img src={plus_button} style={{ height: '50%' }}></img>
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} displayCloseButton={false}>
                <ScenarioSelector submitCallback={(scenario) => { closeModal(); uploadScenario(scenario); }} />
            </Modal>
            <SlidingComponent
                content={
                    <ConversationView scenario={sliderScenario} />
                }
                isVisible={isSliderOpen}
                buttonCallback={() => setIsSliderOpen(false)}
            />
            {scenarios != [] &&
                <div className="scenariosList">
                    {
                        scenarios.map((scenario, index) => (
                            <ScenarioListItem
                                scenario={scenario}
                                sendCallback={() => {
                                    console.log("SENDCALLBACK!!");
                                    console.log(scenario);
                                    setSliderScenario(scenario);
                                    setIsSliderOpen(true);
                                }}
                                deleteCallback={() => {
                                    fetchScenarios();
                                }}
                            />
                        ))
                    }
                </div>
            }
        </div>
    );
}

export default Scenarios;