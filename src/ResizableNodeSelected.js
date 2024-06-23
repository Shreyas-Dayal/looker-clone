import React, { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from 'reactflow';

const ResizableNodeSelected = memo(({ id, selected, data }) => {
  const { setNodes } = useReactFlow();
  const { setSelectedNodes } = data; // Extract setSelectedNodes from data

  const handleDelete = (event) => {
    event.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const handleClick = (event) => {
    event.stopPropagation();
    if (typeof setSelectedNodes === 'function') {
      setSelectedNodes((prevSelected) => {
        if (event.ctrlKey || event.metaKey) { // Handle Ctrl/Cmd key for multi-selection
          if (prevSelected.includes(id)) {
            return prevSelected.filter((nodeId) => nodeId !== id);
          } else {
            return [...prevSelected, id];
          }
        } else {
          return [id];
        }
      });
    } else {
      console.error('setSelectedNodes is not a function');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: selected ? '2px solid blue' : '2px solid black',
        borderRadius: '5px',
        padding: '10px',
        position: 'relative',
        background: '#fff',
        width: data.width || 150,
        height: data.height || 100,
      }}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
        onResize={(event, { width, height }) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      width,
                      height,
                    },
                  }
                : node
            )
          );
        }}
      />
      <button onClick={handleDelete} style={{ position: 'absolute', top: 0, right: 0 }}>
        X
      </button>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export default ResizableNodeSelected;
