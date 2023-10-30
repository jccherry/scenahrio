// TreeDisplay.js

import React from "react";

import ComponentButton from "./ComponentButton";

import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as FilledTrashIcon } from '../assets/icons/trash-fill.svg';
import { ReactComponent as BranchIcon } from '../assets/icons/option.svg';

function TreeDisplay({ node, onAddChild, onDeleteNode }) {
    return (
        <div className="tree_node">
            <div className="tree_node_header">
                <div className="tree_node_content">
                    <div className="tree_node_name">
                        {node.user}
                    </div>
                    <div className="tree_node_message">
                        {node.message}
                    </div>
                </div>
                <div className="tree_node_button_container">
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
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default TreeDisplay;
