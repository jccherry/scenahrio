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
    const [scenarioDetails, setScenarioDetails] = useState(null);

    useEffect(() => {
        console.log("SCENARIO DETAILS UPDATED IN ConversationView");
        console.log(scenarioDetails);
    }, [scenarioDetails])

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
                console.log("new_scenario: ");
                console.log(new_scenario);
                setScenarioDetails(new_scenario);
            });
    }

    useEffect(() => {
        retrieveScenarioContent();
    }, [scenario])

    const concatenateMessagesToRoot = (node) => {
        if (!node.parent) {
            return [{user: node.user, message: node.message}];
        } else {
            return concatenateMessagesToRoot(node.parent).concat([{user: node.user, message: node.message}]);
        }
    };

    function onBranch(node) {
        const messages = concatenateMessagesToRoot(node);
    
        // Create shallow copies of the scenarioDetails object and its nested contents object
        const details = { ...scenarioDetails };
        details.contents = { ...details.contents };
        details.messages = messages;
    
        fetch('/send_messages_to_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ details }),
        })
        .then(response => response.json())
        .then(response => {

            console.log(`RESPONSE:`);
            console.log(response);
            // Find the specific node in details.contents and update its children
            const updatedContents = updateNodeChildren(details.contents, node, response);
    
            // Log the updated node and scenarioDetails (for debugging)
            console.log("NEW NODE:");
            console.log(node);
    
            console.log("SCENARIODETAILS.contents:");
            console.log(updatedContents);
    
            // Update the state with the new contents object
            setScenarioDetails({ ...details, contents: updatedContents });
        });
    }
    
    // Helper function to update children of a specific node in the tree
    function updateNodeChildren(currentNode, targetNode, newChildren) {

        console.log("UpdateNodeChildren:");
        console.log("Current Node:");
        console.log(currentNode);
        console.log("Target Node:");
        console.log(targetNode);

        if (currentNode.message === targetNode.message && currentNode.user === targetNode.user) {
            console.log("target node found");
            // If the current node is the target, update its children
            return { ...currentNode, children: [...(currentNode.children || []), ...newChildren] };
        } else if (currentNode.children && currentNode.children.length > 0) {
            console.log("target node not found, but updating children that I found");
            // Recursively update children if they exist
            return { ...currentNode, children: currentNode.children.map(child => updateNodeChildren(child, targetNode, newChildren)) };
        } else {
            // Return the current node unchanged if it's not the target and has no children
            console.log("target node not found and no children, returning");
            return currentNode;
        }
    }

    /*
    function onBranch(node) {
        const messages = concatenateMessagesToRoot(node);

        //problem:
        //scenarioDetails is state variable.

        //I am passing in node.  node is contained within state variable scenarioDetails

    
        // Create shallow copies of the scenarioDetails object and its nested contents object
        const details = { ...scenarioDetails };
        details.contents = { ...details.contents };
        details.messages = messages;
    
        fetch('/send_messages_to_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ details }),
        })
        .then(response => response.json())
        .then(response => {
            // Update the contents object with new children
            details.contents.children = [...(details.contents.children || []), ...response];    
            // Log the updated node and scenarioDetails (for debugging)
            console.log("NEW NODE:");
            console.log(node);
    
            console.log("SCENARIODETAILS.contents:");
            console.log(details.contents);
    
            // Update the state with the new details object
            setScenarioDetails(details);
        });
    }
    */
    
    /*
    function onBranch(node) {
        console.log("onBranch called!");
        const messages = concatenateMessagesToRoot(node);
        //const details = scenarioDetails;
        const details = { ...scenarioDetails };
        details.messages = messages;

        fetch('/send_messages_to_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ details: details}),
        }).then(response => response.json())
            .then(response => {
                console.log("add_nodes_to_tree API response:")
                console.log(response);
                // Now that we have the response, we can add children to
                // the given node that was passed into the onBranch function
                if (!node.children) {
                    node.children = [];
                }
                for (var i = 0; i < response.length; i++) {
                    node.children.push(response[i]);
                }
                console.log("NEW NODE:");
                console.log(node);

                console.log("SCENARIODETAILS.contents:")
                console.log(scenarioDetails.contents)

                setScenarioDetails(scenarioDetails);
            });
    }
    */

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
                    {scenarioDetails &&
                        <div className='messageTree'>
                        <TreeDisplay
                            node={scenarioDetails.contents}
                            profileName={scenarioDetails.profile_name}
                            onAddChild={(node) => {onBranch(node)}}
                            onDeleteNode={(node) => {console.log("delete child button"); console.log(node)}}
                        />
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default ConversationView
