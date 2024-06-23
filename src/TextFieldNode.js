import React, { memo } from 'react';
import { Handle, useStore, Position, useReactFlow, NodeResizer } from 'reactflow';

const dimensionAttrs = ['width', 'height'];

const TextFieldNode = memo(({ id, selected, data }) => {
  const { setNodes } = useReactFlow();
  const dimensions = useStore((s) => {
    const node = s.nodeInternals.get(id);
    if (!node || !node.width || !node.height) {
      return null;
    }
    return {
      width: node.width,
      height: node.height,
    };
  });

  const updateDimension = (attr) => (event) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            style: {
              ...n.style,
              [attr]: parseInt(event.target.value, 10),
            },
          };
        }
        return n;
      }),
    );
  };

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
      {dimensionAttrs.map((attr) => (
        <div key={attr}>
          <label>node {attr}</label>
          <input
            type="number"
            value={dimensions ? parseInt(dimensions[attr], 10) : 0}
            onChange={updateDimension(attr)}
            className="nodrag"
            disabled={!dimensions}
          />
        </div>
      ))}
      {!dimensionAttrs && 'no node connected'}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export default TextFieldNode;
