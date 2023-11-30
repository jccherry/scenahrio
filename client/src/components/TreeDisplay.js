// TreeDisplay.js

import React, { useState } from "react";

import ComponentButton from "./ComponentButton";

import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as FilledTrashIcon } from '../assets/icons/trash-fill.svg';
import { ReactComponent as BranchIcon } from '../assets/icons/option.svg';
import { ReactComponent as PencilIcon } from '../assets/icons/pencil.svg'
import { ReactComponent as FilledPencilIcon } from '../assets/icons/pencil-fill.svg'

function TreeDisplay({ node, profileName, onAddChild, onDeleteNode, onEditNode }) {

    const [isEditing, setIsEditing] = useState(false);
    const [inputText, setInputText] = useState(node.message);
    const [name, setName] = useState(node.user);

    const editButtonClicked = (node) => {
        console.log("Edit Button Pressed!");
        console.log("Target Node: ");
        console.log(node);

        console.log("To Change: Name:");
        console.log(name);

        console.log("new Message: ");
        console.log(inputText);

        if (isEditing) {
            const replacementInstructions = {
                oldNode: node
                , newNode: {user: name, message: inputText}
            };
            onEditNode(replacementInstructions);
        }

        setIsEditing(!isEditing);
        // use the onEditMessageHandler to pass this to the callback
        // in the callback, you should change the underlying
        // node data.  this should flow through to the top level.x
    };

    const onMessageChangeHandler = (event) => {
        setInputText(event.target.value);
    }

    const onNameChangeHandler = (event) => {
        console.log(`new Name change event: ${event.target.value}`);
        setName(event.target.value);
    }

    return (
        <div className="tree_node">
            <div className="tree_node_header">
                <div className="tree_node_content">
                    { !isEditing ?
                    <>
                        <div className="tree_node_name">
                            {node.user}
                        </div>
                        <div className="tree_node_message">
                            {node.message}
                        </div>
                    </>
                    :
                    <>
                        <div className="tree_node_name">
                            <select onChange={onNameChangeHandler}>
                                <option key={0} value={"HR"}>HR</option>
                                <option key={1} value={profileName}>{profileName}</option>
                            </select>
                        </div>
                        <div className="tree_node_message">
                            <input 
                                type="text"
                                value={inputText}
                                placeholder={"Message"}
                                onChange={onMessageChangeHandler}
                            />
                        </div>
                    </>
                    }
                </div>
                <div className="tree_node_button_container">
                    <ComponentButton 
                        className='componentButton'
                        defaultComponent={<PencilIcon />}
                        hoverComponent={<FilledPencilIcon />}
                        onClick={() => editButtonClicked(node)}
                    />
                    <ComponentButton 
                        className='componentButton'
                        defaultComponent={<BranchIcon />}
                        hoverComponent={<BranchIcon />}
                        onClick={() => onAddChild(node)}
                    />
                    <ComponentButton 
                        className='componentButton'
                        defaultComponent={<TrashIcon />}
                        hoverComponent={<FilledTrashIcon />}
                        onClick={() => onDeleteNode(node)}
                    />
                </div>
            </div>
            {node.children && node.children.length > 0 && (
                <>
                    {node.children.map((child, index) => {
                        return (
                            <TreeDisplay
                                node={child}
                                onAddChild={onAddChild}
                                onDeleteNode={onDeleteNode}
                                profileName={profileName}
                                onEditNode={(replacementInstructions) => {
                                    onEditNode(replacementInstructions);
                                }}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default TreeDisplay;
