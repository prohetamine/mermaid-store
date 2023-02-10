import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import useAppsState from './../hooks/use-apps-state'

import mainState from './../main-state'

import background from './../assets/background.png'
import logo from './../assets/images/logo.svg'
import onIcon from './../assets/navigation/state/on.svg'
import offIcon from './../assets/navigation/state/off.svg'
import deleteIcon from './../assets/navigation/delete.svg'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  isolation: isolate;
  width: 100%;
  height: 197px;
  background-image: url(${background});
  background-size: cover;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 15px;
  width: 220px;
  height: 153px;
  flex: none;
  order: 0;
  flex-grow: 0;
  z-index: 0;
`

const Logo = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${logo});
`

const SearchWrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  isplay: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 11px 12px;
  gap: 10px;
  position: relative;
  width: 220px;
  height: 38px;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #696969;
  box-sizing: border-box;
  outline: none;
  border: none;
`

const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  position: absolute;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  cursor: pointer;
`

const BigIcon = styled.div`
  width: 26px;
  height: 26px;
  background-image: url(${props => props.src});
  flex: none;
  order: 0;
  flex-grow: 0;
`

const Icon = styled.div`
  width: 14px;
  height: 14px;
  background-image: url(${props => props.src});
  flex: none;
  order: 0;
  flex-grow: 0;
`

const Navigation = observer(() => {
  const isPlay = useAppsState()

  useEffect(() => {
    window.socket.on('search', value => {
      mainState.search = value.replace(/(\\|\*|\(|\)|\+|\[|\]|\?)/gi, '')
    })
  }, [])

  return (
    <Body className='dragbar'>
      <Button
        style={{
          right: '10px',
          bottom: '10px'
        }}
        onClick={() => {
          isPlay
            ? window.socket.emit('app-pause', { repository: '*', app: '*' })
            : window.socket.emit('app-play', { repository: '*', app: '*' })
        }}
      >
        <BigIcon
          src={
            isPlay
              ? onIcon
              : offIcon
          }
        />
      </Button>
      <Wrapper>
        <Logo />
        <SearchWrapper>
          <Input
            className='nodragbar'
            value={mainState.search}
            onChange={({ target: { value } }) => mainState.search = value.replace(/(\\|\*|\(|\)|\+|\[|\]|\?)/gi, '')}
            placeholder='Find repositories, apps ...'
          />
          {
            mainState.search
              ? (
                <Button
                  style={{
                    right: '-48px',
                    top: '0px'
                  }}
                  onClick={() => mainState.search = ''}
                >
                  <Icon src={deleteIcon} />
                </Button>
              )
              : (
                null
              )
          }
        </SearchWrapper>
      </Wrapper>
    </Body>
  )
})

export default Navigation
