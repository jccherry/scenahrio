import React, { useState, useEffect } from 'react'

import TreeDisplay from './TreeDisplay';

const sampleTree = {
    message: "Root",
    selected: true,
    children: []
};

function ConversationView({
    scenario_id
}) {
    const [tree, setTree] = useState(sampleTree);
    const [scenario, setScenario] = useState({});

    const concatenateMessagesToRoot = (node) => {
        if (!node.parent) {
            return [node.message];
        } else {
            return concatenateMessagesToRoot(node.parent).concat([node.message]);
        }
    };

    const retrieveScenarioContent = async (scenarioId) => {
        fetch('/get_scenario_content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario_id: scenario_id }),
        }).then(response => response.json())
            .then(scenario => {
                console.log(scenario);
                setScenario(scenario.scenario);
            });
    }

    useEffect(() => {
        retrieveScenarioContent();
    }, [])

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

    return (
        <div className='conversationView'>
            {scenario.scenario_name}
            <div className="tree">
                <TreeDisplay
                    node={tree}
                    onAddChild={handleAddChild}
                    onDeleteNode={handleDeleteNode}
                />
            </div>
        </div>
    )
}

export default ConversationView
