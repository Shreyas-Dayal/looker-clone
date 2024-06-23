import React from 'react';
import ToolbarItem from './ToolbarItem'; // Import ToolbarItem component

const nodeTypes = [
  { type: 'resizableNodeSelected', label: 'Resizable Node' },
  { type: 'textFieldNode', label: 'Text Field Node' },
  { type: 'dataInputNode', label: 'Data Input Node' },
  { type: 'visualizationNode', label: 'Visualization Node' },
];

const Toolbar = () => {
  return (
    <div className="toolbar">
      {nodeTypes.map((node) => (
        <ToolbarItem key={node.type} nodeType={node.type} label={node.label} />
      ))}
    </div>
  );
};

export default Toolbar;
