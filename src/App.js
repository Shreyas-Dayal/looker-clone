import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import FlowChart from './FlowChart';
import Toolbar from './Toolbar';  // Import the Toolbar component

const initialElements = [
  { id: '1', type: 'resizableNodeSelected', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', type: 'resizableNodeSelected', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', type: 'resizableNodeSelected', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', type: 'textFieldNode', data: { label: 'Text Field Node' }, position: { x: 200, y: 200 } },
  { id: '5', type: 'dataInputNode', data: { label: 'Data Input Node' }, position: { x: 200, y: 300 } },
  { id: '6', type: 'visualizationNode', data: { label: 'Visualization Node' }, position: { x: 200, y: 400 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

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
        <div className="main-layout">
          <div className="canvas-section">
            <FlowChart
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              selectedNodes={selectedNodes}
              setSelectedNodes={setSelectedNodes}
            />
          </div>
          <div className="toolbar-section">
            <Toolbar />
            <div className="controls">
              <button onClick={saveDiagram}>Save Diagram</button>
              <button onClick={loadDiagram}>Load Diagram</button>
              <button onClick={clearDiagram}>Clear Diagram</button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
