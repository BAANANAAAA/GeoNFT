import Install from './components/Install'
import Home from './components/Home'
import React, { useState, useEffect, useRef } from 'react'
import Parallax from 'parallax-js'

function App () {
  useEffect(() => {
    // 在组件加载后创建 Parallax 实例
    const parallaxContainer = document.createElement('div')
    parallaxContainer.className = 'parallax-container'

    for (let i = 1; i <= 3; i++) {
      const layer = document.createElement('div')
      layer.setAttribute('data-depth', '0.' + i)
      layer.textContent = 'Layer ' + i
      parallaxContainer.appendChild(layer)
    }

    document.body.appendChild(parallaxContainer)

    const parallax = new Parallax('.parallax-container', {
      scalarX: 10,
      scalarY: 15,
      frictionX: 0.1,
      frictionY: 0.1,
    })

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
