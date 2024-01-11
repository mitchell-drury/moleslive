import { useState, useEffect } from 'react';
import './index.css';

export default function App() {

  function handleSearch(e) {
    console.log(e.target.value);
  }
  return (
    <div className="App">
      <div id="tool-bar">
        <input id="search" type="text" placeholder="search" onChange={handleSearch} />
      </div>
    </div>
  );
}