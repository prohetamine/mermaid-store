import { useEffect, useState } from 'react'

const useCheckAppInstalled = ({ app, repository }) => {
  const [isAppInstalled, setAppInstalled] = useState(false)

  useEffect(() => {
    const handleCheckAppInstalled = ({ isInstalled, appData }) => {
      if (appData.app === app && appData.repository === repository) {
        setAppInstalled(isInstalled)
      }
    }

    window.socket.on('check-app-installed', handleCheckAppInstalled)

    const timeId = setTimeout(() => {
      window.socket.emit('check-app-installed', { repository, app })
    }, 100)

    const intervalId = setInterval(() => {
      window.socket.emit('check-app-installed', { repository, app })
    }, 5000)

    return () => {
      clearTimeout(timeId)
      clearInterval(intervalId)
      window.socket.off('check-app-installed', handleCheckAppInstalled)
    }
  }, [app, repository])

  return isAppInstalled
}

export default useCheckAppInstalled
