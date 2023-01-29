import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Body = styled(ReactMarkdown)`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const ReadmeViewer = ({ readme }) => {
  const [text, setText] = useState('')

  useEffect(() => {
    fetch(readme)
      .then(e => e.text())
      .then(e => setText(e))
  }, [readme])

  return (
    <Body
      transformImageUri={(src, alt, title) => {
        if (src.match(/github.com/)) {
          return `${src}?raw=true`
        } else {
          return src
        }
      }}
    >
      {text}
    </Body>
  )
}

export default ReadmeViewer
