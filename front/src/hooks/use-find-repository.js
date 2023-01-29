import { useEffect, useState } from 'react'

const useFindRepository = (search) => {
  const [findRepository, setFindRepository] = useState(null)

  useEffect(() => {
    if (search.length > 5) {
      const timeId = setTimeout(() => {
        window.socket.emit('repository-find', search)
      }, 100)

      const handler = repository => setFindRepository(repository)

      window.socket.on('repository-find', handler)

      return () => {
        window.socket.off('repository-find', handler)
        clearTimeout(timeId)
      }
    }
  }, [search])

  return findRepository
}

export default useFindRepository
