import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import styled from 'styled-components'

import Header from './Header'
import AppCards from './AppCards'


window.socket = io(
  `http://localhost:6969?platform=store-channel`,
  {
    options: {
      reconnectionDelayMax: 10000
    }
  }
)

const App = () => {

  return (
    <div>
      <Header
        onSearch={value => ''}
        onMenu={value => ''}
        onAppsState={value => ''}
      />
      <AppCards />
    </div>
  )
}

export default App
