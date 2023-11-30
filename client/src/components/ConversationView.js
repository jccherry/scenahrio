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

    /*
    useEffect(() => {
        console.log("SCENARIO DETAILS UPDATED IN ConversationView");
        console.log(scenarioDetails);
    }, [scenarioDetails])
    */

    const uploadScenario = async () => {
        fetch('/update_scenario_content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: scenarioDetails }),
        })
        .then(response => response.json())
        .then(response => { console.log(response); });
    };

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
                //console.log("new_scenario: ");
                //console.log(new_scenario);
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

            //console.log(`RESPONSE:`);
            //console.log(response);
            // Find the specific node in details.contents and update its children
            const updatedContents = updateNodeChildren(details.contents, node, response);
    
            /*
            // Log the updated node and scenarioDetails (for debugging)
            console.log("NEW NODE:");
            console.log(node);
    
            console.log("SCENARIODETAILS.contents:");
            console.log(updatedContents);
            */

            // Update the state with the new contents object
            setScenarioDetails({ ...details, contents: updatedContents });
            uploadScenario();
        });
    }
    
    // Helper function to update children of a specific node in the tree
    function updateNodeChildren(currentNode, targetNode, newChildren) {
        /*
        console.log("UpdateNodeChildren:");
        console.log("Current Node:");
        console.log(currentNode);
        console.log("Target Node:");
        console.log(targetNode);
        */

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

    // specifically look for child nodes of the current node
    // and delete it (them) if they match exactly with what the targetNode
    // is
    function deleteTargetChildNode(currentNode, targetNode) {
        /*
        console.log("deleteTargetChildNode");
        console.log("Current Node:");
        console.log(currentNode);
        console.log("Target Node:");
        console.log(targetNode);
        console.log("Child Nodes:");
        console.log(currentNode.children);
        */

        // if the node has children, search through the children to delete
        if (currentNode.children && currentNode.children.length > 0) {
            for(var i = 0; i < currentNode.children.length; i++) {
                const child = currentNode.children[i];
                if (child.message === targetNode.message && child.user === targetNode.user) {
                    // If we found a match in the children, remove the
                    // child and return currentNode
                    currentNode.children.splice(i,1);
                    return currentNode;
                }
            }
            // If we haven't found a match among the children, apply the
            // function to all of the children
            return { ...currentNode, children: currentNode.children.map(achild => deleteTargetChildNode(achild, targetNode)) };
        } else {
            // else if there are no children, just return self
            return currentNode;
        }
    }

    return (
        <div className='conversationView'>
            {scenario &&
                <>
                    <div className='conversationName'>
                        {scenario.scenario_name}
                    </div>
                    {/*<button onClick={uploadScenario}>Upload Scenario</button>*/}
                </>
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
                            onDeleteNode={(node) => {
                                const updatedContents = deleteTargetChildNode(scenarioDetails.contents, node);
                                setScenarioDetails({ ...scenarioDetails, contents: updatedContents });
                                uploadScenario();
                            }}
                        />
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default ConversationView
