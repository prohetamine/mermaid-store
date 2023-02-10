import { useEffect, useState } from 'react'

const useAppsState = () => {
  const [state, setState] = useState({})

  useEffect(() => {
    const appState = ({ appData, state }) => {
      setState(
        s => ({
          ...s,
          [`${appData.repository}/${appData.app}`]: { isPlay: state.isPlay, date: (new Date() - 0) + 5000 }
        })
      )
    }

    window.socket.on('app-state', appState)
  }, [])

  return Object
            .keys(state)
            .filter(key => state[key].date > new Date() - 0)
            .find(key => state[key].isPlay === false) === undefined
              ? true
              : false
}

export default useAppsState
