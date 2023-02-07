import { useEffect, useState } from 'react'

const useAppConnectionState = ({ app, repository }) => {
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    const appConnectionState = ({ appData, isConnected }) => {
      if (appData.app === app && appData.repository === repository) {
        setConnected(isConnected)
      }
    }

    window.socket.on('app-connection-state', appConnectionState)

    const intervalId = setInterval(() => {
      window.socket.emit('app-connection-state', { repository, app })
    }, 5000)

    const timeId = setTimeout(() => {
      window.socket.emit('app-connection-state', { repository, app })
    }, 250)

    return () => {
      clearTimeout(timeId)
      clearInterval(intervalId)
      window.socket.off('app-connection-state', appConnectionState)
    }
  }, [app, repository])

  return isConnected
}

export default useAppConnectionState
