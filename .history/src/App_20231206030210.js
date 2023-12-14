import Install from './components/Install'
import Home from './components/Home'
import './App.css'
import React, { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App () {
  if (window.ethereum) {
    return (<div className="background-container">
      <div className="bg-dark text-white p-1">
        <h1 className="NFTWord">AbstractNFT!</h1>
      </div>
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
