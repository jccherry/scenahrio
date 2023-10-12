// TreeDisplay.js

import React from "react";

function TreeDisplay({ node, onAddChild, onDeleteNode }) {
    return (
        <div className="tree_node">
            <div className="tree_node_header">
                {node.message}
                <div className="tree_node_button_container">
                    <button onClick={() => onAddChild(node)}>Add Child</button>
                    <button onClick={() => onDeleteNode(node)}>Delete Node</button>
                </div>
            </div>
            {node.children && node.children.length > 0 && (
                <div style={{ marginLeft: "20px" }}>
                    {node.children.map((child, index) => {
                        return (
                            <TreeDisplay
                                key={index}
                                node={child}
                                onAddChild={onAddChild}
                                onDeleteNode={onDeleteNode}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TreeDisplay;
