const { BrowserWindow, ipcMain }  = require('electron')
    , path                        = require('path')

module.exports = windowConfig => {
  const { url, proportions } = windowConfig

  const config = {
    icon: path.join(__dirname, '..', '..', '..', 'resources', 'icon.png'),
    ...windowConfig,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload-ui-styles.js')
    },
    frame: false
  }

  const win = new BrowserWindow(config)

  const minimize = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      win.minimize()
    }
  }

  const maximize = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      win.maximize()
    }
  }

  const unmaximize = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      win.unmaximize()
    }
  }

  const isMaximized = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      event.reply('isMaximized', win.isMaximized())
    }
  }

  const close = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      ipcMain.removeListener('exit', close)
      ipcMain.removeListener('minimize', minimize)
      ipcMain.removeListener('maximize', unmaximize)
      ipcMain.removeListener('unmaximize', unmaximize)
      ipcMain.removeListener('isMaximized', isMaximized)
      win.close()
    }
  }

  ipcMain.on('minimize', minimize)
  ipcMain.on('maximize', maximize)
  ipcMain.on('unmaximize', unmaximize)
  ipcMain.on('isMaximized', isMaximized)
  ipcMain.on('exit', close)

  if (proportions) {
    let width = 0

    win.on('will-resize', (event, newBounds) => {
      width = newBounds.width
    })

    win.on('resized', () => {
      if (!win.isMaximized()) {
        win.setSize(width, parseInt(width / 1.79545455), true)
      }
    })
  }

  win.loadURL(url)
}
