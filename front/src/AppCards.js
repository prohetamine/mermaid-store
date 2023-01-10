import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Masonry from 'masonry-layout'
import AppCard from './AppCard'

const Body = styled.div`
  padding: 20px 16px 0px 36px;
`

const AppCards = ({ app }) => {
  const ref = useRef()
  const [apps, setApps] = useState([])
  const [maxWidth, setMaxWidth] = useState(1000)

  const getApps = () => {
    axios.get('http://localhost:6969/api/getApps')
      .then(({ data }) => {
        setApps(data)
      })
  }

  useEffect(() => {
    getApps()

    const timeId = setInterval(() => {
      getApps()
    }, 30000)

    return () => clearInterval(timeId)
  }, [])

  useEffect(() => {
    const handle = () => {
      setMaxWidth(window.screen.availWidth - 251)
    }

    setMaxWidth(window.screen.availWidth - 251)

    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
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
  }, [Masonry, ref, apps])

  return (
    <Body ref={ref}>
      {
        apps.map((app, i) => {
          return (
            <AppCard app={app} key={JSON.stringify(app)} />
          )
        })
      }
    </Body>
  )
}

export default AppCards
