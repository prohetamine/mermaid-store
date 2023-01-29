import styled from 'styled-components'

import loadIcon from './../../assets/general/load.svg'

const Body = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingIcon = styled.div`
  width: 26px;
  height: 26px;
  background-image: url(${loadIcon});
  background-size: cover;
  animation: spin 1s linear infinite;
`

const Loading = ({ app, repository, size }) => {
  return (
    <Body
      width={size - 22}
      height={size - 39}
    >
      <LoadingIcon />
    </Body>
  )
}

export default Loading
