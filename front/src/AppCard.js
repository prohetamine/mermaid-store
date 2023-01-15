import { useEffect, useState } from 'react'
import styled from 'styled-components'

import contextMenuIcon from './assets/context-menu-icon.svg'
import contextMenuPlayIcon from './assets/context-menu-play-icon.svg'
import contextMenuPauseIcon from './assets/context-menu-pause-icon.svg'
import contextMenuReloadIcon from './assets/context-menu-reload-icon.svg'
import contextMenuUpdateIcon from './assets/context-menu-update-icon.svg'
import contextMenuReadmeIcon from './assets/context-menu-readme-icon.svg'
import contextMenuDeleteIcon from './assets/context-menu-delete-icon.svg'
import contextMenuWorkDirIcon from './assets/context-menu-work-dir-icon.svg'
import waitConnectionWebsocketIcon from './assets/wait-connection-websocket-icon.svg'

const Card = styled.div`
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 11px 11px 11px;
  box-shadow: 0px 1px 5px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  box-sizing: border-box;
  position: absolute;
  font-size: 0px;
  margin-right: 20px;
  margin-bottom: 20px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`

const CardHead = styled.div`
  width: 100%;
  height: 13px;
  margin-bottom: 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const WrapperTitle = styled.div`
  display: flex;
`

const CardRepo = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #A5A1A1;
`

const CardApp = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #A5A1A1;
`

const ContextMenuIcon = styled.div`
  background-image: url(${contextMenuIcon});
  width: 17px;
  height: 11px;
  cursor: pointer;
`

const ContextMenu = styled.div`
  width: 89px;
  height: ${props => props.size};
  background: #FFFFFF;
  box-shadow: 0px 1px 20px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  position: absolute;
  top: 7px;
  right: 7px;
  overflow: hidden;
`

const ContextMenuItem = styled.div`
  user-select: none;
  width: 89px;
  height: 26px;
  background: #FFFFFF;
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: #FAFAFA;
  }

  &:active {
    background: #F6F6F6;
  }
`

const ContextMenuItemTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #696969;
`

const Iframe = styled.iframe`
  user-select: none;
`

const WaitConnectionIcon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${waitConnectionWebsocketIcon});
  background-size: cover;
  animation: spin 1s linear infinite;
`

const cardSize = [
  180,
  380
]

const AppCard = props => {
  const [contextMenu, setContextMenu] = useState(false)
  const [isPlay, setPlay] = useState(true)
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    const appState = ({ appData, state }) => {
      if (appData.app === props.appData.app && appData.repository === props.appData.repository) {
        setPlay(state.isPlay)
      }
    }

    window.socket.on('app-state', appState)
    return () => window.socket.off('app-state', appState)
  }, [props.appData])


  useEffect(() => {
    const appConnectionState = ({ appData, isConnected }) => {
      if (appData.app === props.appData.app && appData.repository === props.appData.repository) {
        setConnected(isConnected)
      }
    }

    window.socket.on('app-connection-state', appConnectionState)

    const intervalId = setInterval(() => {
      window.socket.emit('app-connection-state', { repository: props.appData.repository, app: props.appData.app })
    }, 5000)

    const timeId = setTimeout(() => {
      window.socket.emit('app-connection-state', { repository: props.appData.repository, app: props.appData.app })
    }, 250)

    return () => {
      clearTimeout(timeId)
      clearInterval(intervalId)
      window.socket.off('app-connection-state', appConnectionState)
    }
  }, [props.appData])

  return (
    <Card size={cardSize[props.appData.size - 1]} className='grid-app' tabIndex="-1" onBlur={() => setContextMenu(false)}>
      {
        isConnected ?
          (
            <>
              <CardHead>
                <WrapperTitle>
                  <CardRepo>~{props.appData.repository}/</CardRepo>
                  <CardApp>{props.appData.app}</CardApp>
                </WrapperTitle>
                <ContextMenuIcon onClick={() => setContextMenu(true)} />
                {
                  contextMenu
                    ? (
                      <ContextMenu size={props.appData.zip ? '156px' : '130px'}>
                        <ContextMenuItem
                          onClick={() => {
                            if (isPlay) {
                              window.socket.emit('app-pause', { repository: props.appData.repository, app: props.appData.app })
                            } else {
                              window.socket.emit('app-play', { repository: props.appData.repository, app: props.appData.app })
                            }
                          }}
                        >
                          {
                            isPlay
                              ? (
                                <>
                                  <ContextMenuItemTitle>Pause</ContextMenuItemTitle>
                                  <div style={{ backgroundImage: `url(${contextMenuPauseIcon})`, width: '10px', height: '10px' }} />
                                </>
                              )
                              : (
                                <>
                                  <ContextMenuItemTitle>Play</ContextMenuItemTitle>
                                  <div style={{ backgroundImage: `url(${contextMenuPlayIcon})`, width: '10px', height: '10px' }} />
                                </>
                              )
                          }
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            window.socket.emit('app-reload', props.appData)
                            setContextMenu(false)
                          }}
                        >
                          <ContextMenuItemTitle>Reload</ContextMenuItemTitle>
                          <div style={{ backgroundImage: `url(${contextMenuReloadIcon})`, width: '13px', height: '14px' }} />
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <ContextMenuItemTitle>Readme</ContextMenuItemTitle>
                          <div style={{ backgroundImage: `url(${contextMenuReadmeIcon})`, width: '10px', height: '14px' }} />
                        </ContextMenuItem>
                        {
                          props.appData.zip
                            ? (
                              <ContextMenuItem
                                onClick={() => {
                                  window.socket.emit('app-update', { repository: props.appData.repository, app: props.appData.app, zip: props.appData.zip })
                                  setContextMenu(false)
                                }}
                              >
                                <ContextMenuItemTitle>Update</ContextMenuItemTitle>
                                <div style={{ backgroundImage: `url(${contextMenuUpdateIcon})`, width: '10px', height: '14px' }} />
                              </ContextMenuItem>
                            )
                            : (
                              null
                            )
                        }
                        <ContextMenuItem
                          onClick={() => {
                            window.socket.emit('app-work-folder', { repository: props.appData.repository, app: props.appData.app })
                            setContextMenu(false)
                          }}
                        >
                          <ContextMenuItemTitle>Work dir</ContextMenuItemTitle>
                          <div style={{ backgroundImage: `url(${contextMenuWorkDirIcon})`, width: '10px', height: '14px' }} />
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            window.socket.emit('app-delete', { repository: props.appData.repository, app: props.appData.app })
                            setContextMenu(false)
                          }}
                        >
                          <ContextMenuItemTitle>Delete</ContextMenuItemTitle>
                          <div style={{ backgroundImage: `url(${contextMenuDeleteIcon})`, width: '10px', height: '10px' }} />
                        </ContextMenuItem>
                      </ContextMenu>
                    )
                    : null
                }
              </CardHead>
              <Iframe width={cardSize[props.appData.size - 1] - 22} height={cardSize[props.appData.size - 1] - 39} title={`~${props.appData.repository}/${props.appData.app}`} src={`http://localhost:6969/${props.appData.repository}/${props.appData.app}/public/main.html`} frameBorder="0"></Iframe>
            </>
          )
          : (
            <WaitConnectionIcon />
          )
      }
    </Card>
  )
}

export default AppCard
