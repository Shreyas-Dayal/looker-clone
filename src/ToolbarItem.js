import React from 'react';
import { useDrag } from 'react-dnd';

const ToolbarItem = ({ nodeType, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { nodeType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="toolbar-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {label}
    </div>
  );
};

export default ToolbarItem;
