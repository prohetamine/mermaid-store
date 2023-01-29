import { useState } from 'react'
import styled from 'styled-components'
import md5 from 'md5'
import moment from 'moment'
import AppCards from './app-cards'
import ContextMenu from './context-menu'
import contextIcon from './../assets/context-menu/more.svg'
import image from './../assets/general/image.png'
import arrowDownIcon from './../assets/context-menu/arrow-down.svg'
import plusIcon from './../assets/context-menu/plus.svg'

const icons = {
  arrow_down: arrowDownIcon,
  plus: plusIcon
}

const Wrapper = styled.div`
  margin-bottom: 20px;
`

const Repository = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 13px;
  position: relative;
  width: calc(100% - 72px);
  margin-left: 36px;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 1px 5px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  margin-bottom: 20px;
`

const Title = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #696969;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const Line = styled.div`
  height: 1px;
  background: #EBEBEB;
  margin: 0px 47px;
  box-sizing: border-box;
`

const MiddleContainer = styled.div`
  margin-top: 2px;
  display: flex;
`

const SmallContainer = styled.div`
  margin-top: 6px;
  display: flex;
`

const MiddleTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #A5A5A5;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const MiddleContent = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #A5A5A5;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin-left: 5px;
`

const SmallWrapper = styled.div``

const SmallTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #AFAFAF;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const SmallContent = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  align-items: center;
  color: #AFAFAF;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin-left: 5px;
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
  position: absolute;
  right: 13px;
  top: 13px;
`

const InstallingText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  color: white;
  background: url(${image}) no-repeat;
  background-size: cover;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const InstallingIcon = styled.div`
  width: 10px;
  height: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
`

const InstallingWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 13px;
  bottom: 13px;
  user-select: none;
  gap: 5px;
  cursor: pointer;
`

const AppSearchCard = ({ repositoryData, isLine }) => {
  const [showContextMenu, setShowContextMenu] = useState(false)

  return (
    <Wrapper>
      <Repository
        tabIndex='-1'
        onBlur={() => setShowContextMenu(false)}
      >
        <ContextMenu
          active={showContextMenu}
          items={
            [
              repositoryData.installed
                ? ({ label: 'Update', icon: 'arrow_down', type: 'update' })
                : ({ label: 'Install', icon: 'plus', type: 'install' }),
              { label: 'Readme', icon: 'question', type: 'readme' },
              repositoryData.installed
                ? ({ label: 'Delete', icon: 'minus', type: 'delete' })
                : (null)
            ]
          }
          onClick={
            ({ type }) => {
              if (type === 'delete') {
                window.socket.emit('repository-delete', repositoryData.link)
                setShowContextMenu(false)
              }

              if (type === 'install') {
                window.socket.emit('repository-add', repositoryData.link)
                setShowContextMenu(false)
              }

              if (type === 'update') {
                window.socket.emit('repository-update', repositoryData.link)
                setShowContextMenu(false)
              }
            }
          }
        />
        <ContextMenuIcon onClick={() => setShowContextMenu(true)} />
        <InstallingWrapper
          onClick={
            () => {
              repositoryData.installed
                ? window.socket.emit('repository-update', repositoryData.link)
                : window.socket.emit('repository-add', repositoryData.link)
            }
          }
        >
          <InstallingText>{repositoryData.installed ? 'Update' : 'Install'}</InstallingText>
          <InstallingIcon src={icons[repositoryData.installed ? 'arrow_down' : 'plus']} />
        </InstallingWrapper>
        <Title>{repositoryData.repository} ({md5(repositoryData.repository).slice(15, 25)})</Title>
        <MiddleContainer>
          <MiddleTitle>Apps:</MiddleTitle>
          <MiddleContent>{`${repositoryData.appsData.map(({ app }) => app).join(', ').slice(0, 55)} ... (${repositoryData.appsData.length})`}</MiddleContent>
        </MiddleContainer>
        <SmallWrapper>
          {
            repositoryData.installed
              ? (
                <SmallContainer>
                  <SmallTitle>Update:</SmallTitle>
                  <SmallContent>{moment(repositoryData.date).format('DD.MM.YY [at] hh:mm')}</SmallContent>
                </SmallContainer>
              )
              : (
                null
              )
          }
          <SmallContainer style={{ marginTop: '3px' }}>
            <SmallTitle>URL:</SmallTitle>
            <SmallContent>{repositoryData.link}</SmallContent>
          </SmallContainer>
        </SmallWrapper>
      </Repository>
      {
        repositoryData.installed
          ? (
            <AppCards appsData={repositoryData.appsData.map(app => ({ ...app, notExecuting: true }))} />
          )
          : (
            null
          )
      }
      {
        isLine
          ? (
            <Line />
          )
          : (
            null
          )
      }
    </Wrapper>
  )
}

export default AppSearchCard
