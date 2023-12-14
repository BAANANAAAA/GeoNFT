import Install from './components/Install'
import Home from './components/Home'
import React, { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'

function App () {
  const parallaxContainerRef = useRef(null)

  useEffect(() => {
    const parallaxContainer = document.createElement('div')
    parallaxContainer.className = 'parallax-container'
    parallaxContainerRef.current = parallaxContainer

    parallaxContainer.style.top = '0'
    parallaxContainer.style.left = '0'
    parallaxContainer.style.width = '100%'
    parallaxContainer.style.height = '100%'
    parallaxContainer.style.zIndex = '-1'

    for (let i = 1; i <= 3; i++) {
      const layer = document.createElement('div')
      layer.setAttribute('data-depth', '0.' + i)
      layer.textContent = 'Layer ' + i
      parallaxContainer.appendChild(layer)
    }

    document.body.appendChild(parallaxContainer)

    // const parallax = new Parallax(parallaxContainer, {
    //   scalarX: 10,
    //   scalarY: 15,
    //   frictionX: 0.1,
    //   frictionY: 0.1,
    // })

    if (!window.ethereum) {
      parallaxInstanceRef.current = new Parallax(parallaxContainer, {
        scalarX: 10,
        scalarY: 15,
        frictionX: 0.1,
        frictionY: 0.1,
      })
    }

    return () => {
      parallax.destroy()
      document.body.removeChild(parallaxContainer)
    }
  }, [])

  if (window.ethereum) {
    return <Home />
  } else {
    return <Install />
  }
}

export default App
