import { useEffect, useState } from 'react'

const useWindowButtonVisibility = () => {
  const [ipcRenderer, setIpcRenderer] = useState(null)
      , [isVisibility, setVisibility] = useState(true)

  useEffect(() => {
    try {
      const { ipcRenderer } = window.require('electron')
      setIpcRenderer(ipcRenderer)
    } catch (e) {}
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', (event) => {
      setVisibility(window.scrollY < 10)
    })
  }, [])

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.send('setWindowButtonVisibility', isVisibility)
    }
  }, [isVisibility, ipcRenderer])
}

export default useWindowButtonVisibility
