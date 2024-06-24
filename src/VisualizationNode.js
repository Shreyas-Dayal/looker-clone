import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VisualizationNode = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(250);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const labels = results.data.map((row) => row[Object.keys(row)[0]]);
        const values = results.data.map((row) => row[Object.keys(row)[1]]);
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Data from CSV',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.csv' });

  const handleResize = (event, { size }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  return (
    <div
      {...getRootProps()}
      style={{
        padding: 10,
        border: '1px solid black',
        borderRadius: '5px',
        background: '#fff',
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        resize: 'both',
        overflow: 'auto',
      }}
    >
      <input {...getInputProps()} />
      <Handle type="target" position={Position.Left} />
      <ResizableBox
        width={width}
        height={height}
        onResize={handleResize}
        minConstraints={[200, 200]}
        maxConstraints={[500, 500]}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {chartData ? (
          <Bar data={chartData} width={width - 20} height={height - 20} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>Drag & drop a .csv file here, or click to select one</p>
          </div>
        )}
      </ResizableBox>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default VisualizationNode;
