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

const Card = styled.div`
  background: #FFFFFF;
  display: inline-block;
  padding: 6px 11px 11px 11px;
  box-shadow: 0px 1px 5px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  box-sizing: border-box;
  position: absolute;
  font-size: 0px;
  margin-right: 20px;
  margin-bottom: 20px;
`

const CardHead = styled.div`
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

const cardSize = [{
  width: 158,
  height: 158 - 17
}, {
  width: 358,
  height: 358 - 17
}]

const AppCard = ({ data }) => {
  const [contextMenu, setContextMenu] = useState(false)
  const [isPlay, setPlay] = useState(true)

  useEffect(() => {
    const appState = ({ appData, state }) => {
      if (appData.app === data.app && appData.repository === data.repository) {
        setPlay(state.isPlay)
      }
    }

    window.socket.on('app-state', appState)
    return () => window.socket.off('app-state', appState)
  }, [data])

  return (
    <Card className='grid-app' tabIndex="-1" onBlur={() => setContextMenu(false)}>
      <CardHead>
        <WrapperTitle>
          <CardRepo>~{data.repository}/</CardRepo>
          <CardApp>{data.app}</CardApp>
        </WrapperTitle>
        <ContextMenuIcon onClick={() => setContextMenu(true)} />
        {
          contextMenu
            ? (
              <ContextMenu size={data.zip ? '156px' : '130px'}>
                <ContextMenuItem
                  onClick={() => {
                    if (isPlay) {
                      window.socket.emit('app-pause', { repository: data.repository, app: data.app })
                    } else {
                      window.socket.emit('app-play', { repository: data.repository, app: data.app })
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
                    window.socket.emit('app-reload', data)
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
                  data.zip
                    ? (
                      <ContextMenuItem
                        onClick={() => {
                          window.socket.emit('app-update', { repository: data.repository, app: data.app, zip: data.zip })
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
                    window.socket.emit('app-work-folder', { repository: data.repository, app: data.app })
                    setContextMenu(false)
                  }}
                >
                  <ContextMenuItemTitle>Work dir</ContextMenuItemTitle>
                  <div style={{ backgroundImage: `url(${contextMenuWorkDirIcon})`, width: '10px', height: '14px' }} />
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    window.socket.emit('app-delete', { repository: data.repository, app: data.app })
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
      <Iframe width={cardSize[data.size - 1].width} height={cardSize[data.size - 1].height} title={`~${data.repository}/${data.app}`} src={`http://localhost:6969/${data.repository}/${data.app}/public/main.html`} frameBorder="0"></Iframe>
    </Card>
  )
}

export default AppCard
