import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Masonry from 'masonry-layout'
import AppCard from './AppCard'

const Body = styled.div`
  padding: 20px 16px 0px 36px;
  margin-bottom: 0px;
  overflow-y: scroll;
`

const AppCards = ({ app }) => {
  const ref = useRef()
  const [apps, setApps] = useState([])

  useEffect(() => {
    window.socket.on('get-apps', apps => {
      console.log(apps)
      setApps(apps)
    })

    window.socket.emit('get-apps')
  }, [])

  useEffect(() => {
    const node = ref.current

    if (node) {
      const msnry = new Masonry(node, {
        itemSelector: '.grid-app',
        columnWidth: 180,
        gutter: 20,
        percentPosition: true
      })

      return () => msnry.destroy()
    }
  }, [ref, apps])

  return (
    <Body ref={ref}>
      {
        apps.map((data, i) => {
          return (
            <AppCard data={data} key={JSON.stringify(data)} />
          )
        })
      }
    </Body>
  )
}

export default AppCards
