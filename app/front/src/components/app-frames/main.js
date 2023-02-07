import styled from 'styled-components'

const Iframe = styled.iframe`
  user-select: none;
`

const Main = ({ appData, size }) => {
  return (
    <Iframe
      width={size - 22}
      height={size - 39}
      title={`~${appData.repository}/${appData.app}`}
      src={`http://localhost:6969/${appData.repository}/${appData.app}/public/main.html`}
      frameBorder="0"
    />
  )
}

export default Main
