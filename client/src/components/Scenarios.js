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


const sampleTree = {
    message: "Root",
    selected: true,
    children: []
};

function ScenarioListItem({
    scenario
}) {
    const [expanded, setExpanded] = useState(false);

    const editScenario = async () => {
        console.log('Edit Scenario Async');
        fetch('/edit_scenario_settings', {
            method: 'POST'
            , headers : {
                'Content-Type' : 'application/json'
            }
            , body: JSON.stringify({ scenario: scenario }),
        }).then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(err => console.error(err));
    }

    return (
        <div className="scenarioCell">
            <div className="scenarioCellHeader">
                <div className="scenarioCellName">{scenario.scenario_name}</div>
                <div className="buttonContainer">
                    {expanded ?
                        <>
                            <ComponentButton
                                defaultComponent={<TrashIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledTrashIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    setExpanded(false);
                                    console.log("TRASHED"); 
                                    console.log(scenario);
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<CheckIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledCheckIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("EDITED");
                                    setExpanded(!expanded); 
                                    console.log(scenario);
                                    editScenario();
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<SendIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledSendIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("SENT");
                                    setExpanded(!expanded);
                                    console.log(scenario);
                                }}
                            />
                        </>
                        :
                        <>
                            <ComponentButton
                                defaultComponent={<PencilIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledPencilIcon className='hoveredSvgButton' />}
                                onClick={() => { 
                                    setExpanded(!expanded)
                                    console.log("EDITING");
                                    console.log(scenario);
                                }}
                            />
                            <ComponentButton
                                defaultComponent={<SendIcon className='defaultSvgButton' />}
                                hoverComponent={<FilledSendIcon className='hoveredSvgButton' />}
                                onClick={() => {
                                    console.log("SENT");
                                    setExpanded(!expanded);
                                    console.log(scenario);
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
    const [tree, setTree] = useState(sampleTree);
    const [scenarios, setScenarios] = useState([]);

    const concatenateMessagesToRoot = (node) => {
        if (!node.parent) {
            return [node.message];
        } else {
            return concatenateMessagesToRoot(node.parent).concat([node.message]);
        }
    };

    const fetchScenarios = async () => {
        fetch('/get_scenarios', {
            method: 'GET'
            , headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(scenarios => {
                console.log("AVAVAVVAVAVVAVVAV")
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

    const handleAddChild = (parentNode) => {
        const messages = concatenateMessagesToRoot(parentNode);

        const createNewChild = (message) => {
            // Create a new child node
            const newChild = {
                message: message,
                selected: true,
                children: [],
                parent: parentNode
            };

            // Add the new child to the parent's children
            parentNode.children.push(newChild);
        }

        fetch('/add_nodes_to_tree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: messages }),
        }).then(response => response.json())
            .then(response => {
                response.messages.map((message) => {
                    createNewChild(message);
                });
                setTree({ ...tree });
            });
        // Next steps, get the single scenario to store in database
        // Then expand on that scenario's capability
        // Ie, assign a user to it, get messages alternating, then finally
        // integrate the GPT API
    };

    const handleDeleteNode = (nodeToDelete) => {
        const removeNode = (nodes, node) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i] === node) {
                    nodes.splice(i, 1);
                    return;
                }
                if (nodes[i].children) {
                    removeNode(nodes[i].children, node);
                }
            }
        };

        removeNode(tree.children, nodeToDelete);
        setTree({ ...tree }); // Trigger re-render
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const uploadScenario = async (scenario) => {
        console.log('Scenario upload async');
        fetch('/create_scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario: scenario }),
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            });
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
            {scenarios != [] &&
                <div className="scenariosList">
                    {
                        scenarios.map((scenario, index) => (
                            <ScenarioListItem scenario={scenario} />
                        ))
                    }
                </div>
            }
            <div className="tree">
                <TreeDisplay
                    node={tree}
                    onAddChild={handleAddChild}
                    onDeleteNode={handleDeleteNode}
                />
            </div>
        </div>
    );
}

export default Scenarios;