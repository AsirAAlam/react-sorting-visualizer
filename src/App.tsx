import React from 'react';
import './App.css';
import SortingBox from './components/SortingBox';

function App() {
  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <h1>React Sorting Algorithm Visualizer</h1>
      <div style={{margin: 50}}/>
      <SortingBox />
    </div>
  );
}

export default App;
