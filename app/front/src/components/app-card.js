import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import md5 from 'md5'
import ContextMenu from './context-menu'
import useAppConnectionState from './../hooks/use-app-connection-state'
import useAppState from './../hooks/use-app-state'
import useCheckAppInstalled from './../hooks/use-check-app-installed'
import useAppInstallProgress from './../hooks/use-app-install-progress'
import mainState from './../main-state'

import Main from './app-frames/main'
import Loading from './app-frames/loading'
import Installing from './app-frames/installing'

import contextIcon from './../assets/context-menu/more.svg'

const appSizes = {
  '1': 180,
  '2': 380
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 11px 11px;
  gap: 9px;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: #FFFFFF;
  box-shadow: 0px 1px 5px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  margin-right: 20px;
  box-sizing: border-box;
  user-select: none;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  width: 100%;
  height: 13px;
`

const TitleBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  height: 13px;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const RepositoryName = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #A5A5A5;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const AppName = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #A5A5A5;
  flex: none;
  order: 1;
  flex-grow: 0;
`

const ContextMenuIcon = styled.div`
  width: 16px;
  height: 13px;
  background-image: url(${contextIcon});
  background-size: 16px 4px;
  background-repeat: no-repeat;
  background-position: center;
  flex: none;
  order: 1;
  flex-grow: 0;
  cursor: pointer;
`

const AppCard = observer(({ appData }) => {
  const [showContextMenu, setShowContextMenu] = useState(false)

  const isConnected = useAppConnectionState(appData)
      , isPlay = useAppState(appData)
      , isInstalled = useCheckAppInstalled(appData)
      , progressData = useAppInstallProgress(appData)

  return (
    <Body
      className='grid-app'
      size={appSizes[appData.size]}
      tabIndex='-1'
      onBlur={() => setShowContextMenu(false)}
    >
      <ContextMenu
        active={showContextMenu}
        items={
          appData.notExecuting
            ? isInstalled
                ? [
                  { label: `${progressData.type === 1 ? 'Install' : progressData.type === 2 ? 'Update' : 'Update'} ${progressData.view ? `(${(progressData.progress * 100).toFixed(1)}%)` : ''}`, icon: 'arrow_down', type: 'update' },
                  { label: 'Readme', icon: 'question', type: 'readme' },
                  { label: 'Delete', icon: 'minus', type: 'delete' }
                ]
                : [
                  { label: `${progressData.type === 1 ? 'Install' : progressData.type === 2 ? 'Update' : 'Install'} ${progressData.view ? `(${(progressData.progress * 100).toFixed(1)}%)` : ''}`, icon: 'plus', type: 'install' },
                  { label: 'Readme', icon: 'question', type: 'readme' }
                ]
            : [
                isPlay === null
                  ? (null)
                  : isPlay
                      ? ({ label: 'Pause', icon: 'pause', type: 'pause' })
                      : ({ label: 'Play', icon: 'play', type: 'play' }),
                { label: 'Pin to top', icon: 'pin', type: 'pin' },
                { label: 'Reload', icon: 'reload', type: 'reload' },
                appData.zip
                  ? ({ label: 'Update', icon: 'arrow_down', type: 'update' })
                  : (null),
                { label: 'Readme', icon: 'question', type: 'readme' },
                { label: 'Work dir', icon: 'dir', type: 'work-dir' },
                { label: 'Delete', icon: 'minus', type: 'delete' }
              ]
        }
        onClick={
          ({ type }) => {
            if (type === 'pause') {
              window.socket.emit('app-pause', { repository: appData.repository, app: appData.app })
              setShowContextMenu(false)
            }

            if (type === 'pin') {
              if (mainState.pinApps[`${appData.repository}/${appData.app}`]) {
                mainState.pinApps[`${appData.repository}/${appData.app}`] += (Object.values(mainState.pinApps).sort((a, b) => b - a)[0] || 0) + 1
              } else {
                mainState.pinApps[`${appData.repository}/${appData.app}`] = (Object.values(mainState.pinApps).sort((a, b) => b - a)[0] || 0) + 1
              }
              setShowContextMenu(false)
            }

            if (type === 'play') {
              window.socket.emit('app-play', { repository: appData.repository, app: appData.app })
              setShowContextMenu(false)
            }

            if (type === 'reload') {
              window.socket.emit('app-reload', { repository: appData.repository, app: appData.app })
              setShowContextMenu(false)
            }

            if (type === 'update') {
              setShowContextMenu(false)
              if (appData.author === 'prohetamine' && appData.repository === 'official') {
                window.socket.emit('app-update', { repository: appData.repository, app: appData.app, zip: appData.zip })
              } else {
                const isUpdate = window.confirm('This is a third-party application from an unofficial repository, updating the application can lead to irreversible and unpredictable consequences, do you really want to install it ?')

                if (isUpdate) {
                  window.socket.emit('app-update', { repository: appData.repository, app: appData.app, zip: appData.zip })
                }
              }
            }

            if (type === 'readme') {
              window.socket.emit('open-readme', `http://localhost:6969/${appData.repository}/${appData.app}/readme.md`)
              setShowContextMenu(false)
            }

            if (type === 'work-dir') {
              window.socket.emit('app-work-folder', { repository: appData.repository, app: appData.app })
              setShowContextMenu(false)
            }

            if (type === 'delete') {
              window.socket.emit('app-delete', { repository: appData.repository, app: appData.app })
              setShowContextMenu(false)
            }

            if (type === 'install') {
              setShowContextMenu(false)
              if (appData.author === 'prohetamine' && appData.repository === 'official') {
                window.socket.emit('app-install', { repository: appData.repository, app: appData.app, zip: appData.zip })
              } else {
                const isIstall = window.confirm('This is a third-party application from an unofficial repository, installing the application can lead to irreversible and unpredictable consequences, do you really want to install it ?')

                if (isIstall) {
                  window.socket.emit('app-install', { repository: appData.repository, app: appData.app, zip: appData.zip })
                }
              }
            }
          }
        }
      />
      <Header>
        <TitleBody>
          <RepositoryName>~{(r => (r.length > 10 && appData.size === 1) ? md5(r).slice(15, 25) : r)(appData.repository)}/</RepositoryName>
          <AppName>{(a => (a.length > 10 && appData.size === 1) ? md5(a).slice(15, 19) : a)(appData.app)}</AppName>
        </TitleBody>
        <ContextMenuIcon onClick={() => setShowContextMenu(true)} />
      </Header>
      {
        appData.notExecuting
          ? isInstalled
              ? (
                <Installing
                  size={appSizes[appData.size]}
                  label={`${progressData.type === 1 ? 'Installing' : progressData.type === 2 ? 'Updating' : 'Update'} ${progressData.view ? `(${(progressData.progress * 100).toFixed(1)}%)` : ''}`}
                  icon={progressData.type === 1 ? 'plus' : progressData.type === 2 ? 'arrow_down' : 'arrow_down'}
                  active={!progressData.view}
                  onClick={
                    () => {
                      if (appData.author === 'prohetamine' && appData.repository === 'official') {
                        window.socket.emit('app-update', { repository: appData.repository, app: appData.app, zip: appData.zip })
                      } else {
                        const isUpdate = window.confirm('This is a third-party application from an unofficial repository, updating the application can lead to irreversible and unpredictable consequences, do you really want to install it ?')

                        if (isUpdate) {
                          window.socket.emit('app-update', { repository: appData.repository, app: appData.app, zip: appData.zip })
                        }
                      }
                    }
                  }
                />
              )
              : (
                <Installing
                  size={appSizes[appData.size]}
                  label={`${progressData.type === 1 ? 'Installing' : progressData.type === 2 ? 'Updating' : 'Install'} ${progressData.view ? `(${(progressData.progress * 100).toFixed(1)}%)` : ''}`}
                  icon={progressData.type === 1 ? 'plus' : progressData.type === 2 ? 'arrow_down' : 'plus'}
                  active={!progressData.view}
                  onClick={
                    () => {
                      if (appData.author === 'prohetamine' && appData.repository === 'official') {
                        window.socket.emit('app-install', { repository: appData.repository, app: appData.app, zip: appData.zip })
                      } else {
                        const isIstall = window.confirm('This is a third-party application from an unofficial repository, installing the application can lead to irreversible and unpredictable consequences, do you really want to install it ?')

                        if (isIstall) {
                          window.socket.emit('app-install', { repository: appData.repository, app: appData.app, zip: appData.zip })
                        }
                      }
                    }
                  }
                />
              )
        : isConnected
            ? (
              <Main size={appSizes[appData.size]} appData={appData} />
            )
            : (
              <Loading size={appSizes[appData.size]} />
            )
      }
    </Body>
  )
})

export default AppCard
