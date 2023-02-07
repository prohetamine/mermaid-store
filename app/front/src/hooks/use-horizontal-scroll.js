import { useEffect, useRef } from 'react'

const useHorizontalScroll = () => {
  const nodeRef = useRef()

  useEffect(() => {
    const node = nodeRef.current
    if (node) {
      const onWheel = event => {
        if (event.deltaY === 0) {
          return
        }

        event.preventDefault()
        
        node.scrollTo({
          left: node.scrollLeft + event.deltaY
        })
      }

      node.addEventListener('wheel', onWheel)
      return () => node.removeEventListener('wheel', onWheel)
    }
  }, []);

  return nodeRef;
}

export default useHorizontalScroll
