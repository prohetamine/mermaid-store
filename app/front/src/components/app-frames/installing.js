import styled from 'styled-components'

import appIcon from './../../assets/general/app.svg'
import image from './../../assets/general/image.png'
import arrowDownIcon from './../../assets/context-menu/arrow-down.svg'
import plusIcon from './../../assets/context-menu/plus.svg'

const icons = {
  arrow_down: arrowDownIcon,
  plus: plusIcon
}

const Body = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const AppIcon = styled.div`
  width: 26px;
  height: 26px;
  background-image: url(${appIcon});
  background-size: cover;
  position: absolute;
`

const Text = styled.div`
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

const Icon = styled.div`
  width: 10px;
  height: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
`

const Wrapper = styled.div`
  gap: 5px;
  display: flex;
  align-items: center;
  margin-top: 70px;
  cursor: pointer;
`

const Installing = ({ label, active, icon, size, onClick }) => {
  return (
    <Body
      width={size - 22}
      height={size - 39}
    >
      <AppIcon />
      <Wrapper onClick={() => active && onClick()}>
        <Text>{label}</Text>
        {
          active ? (
            <Icon src={icons[icon]}></Icon>
          )
          : (
            null
          )
        }
      </Wrapper>
    </Body>
  )
}

export default Installing
