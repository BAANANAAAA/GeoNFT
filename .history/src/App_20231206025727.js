import Install from './components/Install'
import Home from './components/Home'
import './App.css'
import React, { useEffect, useRef } from 'react'

function App () {
  if (window.ethereum) {
    return (<div className="background-container">
      <div className="overlay-container">
        <div className="content-container">
          <Home />
        </div>
      </div>
    </div>)
  } else {
    return <Install />
  }
}

export default App
