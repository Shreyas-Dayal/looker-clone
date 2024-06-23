import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'reactflow/dist/style.css';
import './App.css';
import ResizableNodeSelected from './ResizableNodeSelected';
import TextFieldNode from './TextFieldNode';
import DataInputNode from './DataInputNode';
import VisualizationNode from './VisualizationNode';
import Toolbar from './Toolbar';  // Import the Toolbar component

const initialElements = [
  { id: '1', type: 'ResizableNodeSelected', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', type: 'ResizableNodeSelected', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', type: 'ResizableNodeSelected', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', type: 'TextFieldNode', data: { label: 'Text Field Node' }, position: { x: 200, y: 200 } },
  { id: '5', type: 'DataInputNode', data: { label: 'Data Input Node' }, position: { x: 200, y: 300 } },
  { id: '6', type: 'VisualizationNode', data: { label: 'Visualization Node' }, position: { x: 200, y: 400 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const nodeTypes = {
  ResizableNodeSelected,
  TextFieldNode,
  DataInputNode,
  VisualizationNode,
};

const FlowChart = ({ nodes, setNodes, edges, setEdges, selectedNodes, setSelectedNodes }) => {
  const [selectionBox, setSelectionBox] = useState(null);
  const selectionBoxRef = useRef(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const onElementsRemove = (elementsToRemove) => {
    setNodes((nds) => nds.filter((node) => !elementsToRemove.find((e) => e.id === node.id)));
    setEdges((eds) => eds.filter((edge) => !elementsToRemove.find((e) => e.id === edge.id)));
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'node',
    drop: (item, monitor) => {
      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
      const position = monitor.getClientOffset();
      const newNode = {
        id: `${Math.random()}`,
        type: item.nodeType,
        position: {
          x: position.x - reactFlowBounds.left,
          y: position.y - reactFlowBounds.top,
        },
        data: {
          label: `${item.nodeType} node`,
          text: '',
          onChange: (newText) => {
            setNodes((nds) =>
              nds.map((node) => (node.id === newNode.id ? { ...node, data: { ...node.data, text: newText } } : node))
            );
          },
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Shift') {
      setIsShiftPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    if (event.key === 'Shift') {
      setIsShiftPressed(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleMouseDown = (event) => {
    if (isShiftPressed) return; // Disable custom selection when Shift is pressed

    const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
    const startX = event.clientX - reactFlowBounds.left;
    const startY = event.clientY - reactFlowBounds.top;
    setSelectionBox({ x: startX, y: startY, width: 0, height: 0 });
  };

  const handleMouseMove = (event) => {
    if (!selectionBox) return;

    const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
    const currentX = event.clientX - reactFlowBounds.left;
    const currentY = event.clientY - reactFlowBounds.top;
    const width = currentX - selectionBox.x;
    const height = currentY - selectionBox.y;

    setSelectionBox((prevBox) => ({ ...prevBox, width, height }));
  };

  const handleMouseUp = () => {
    if (!selectionBox) return;

    const selectedNodeIds = nodes
      .filter((node) => {
        const nodeBounds = {
          x: node.position.x,
          y: node.position.y,
          width: node.width || 150,
          height: node.height || 100,
        };
        const box = {
          x: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
          y: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
          width: Math.abs(selectionBox.width),
          height: Math.abs(selectionBox.height),
        };
        return (
          nodeBounds.x < box.x + box.width &&
          nodeBounds.x + nodeBounds.width > box.x &&
          nodeBounds.y < box.y + box.height &&
          nodeBounds.y + nodeBounds.height > box.y
        );
      })
      .map((node) => node.id);

    setSelectedNodes(selectedNodeIds);
    setSelectionBox(null);
  };

  return (
    <div
      ref={drop}
      style={{ height: 500, flex: 1 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
        deleteKeyCode={46} /* 'delete'-key */
        nodeTypes={nodeTypes}
        fitView
        selectionOnDrag={false} // Disable built-in selection
        multiSelectionKeyCode={null} // Disable built-in multi-selection with Shift
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
      </ReactFlow>
      {selectionBox && (
        <div
          ref={selectionBoxRef}
          style={{
            position: 'absolute',
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
            border: '1px dashed blue',
            backgroundColor: 'rgba(173, 216, 230, 0.5)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

function App() {
  const [nodes, setNodes] = useState(initialElements.filter((el) => !el.source && !el.target));
  const [edges, setEdges] = useState(initialElements.filter((el) => el.source && el.target));
  const [selectedNodes, setSelectedNodes] = useState([]);

  useEffect(() => {
    const savedNodes = JSON.parse(localStorage.getItem('nodes'));
    const savedEdges = JSON.parse(localStorage.getItem('edges'));

    if (savedNodes) setNodes(savedNodes);
    if (savedEdges) setEdges(savedEdges);
  }, []);

  const saveDiagram = () => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
    localStorage.setItem('edges', JSON.stringify(edges));
  };

  const loadDiagram = () => {
    const savedNodes = JSON.parse(localStorage.getItem('nodes'));
    const savedEdges = JSON.parse(localStorage.getItem('edges'));

    if (savedNodes) setNodes(savedNodes);
    if (savedEdges) setEdges(savedEdges);
  };

  const clearDiagram = () => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem('nodes');
    localStorage.removeItem('edges');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>React Flow Diagram</h1>
        <div className="content">
          <FlowChart
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
          />
          <Toolbar />
        </div>
        <div className="controls">
          <button onClick={saveDiagram}>Save Diagram</button>
          <button onClick={loadDiagram}>Load Diagram</button>
          <button onClick={clearDiagram}>Clear Diagram</button>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
