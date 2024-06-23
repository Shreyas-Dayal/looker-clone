import React from 'react';
import { useDrag } from 'react-dnd';

const nodeTypes = [
  { type: 'ResizableNodeSelected', label: 'Resizable Node' },
  { type: 'TextFieldNode', label: 'Text Field Node' },
  { type: 'DataInputNode', label: 'Data Input Node' },
  { type: 'VisualizationNode', label: 'Visualization Node' },
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

const ToolbarItem = ({ nodeType, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { nodeType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="toolbar-item">
      {label}
    </div>
  );
};

export default Toolbar;
