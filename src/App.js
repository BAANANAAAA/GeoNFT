import Install from './components/Install'
import Home from './components/Home'
import AccountInfo from './components/AccountInfo'
import './App.css'
import React, { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App () {
  if (window.ethereum) {
    return (<div className="background-container">
      <div className="bg-dark text-white p-1">
        <div className="header-content">
          <h1 className="NFTWord">GeoNFT!</h1>
          <div className='AccountInfo'> <AccountInfo /></div>
        </div>
      </div>
      <Home />
    </div>)
  } else {
    return <Install />
  }
}

export default App
