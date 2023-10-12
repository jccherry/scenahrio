import React, { useState, useEffect } from "react";
import TreeDisplay from "./TreeDisplay";

const sampleTree = {
    message: "Root",
    children: [
        {
            message: "Node 1",
            children: [
                {
                    message: "Node 1.1",
                    children: [
                        {
                            message: "Node 1.1.1",
                            children: [
                                {
                                    message: "Node 1.1.1.1",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            message: "Node 2",
            children: [],
        },
        {
            message: "Node 3",
            children: [
                {
                    message: "Node 3.1",
                    children: [],
                },
                {
                    message: "Node 3.2",
                    children: [],
                },
            ],
        },
    ],
};


function Scenarios() {
    const [tree, setTree] = useState(sampleTree);

    const handleAddChild = (parentNode) => {

        console.log(tree);

        // Create a new child node
        const newChild = {
            message: `New Node ${Math.random()}`,
            render_children: true,
            selected: true,
            children: [],
        };

        // Find the parent node's level (assuming all nodes have a 'level' property)
        const parentLevel = parentNode.level;

        // Unselect children at the same level as the parent
        const unselectChildrenAtSameLevel = (node) => {
            if (node.level === parentLevel) {
                node.selected = false;
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(unselectChildrenAtSameLevel);
            }
        };

        // Apply the unselection to all other nodes at the same level
        unselectChildrenAtSameLevel(tree);

        // Add the new child to the parent's children
        parentNode.children.push(newChild);

        // Trigger re-render
        setTree({ ...tree });
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
        <>
            <div className="scenariosHeader">Scenarios</div>
            <div className="tree">
                <TreeDisplay
                    node={tree}
                    onAddChild={handleAddChild}
                    onDeleteNode={handleDeleteNode}
                />
            </div>
        </>
    );
}

export default Scenarios;