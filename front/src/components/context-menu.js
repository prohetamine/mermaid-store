import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
//import mainState from './../main-state'

import arrowDownIcon from './../assets/context-menu/arrow-down.svg'
import arrowLeftIcon from './../assets/context-menu/arrow-left.svg'
import arrowRightIcon from './../assets/context-menu/arrow-right.svg'
import arrowUpIcon from './../assets/context-menu/arrow-up.svg'
import burgerIcon from './../assets/context-menu/burger.svg'
import dirIcon from './../assets/context-menu/dir.svg'
import linkIcon from './../assets/context-menu/link.svg'
import minusIcon from './../assets/context-menu/minus.svg'
import pauseIcon from './../assets/context-menu/pause.svg'
import playIcon from './../assets/context-menu/play.svg'
import plusIcon from './../assets/context-menu/plus.svg'
import questionIcon from './../assets/context-menu/question.svg'
import reloadIcon from './../assets/context-menu/reload.svg'
import settingIcon from './../assets/context-menu/setting.svg'
import pinIcon from './../assets/context-menu/pin.svg'

const icons = {
  arrow_down: arrowDownIcon,
  arrow_up: arrowUpIcon,
  arrow_left: arrowLeftIcon,
  arrow_right: arrowRightIcon,
  burger: burgerIcon,
  dir: dirIcon,
  link: linkIcon,
  minus: minusIcon,
  pause: pauseIcon,
  play: playIcon,
  plus: plusIcon,
  question: questionIcon,
  reload: reloadIcon,
  setting: settingIcon,
  pin: pinIcon,
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  position: absolute;
  right: 7px;
  top: 7px;
  width: auto;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0px 1px 20px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
  z-index: 9999;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  box-sizing: border-box;
  width: 100%;
  height: 27px;
  gap: 15px;
  cursor: pointer;
  background: #FFFFFF;

  &:hover {
    background: #F6F6F6;
  }

  &:active {
    background: #F1F1F1;
  }
`

const Text = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #696969;
`

const Icon = styled.div`
  width: 12px;
  height: 12px;
  background-image: url(${props => icons[props.name]});
`

const ContextMenu = observer(({ style, items, onClick, active }) => {
  return active
            ? (
              <Body style={style}>
                {
                  items
                    .filter(f => f)
                    .map(
                      item => (
                        <Item key={JSON.stringify(item)} onClick={() => onClick(item)}>
                          <Text>{item.label}</Text>
                          <Icon name={item.icon} />
                        </Item>
                      )
                    )
                }
              </Body>
            )
            : (
              null
            )
})

export default ContextMenu
