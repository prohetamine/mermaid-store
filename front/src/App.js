import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { observer } from 'mobx-react-lite'
import queryString from 'query-string'

import mainState from './main-state'

import useGetApps from './hooks/use-get-apps'
import useGetWorkedApps from './hooks/use-get-worked-apps'
import useGetRepositorys from './hooks/use-get-repositorys'

import Navigation from './components/navigation'
import Info from './components/info'
import ReadmeViewer from './components/readme-viewer'
import AppCards from './components/app-cards'
import AppSearchCards from './components/app-search-cards'

window.socket = io(
  `http://localhost:6969?platform=store-channel`,
  {
    options: {
      reconnectionDelayMax: 10000
    }
  }
)

const Main = observer(() => {
  const appsData = useGetApps()
      , workedAppsData = useGetWorkedApps()
      , repositorysData = useGetRepositorys()

  useEffect(() => {
    mainState.statusWall.installedApplications = appsData.length
  }, [appsData])

  useEffect(() => {
    mainState.statusWall.repositorys = repositorysData.length
    mainState.statusWall.availableApplications = repositorysData.reduce((ctx, { appsData }) => ctx + appsData.length, 0)
  }, [repositorysData])

  useEffect(() => {
    mainState.statusWall.activeApplications = workedAppsData.length
  }, [workedAppsData])

  return (
    <>
      <Navigation />
      <Info />
      {
        mainState.search
          ? (
            <AppSearchCards />
          )
          : (
            <AppCards appsData={appsData} />
          )
      }
    </>
  )
})

const App = observer(() => {
  const { readme } = queryString.parse(window.location.search)

  return readme ? (
    <ReadmeViewer readme={readme} />
  ) : (
    <Main />
  )
})

export default App
