import React, { useState, useEffect } from 'react'

import TreeDisplay from './TreeDisplay';

const sampleTree = {
    message: "Root",
    selected: true,
    children: []
};

function ScenarioDetailItem({
    label = undefined
    , contents = undefined
}) {
    return (
        <div className='scenarioDetailItem'>
            {label && contents &&
                <>
                    <div className='scenarioDetailItemHeader'>
                        {label}:
                    </div>
                    <div className='scenarioDetailItemContent'>
                        {contents}
                    </div>
                </>
            }
        </div>
    );
}

function ConversationView({
    scenario
}) {
    const [tree, setTree] = useState(sampleTree);
    const [scenarioDetails, setScenarioDetails] = useState({});

    const concatenateMessagesToRoot = (node) => {
        if (!node.parent) {
            return [node.message];
        } else {
            return concatenateMessagesToRoot(node.parent).concat([node.message]);
        }
    };

    useEffect(() => {
        console.log("SCENARIO UPDATED IN ConversationView");
        console.log(scenario);
    }, scenario)

    const retrieveScenarioContent = async (scenarioId) => {
        fetch('/get_scenario_content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario_id: scenario.scenario_id }),
        }).then(response => response.json())
            .then(scenario => {
                const new_scenario = JSON.parse(scenario.scenario)[0];
                setScenarioDetails(new_scenario);
            });
    }

    useEffect(() => {
        retrieveScenarioContent();
    }, [scenario])

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
            {scenario &&
                <div className='conversationName'>
                    {scenario.scenario_name}
                </div>
            }
            {scenarioDetails &&
                <>
                    <div className='scenarioDetails'>
                        <ScenarioDetailItem label='Scenario Name' contents={scenarioDetails.scenario_name} />
                        <ScenarioDetailItem label='Employee' contents={scenarioDetails.profile_name} />
                        <ScenarioDetailItem label='Desired Outcome' contents={scenarioDetails.desired_outcome} />
                        <ScenarioDetailItem label='Context' contents={scenarioDetails.context} />
                    </div>
                    <div className="tree">
                        <TreeDisplay
                            node={tree}
                            onAddChild={handleAddChild}
                            onDeleteNode={handleDeleteNode}
                        />
                    </div>
                </>
            }
        </div>
    );
}

export default ConversationView
