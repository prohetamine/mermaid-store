import { useEffect, useState } from 'react'

const useAppState = ({ app, repository }) => {
  const [isPlay, setPlay] = useState(null)

  useEffect(() => {
    const appState = ({ appData, state }) => {
      console.log({ appData, state })
      if (appData.app === app && appData.repository === repository) {
        setPlay(state.isPlay)
      }
    }

    const intervalId = setInterval(() => {
      window.socket.emit('app-state', { app, repository })
    }, 1000)

    window.socket.on('app-state', appState)
    return () => {
      clearInterval(intervalId)
      window.socket.off('app-state', appState)
    }
  }, [app, repository])

  return isPlay
}

export default useAppState
