import { useEffect, useState } from 'react'
import styled from 'styled-components'

const BlackBody = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.34);
  position: fixed;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Wrapper = styled.div`
  width: 623px;
  height: 420px;
  background: #FFFFFF;
  box-shadow: 0px 1px 20px rgba(23, 23, 23, 0.15);
  border-radius: 8px;
`

const Menu = ({ onClose }) => {
  const [repositorysData, setRepositorysData] = useState([])
  , [value, setValue] = useState('')

  useEffect(() => {
    window.socket.on('get-repositorys', repositorys => {
      setRepositorysData(repositorys)
    })

    window.socket.emit('get-repositorys')
  }, [])

  return (
    <BlackBody
      className='close'
      onClick={({ target }) => {
        if (target.classList.contains('close')) {
          onClose()
        }
      }}
    >
      <Wrapper>
        <div>
          <input type='text' value={value} onChange={({ target: { value } }) => setValue(value)} />
          <button
            onClick={() => {
              window.socket.emit('repository-add', value)
              setValue('')
            }}
          >Add</button>
        </div>
        {
          repositorysData.map(repository =>
            <div>{repository.name} <button onClick={() => window.socket.emit('repository-update', repository.link)}>update {repository.date}</button><button onClick={() => window.socket.emit('repository-delete', repository.link)}>delete</button></div>
          )
        }
      </Wrapper>
    </BlackBody>
  )
}

export default Menu
