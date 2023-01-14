import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import styled from 'styled-components'

import Menu from './Menu'
import Header from './Header'
import AppCards from './AppCards'
import AppSearch from './AppSearch'

window.socket = io(
  `http://localhost:6969?platform=store-channel`,
  {
    options: {
      reconnectionDelayMax: 10000
    }
  }
)

const App = () => {
  const [isMenu, setMenu] = useState(false)
      , [search, setSearch] = useState('')

  return (
    <div>
      {
        isMenu
          ? (
            <Menu onClose={() => setMenu(false)} />
          )
          : (
            null
          )
      }
      <Header
        onSearch={value => setSearch(value)}
        onMenu={value => setMenu(value)}
        onAppsState={value => ''}
      />
      {
        search
          ? (
            <AppSearch search={search} />
          )
          : (
            <AppCards />
          )
      }
    </div>
  )
}

export default App
