import { useEffect, useState } from 'react'

const useGetWorkedApps = () => {
  const [workedAppsData, setWorkedAppsData] = useState([])

  useEffect(() => {
    const getWorkedApps = data =>
      setWorkedAppsData(data)

    window.socket.on('get-worked-apps', getWorkedApps)
    window.socket.emit('get-worked-apps')

    return () => window.socket.off('get-worked-apps', getWorkedApps)
  }, [])

  return workedAppsData
}

export default useGetWorkedApps
