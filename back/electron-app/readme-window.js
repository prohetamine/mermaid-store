const { BrowserWindow, ipcMain }   = require('electron')
    , path                         = require('path')

module.exports = url => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: 900,
    height: 700,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

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

  const close = event => {
    if (!win.isDestroyed() && event.sender.id === win.id) {
      ipcMain.removeListener('exit', close)
      ipcMain.removeListener('minimize', minimize)
      ipcMain.removeListener('maximize', unmaximize)
      ipcMain.removeListener('unmaximize', unmaximize)
      win.close()
    }
  }

  ipcMain.on('minimize', minimize)
  ipcMain.on('maximize', maximize)
  ipcMain.on('unmaximize', unmaximize)
  ipcMain.on('exit', close)

  win.loadURL(
    global.isDev
      ? `http://localhost:3000?readme=${url}`
      : `http://localhost:8989/build?readme=${url}`
  )
}