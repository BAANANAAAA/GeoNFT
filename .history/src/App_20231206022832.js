import Install from './components/Install'
import Home from './components/Home'
import './App.css'
import React, { useEffect, useRef } from 'react'

function App () {
  if (window.ethereum) {
    return (<div>
      <div style="width:100%;height:0;padding-bottom:127%;position:relative;"><iframe src="https://giphy.com/embed/Swytr5ngUDfDwtXKOz" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/trippy-psychedelic-universe-Swytr5ngUDfDwtXKOz">via GIPHY</a></p>
      <Home />
    </div>)
  } else {
    return <Install />
  }
}

export default App
