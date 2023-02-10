import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Packery from 'packery'
import mainState from './../main-state'

import AppCard from './app-card'

const Body = styled.div`
  padding: 20px 16px 20px 36px;
  margin-bottom: 0px;
  overflow-y: scroll;
`

const AppCards = observer(({ appsData }) => {
  const ref = useRef()

  const pinApps = JSON.stringify(mainState.pinApps)
  const search = mainState.search

  useEffect(() => {
    const node = ref.current

    if (node) {
      const packery = new Packery(node, {
        itemSelector: '.grid-app',
        columnWidth: 180,
        gutter: 20,
        percentPosition: true
      })

      return () =>
        packery.destroy()
    }
  }, [ref, appsData.length, pinApps, search])

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
