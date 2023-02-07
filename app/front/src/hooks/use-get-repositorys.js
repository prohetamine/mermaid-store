import { useEffect, useState } from 'react'

const useGetRepositorys = () => {
  const [repositorys, setRepositorysData] = useState([])

  useEffect(() => {
    const getRepositorys = data =>
      setRepositorysData(data)

    window.socket.on('get-repositorys', getRepositorys)
    window.socket.emit('get-repositorys')
    
    return () => window.socket.off('get-repositorys', getRepositorys)
  }, [])

  return repositorys
}

export default useGetRepositorys
