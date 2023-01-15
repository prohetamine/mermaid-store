import { useEffect, useState } from 'react'
import styled from 'styled-components'

import background from './assets/background.svg'
import logo from './assets/logo.svg'
import on from './assets/on-icon.svg'
import off from './assets/off-icon.svg'
import menu from './assets/menu-icon.svg'

const HeaderBody = styled.div`
  height: 200px;
  width: 100%;
  background-image: url(${background});
  background-size: cover;
  display: flex;
`

const SearchWrapper = styled.div`
  margin-left: 90px;
  padding-top: 19px;
  padding-bottom: 23px;
  height: 200px;
  width: calc(100% - 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavigationWrapper = styled.div`
  width: 90px;
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 19px;
`

const Logo = styled.div`
  width: 78.23px;
  height: 94px;
  background-image: url(${logo});
  background-size: cover;
  margin-bottom: 20px;
`

const Search = styled.input`
  max-width: 265px;
  width: 100%;
  box-sizing: border-box;
  height: 44px;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  outline: none;
  border: none;
  padding: 11px 12px;

  &::placeholder{
    color: #8F8F8F;
  }
`

const Button = styled.div`
  padding: 12px;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  display: inline-flex;
  cursor: pointer;
  margin-bottom: 8px;

  &:hover {
    background: #FAFAFA;
  }

  &:active {
    background: #F6F6F6;
  }
`

const Icon = styled.div``

const Header = ({ onSearch, onMenu, onAppsState }) => {
  const [search, setSearch] = useState('')
      , [appsState, setAppsState] = useState(true)

  useEffect(() => {
    onSearch(search.replace(/(\*|\\|\?|\(|\)|\[|\]|\+|\|\`)/gi, ''))
  }, [search, onSearch])

  useEffect(() => {
    onAppsState(appsState)
  }, [appsState, onAppsState])

  return (
    <HeaderBody className='dragbar'>
      <SearchWrapper>
        <Logo />
        <Search
          className='nodragbar'
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          placeholder='Find applications ...'
        />
      </SearchWrapper>
      <NavigationWrapper>
        <Button className='nodragbar' onClick={() => onMenu(true)}>
          <Icon style={{ backgroundImage: `url(${menu})`, backgroundSize: 'cover', width: '26px', height: '26px' }} />
        </Button>
        <Button className='nodragbar' onClick={() => setAppsState(s => !s)}>
          <Icon style={{ backgroundImage: `url(${appsState ? on : off})`, backgroundSize: 'cover', width: '26px', height: '26px' }} />
        </Button>
      </NavigationWrapper>
    </HeaderBody>
  )
}

export default Header
