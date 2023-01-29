import { useEffect, useState } from 'react'

const useAppState = ({ app, repository }) => {
  const [isPlay, setPlay] = useState(false)

  useEffect(() => {
    const appState = ({ appData, state }) => {
      if (appData.app === app && appData.repository === repository) {
        setPlay(state.isPlay)
      }
    }

    window.socket.on('app-state', appState)
    return () => window.socket.off('app-state', appState)
  }, [app, repository])

  return isPlay
}

export default useAppState
