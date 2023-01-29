import { useEffect, useState } from 'react'

const useAppInstallProgress = ({ app, repository }) => {
  const [progress, setProgress] = useState({
    err: '',
    ok: '',
    type: 0,
    progress: 0,
    view: false
  })

  useEffect(() => {
    const handleAppInstallProgress = ({ err, ok, type, progress, view, appData }) => {
      if (appData.app === app && appData.repository === repository) {
        setProgress({
          err,
          ok,
          type,
          progress,
          view
        })
      }
    }

    window.socket.on('app-install-progress', handleAppInstallProgress)
    return () => window.socket.off('app-install-progress', handleAppInstallProgress)
  }, [app, repository])

  return progress
}

export default useAppInstallProgress
