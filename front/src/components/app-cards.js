import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Masonry from 'masonry-layout'
import mainState from './../main-state'

import AppCard from './app-card'

const Body = styled.div`
  padding: 0px 16px 0px 36px;
  margin-bottom: 0px;
  overflow-y: scroll;
`

const AppCards = observer(({ appsData }) => {
  const ref = useRef()

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
  }, [ref, appsData.length, JSON.stringify(mainState.pinApps)])

  return (
    <Body ref={ref}>
      {
        appsData
          .sort(
            (a, b) =>
              (mainState.pinApps[`${b.repository}/${b.app}`] || 0)
                -
              (mainState.pinApps[`${a.repository}/${a.app}`] || 0)
          )
          .map(
            appData => (
              <AppCard appData={appData} key={JSON.stringify(appData)} />
            )
          )
      }
    </Body>
  )
})

export default AppCards
