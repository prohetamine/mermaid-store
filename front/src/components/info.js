import { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import useHorizontalScroll from './../hooks/use-horizontal-scroll'
import mainState from './../main-state'

import removeIcon from './../assets/general/remove.svg'
import apiImage from './../assets/images/api.svg'
import supportImage from './../assets/images/crystal.svg'


const Body = styled.div`
  user-select: none;
`

const Wrapper = styled.div`
  padding-left: 36px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  overflow-x: scroll;
`

const Line = styled.div`
  height: 1px;
  background: #EBEBEB;
  margin: 0px 47px;
  box-sizing: border-box;
  margin-bottom: 20px;
`

const InfoBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 13px;
  isolation: isolate;
  position: relative;
  width: 100%;
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  height: 121px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  margin-right: 16px;
  box-sizing: border-box;
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
  z-index: 0;
  position: absolute;
  left: 13px;
  top: 13px;
`

const Remove = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  right: 13px;
  top: 13px;
  background-image: url(${removeIcon});
  cursor: pointer;
`

const Item = styled.div`
  position: absolute;
  display: flex;
`

const Name = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #696969;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const Value = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #696969;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin-left: 4px;
`

const Description = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #696969;
  position: absolute;
`

const Image = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  background-size: cover;
  background-position: center center;
`

const Link = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  position: absolute;
  cursor: pointer;
`

const Empty = styled.div`
  height: 20px;
`

const StatusWall = observer(({ onHide }) => {
  return (
    <InfoBody width='222px'>
      <Title>Status Wall</Title>
      <Remove onClick={() => onHide()} />
      <Item style={{ top: '38px', left: '23px' }}>
        <Name>Repositories:</Name>
        <Value>{mainState.statusWall.repositorys}</Value>
      </Item>
      <Item style={{ top: '58px', left: '23px' }}>
        <Name>Available applications:</Name>
        <Value>{mainState.statusWall.availableApplications}</Value>
      </Item>
      <Item style={{ top: '75px', left: '23px' }}>
        <Name>Installed applications:</Name>
        <Value>{mainState.statusWall.installedApplications}</Value>
      </Item>
      <Item style={{ top: '92px', left: '23px' }}>
        <Name>Active applications:</Name>
        <Value>{mainState.statusWall.activeApplications}</Value>
      </Item>
    </InfoBody>
  )
})

const Support = observer(({ onHide }) => {
  return (
    <InfoBody width='325px'>
      <Title>Support</Title>
      <Remove onClick={() => onHide()} />
      <Description style={{ left: '23px', top: '38px', width: '199px', height: '64px' }}>
        This is an open source project, but you can still support the author, communicate with him, express your wishes and ideas
      </Description>
      <Image style={{ top: '32px', right: '33px', backgroundImage: `url(${supportImage})`, backgroundSize: 'cover' }} />
      <Link style={{ top: '87px', right: '33px', color: '#15BEE3' }}>Go to →</Link>
    </InfoBody>
  )
})

const Api = observer(({ onHide }) => {
  return (
    <InfoBody width='241px'>
      <Title>Development</Title>
      <Remove onClick={() => onHide()} />
      <Description style={{ left: '23px', top: '38px', width: '115px', height: '64px' }}>
        Create and develop your own applications with documentation
      </Description>
      <Image style={{ top: '32px', right: '33px', backgroundImage: `url(${apiImage})` }} />
      <Link style={{ top: '87px', right: '33px', color: '#696969' }}>Go to →</Link>
    </InfoBody>
  )
})

const Navigation = observer(() => {
  const [items, setItems] = useState([
    { Element: StatusWall, id: 1, isHide: false },
    { Element: Support, id: 2, isHide: false },
    { Element: Api, id: 3, isHide: false }
  ])

  const drawItems = items.filter(({ isHide }) => !isHide)

  const scrollRef = useHorizontalScroll()

  return drawItems.length
            ? (
              <Body>
                <Wrapper ref={scrollRef}>
                {
                  drawItems
                    .map(
                      ({ id, Element }, i) => (
                        <Element
                          key={id}
                          onHide={
                            () =>
                              setItems(
                                items => items.map(
                                  item =>
                                    item.id === id
                                      ? ({
                                        ...item,
                                        isHide: !item.isHide
                                      })
                                    : item
                                )
                              )
                          }
                          style={
                            i === 0
                              ? { marginLeft: '36px' }
                              : i === items.length - 1
                                  ? { marginRight: '36px' }
                                  : {}
                          }
                        />
                      )
                    )
                }
                </Wrapper>
                <Line />
              </Body>
            )
            : (
              <Empty />
            )
})

export default Navigation
