import React, { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from 'reactflow';

const VisualizationNode = memo(({ id, selected, data }) => {
  const { setNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  return (
    <div
      style={{
        border: '2px solid black',
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
      <div style={{ marginTop: '10px' }}>Visualization content here</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export default VisualizationNode;
