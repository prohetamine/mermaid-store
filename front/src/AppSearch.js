import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Body = styled.div`
  padding: 20px 16px 0px 36px;
  margin-bottom: 0px;
`

const App = props => {
  const [installProgress, setInstallProgress] = useState(0)
      , [installType, setInstallType] = useState(1)
      , [isAppInstalled, setAppInstalled] = useState(true)
      , [isAppFirstData, setAppFirstData] = useState(false)

  useEffect(() => {
    const handleAppInstallProgress = ({ err, ok, type, progress, appData }) => {
      if (appData.app === props.appData.app && appData.repository === props.appData.repository) {
        setInstallType(type)
        setInstallProgress((progress * 100).toFixed(1))
        setAppFirstData(true)
        if (progress === 1) {
          setAppInstalled(true)
          setInstallProgress(0)
        }
      }
    }

    window.socket.on('app-install-progress', handleAppInstallProgress)

    return () => window.socket.off('app-install-progress', handleAppInstallProgress)
  }, [props.appData])

  useEffect(() => {
    const handleCheckAppInstalled = ({ isInstalled, appData }) => {
      if (appData.app === props.appData.app && appData.repository === props.appData.repository) {
        setAppInstalled(isInstalled)
        setAppFirstData(true)
      }
    }

    window.socket.on('check-app-installed', handleCheckAppInstalled)

    const timeId = setTimeout(() => {
      window.socket.emit('check-app-installed', { repository: props.appData.repository, app: props.appData.app })
    }, 100)

    return () => {
      clearTimeout(timeId)
      window.socket.off('check-app-installed', handleCheckAppInstalled)
    }
  }, [props.appData])

  return (
    <div>
      <span>{props.appData.app} { installProgress ? `${installType === 1 ? 'install' : installType === 2 ? 'update' : null} (${installProgress}%)` : null }</span>
      {
        isAppFirstData
          ? (
            isAppInstalled
              ? (
                <>
                  <button onClick={() => window.socket.emit('app-update', { repository: props.appData.repository, app: props.appData.app, zip: props.appData.zip })}>update</button>
                </>
              )
              : (
                <button onClick={() => window.socket.emit('app-install', { repository: props.appData.repository, app: props.appData.app, zip: props.appData.zip })}>install</button>
              )
          )
          : (
            null
          )
      }
    </div>
  )
}

const AppSearch = ({ search }) => {
  const [repositorysData, setRepositorysData] = useState([])

  useEffect(() => {
    window.socket.on('get-repositorys', repositorysData => {
      setRepositorysData(repositorysData)
    })

    window.socket.emit('get-repositorys')
  }, [])

  const searchRegExp = new RegExp(search, 'gi')

  return (
    <Body>
      {
        repositorysData
          .reduce((ctx, repository, i) => {
            const isFind = repository.name.match(searchRegExp)

            if (isFind) {
              ctx.push(repository)
            }

            if (i === repositorysData.length - 1) {
              if (ctx.length === 0) {
                ctx = repositorysData
              }
            }

            return ctx
          }, [])
          .map(repository => (
            <div key={JSON.stringify(repository)}>
              <div>{repository.name}</div>
              <div>
                {
                  repository.apps
                    .reduce((ctx, app, i) => {
                      const isFind = app.name.match(searchRegExp)

                      if (isFind) {
                        ctx.push(app)
                      }

                      if (i === repository.apps.length - 1) {
                        if (ctx.length === 0) {
                          ctx = repository.apps
                        }
                      }

                      return ctx
                    }, [])
                    .map(app => (
                      <App appData={{ app: app.name, repository: repository.name, zip: app.zip }} key={JSON.stringify(app)}></App>
                    ))
                }
              </div>
            </div>
          ))
      }
    </Body>
  )
}

export default AppSearch
