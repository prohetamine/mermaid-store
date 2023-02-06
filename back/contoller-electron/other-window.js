const { BrowserWindow }   = require('electron')
    , os                  = require('os')

const isMacOS = os.platform() === 'darwin'

module.exports = windowConfig => {
  const { url, proportions, titleBarStyle } = windowConfig

  const config = {
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    ...windowConfig
  }

  if (titleBarStyle) {
    config.titleBarStyle = isMacOS
                              ? titleBarStyle
                              : 'default'
  }

  const win = new BrowserWindow(config)

  if (proportions) {
    let width = 0

    win.on('will-resize', (event, newBounds) => {
      width = newBounds.width
    })

    win.on('resized', () => {
      win.setSize(width, parseInt(width / 1.79545455), true)
    })
  }

  win.loadURL(url)
}
