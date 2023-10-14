import React, { useState, useEffect } from "react";
import TreeDisplay from "./TreeDisplay";
import ScenarioSelector from "./ScenarioSelector";
import Modal from "./Modal";

import plus_button from '../assets/images/plus_button.png';

const sampleTree = {
    message: "Root",
    selected: true,
    children: []
};

function Scenarios() {
    const [tree, setTree] = useState(sampleTree);

    const concatenateMessagesToRoot = (node) => {
        if (!node.parent) {
            return [node.message];
        } else {
            return concatenateMessagesToRoot(node.parent).concat([node.message]);
        }
    };

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
                <button className='addProfileButton' onClick={() => {openModal();}}>
                    <img src={plus_button} style={{height: '50%'}}></img>
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} displayCloseButton={false}>
                <ScenarioSelector submitCallback={(scenario) => {closeModal(); uploadScenario(scenario);}}/>
            </Modal>
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