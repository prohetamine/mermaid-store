import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import mainState from './../main-state'

import background from './../assets/background.svg'
import logo from './../assets/images/logo.svg'

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

const Navigation = observer(() => {
  return (
    <Body className='dragbar'>
      <Wrapper>
        <Logo />
        <Input
          className='nodragbar'
          value={mainState.search}
          onChange={({ target: { value } }) => mainState.search = value}
          placeholder='Find repositories, apps ...'
        />
      </Wrapper>
    </Body>
  )
})

export default Navigation
