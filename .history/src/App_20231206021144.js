import Install from './components/Install'
import Home from './components/Home'
import React, { useEffect, useRef } from 'react'

function App () {
  if (window.ethereum) {
    return <Home />
  } else {
    return <Install />
  }
}

export default App
