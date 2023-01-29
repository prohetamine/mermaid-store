import { useEffect, useState } from 'react'

const useGetApps = () => {
  const [appsData, setAppsData] = useState([])

  useEffect(() => {
    const getApps = data =>
      setAppsData(data)

    window.socket.on('get-apps', getApps)
    window.socket.emit('get-apps')

    return () => window.socket.off('get-apps', getApps)
  }, [])

  return appsData
}

export default useGetApps
