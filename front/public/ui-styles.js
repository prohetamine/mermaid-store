const { ipcRenderer } = require('electron')

let isMacOS = require('os').platform() === 'darwin'

const platform = isMacOS
                    ? 'mac-os'
                    : 'windows'

const isBarBackground = !(window.location.href === 'http://localhost:3000/' || window.location.href === 'http://localhost:8989/build/')

const style = document.createElement('style')
style.textContent = `
  .dragbar {
    -webkit-app-region: drag;
  }

  .nodragbar {
    -webkit-app-region: no-drag;
  }

  .mermaid-style-bar-background {
    background-image: url("data:image/png;base64,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");
    background-size: cover;
    background-position: center;
  }

  .mermaid-style-bar {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 9999998;
    top: 0px;
    left: 0px;
  }

  .mermaid-style-wrapper {
    display: flex;
    position: absolute;
  }

  .mermaid-style-mac-os-wrapper {
    left: 8px;
  }

  .mermaid-style-windows-wrapper {
    right: 0px;
  }

  .mermaid-style-mac-os-wrapper:hover > *:nth-child(1) {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iNiIgZmlsbD0iIzJDQTJERiIvPgo8cmVjdCB4PSIyLjgxODEyIiB5PSI4LjQ3NDg4IiB3aWR0aD0iOCIgaGVpZ2h0PSIxIiByeD0iMC41IiB0cmFuc2Zvcm09InJvdGF0ZSgtNDUgMi44MTgxMiA4LjQ3NDg4KSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iOC40NzQ5OCIgeT0iOS4xODE5OCIgd2lkdGg9IjgiIGhlaWdodD0iMSIgcng9IjAuNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEzNSA4LjQ3NDk4IDkuMTgxOTgpIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K");
  }

  .mermaid-style-mac-os-wrapper:hover > *:nth-child(2) {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iNiIgZmlsbD0iIzJDQTJERiIvPgo8cmVjdCB4PSIyIiB5PSI1LjUiIHdpZHRoPSI4IiBoZWlnaHQ9IjEiIHJ4PSIwLjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
  }

  .mermaid-style-mac-os-wrapper:hover > *:nth-child(3) {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iNiIgZmlsbD0iIzJDQTJERiIvPgo8cGF0aCBkPSJNMyA1LjIyNDI2QzMgNC45NTY5OSAzLjMyMzE0IDQuODIzMTQgMy41MTIxMyA1LjAxMjEzTDYuOTg3ODcgOC40ODc4N0M3LjE3Njg2IDguNjc2ODYgNy4wNDMwMSA5IDYuNzc1NzQgOUgzLjNDMy4xMzQzMSA5IDMgOC44NjU2OSAzIDguN1Y1LjIyNDI2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTkgNi43NzU3NEM5IDcuMDQzMDEgOC42NzY4NiA3LjE3Njg2IDguNDg3ODcgNi45ODc4N0w1LjAxMjEzIDMuNTEyMTNDNC44MjMxNCAzLjMyMzE0IDQuOTU2OTkgMyA1LjIyNDI2IDNMOC43IDNDOC44NjU2OSAzIDkgMy4xMzQzMSA5IDMuM1Y2Ljc3NTc0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==");
  }

  .mermaid-style-windows-wrapper {
    flex-direction: row-reverse;
  }

  .mermaid-style-mac-os-gap {
    gap: 8px;
  }

  .mermaid-style-windows-gap {
    gap: 0px;
  }

  .mermaid-style-mac-os-button {
    width: 12px;
    height: 12px;
    border-radius: 100px;
    cursor: pointer;
    background: #2CA2DF;
    opacity: 1;
  }

  .mermaid-style-windows-button {
    width: 38.57px;
    height: 30px;
    cursor: pointer;
  }

  .mermaid-style-mac-os-button:hover {
    opacity: 0.9;
  }

  .mermaid-style-windows-button:hover {
    opacity: 0.9;
  }

  .mermaid-style-windows-button-one {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAzNiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMjIuNDk1NiIgeT0iMTkuMjAyNyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjEiIHRyYW5zZm9ybT0icm90YXRlKC0xMzUgMjIuNDk1NiAxOS4yMDI3KSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTIuNTk2MiIgeT0iMTguNDk1NiIgd2lkdGg9IjE0IiBoZWlnaHQ9IjEiIHRyYW5zZm9ybT0icm90YXRlKC00NSAxMi41OTYyIDE4LjQ5NTYpIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K");
  }

  .mermaid-style-windows-button-one:hover {
    background-color: #E81123;
  }

  .mermaid-style-windows-button-two {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAzNiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTMiIHk9IjE4IiB3aWR0aD0iMTAiIGhlaWdodD0iMSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==");
    order: 1;
  }

  .mermaid-style-windows-button-two:hover {
    background-color: #0000001f;
  }

  .mermaid-style-windows-button-three {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAzNiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTMuNSIgeT0iOS41IiB3aWR0aD0iOSIgaGVpZ2h0PSI5IiBzdHJva2U9IndoaXRlIi8+Cjwvc3ZnPgo=");
  }

  .mermaid-style-windows-button-three:hover {
    background-color: #0000001f;
  }
`

const barNode = document.createElement('div')
barNode.className = `dragbar mermaid-style-bar ${isBarBackground ? 'mermaid-style-bar-background' : ''}`

const wrapperNode = document.createElement('div')
wrapperNode.className = `dragbar mermaid-style-wrapper mermaid-style-${platform}-wrapper mermaid-style-${platform}-gap`

const closeButtonNode = document.createElement('div')
closeButtonNode.className = `nodragbar mermaid-style-${platform}-button mermaid-style-${platform}-button-one`
closeButtonNode.addEventListener('click', () => {
  ipcRenderer.send('exit');
})

const minimizeButtonNode = document.createElement('div')
minimizeButtonNode.className = `nodragbar mermaid-style-${platform}-button mermaid-style-${platform}-button-two`
minimizeButtonNode.addEventListener('click', () => {
  ipcRenderer.send('minimize');
})

const maximizeButtonNode = document.createElement('div')
maximizeButtonNode.className = `nodragbar mermaid-style-${platform}-button mermaid-style-${platform}-button-three`
maximizeButtonNode.addEventListener('click', () => {
  ipcRenderer.send('maximize');
})

wrapperNode.appendChild(closeButtonNode)
wrapperNode.appendChild(minimizeButtonNode)
wrapperNode.appendChild(maximizeButtonNode)

barNode.style.position = isBarBackground ? 'fixed' : 'absolute'
barNode.appendChild(wrapperNode)

document.body.appendChild(style)
document.body.appendChild(barNode)
