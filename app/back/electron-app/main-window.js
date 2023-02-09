const { BrowserWindow, ipcMain }   = require('electron')
    , path                         = require('path')

module.exports = () => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, '..', '..', '..', 'resources', 'icon.png'),
    width: 852,
    height: 700,
    minWidth: 652,
    maxWidth: 1252,
    frame: false,
    show: false,
    maximizable:false,
    fullscreen: false,
    fullscreenable: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  global.instanceMainWindow = win

  win.once('ready-to-show', () => {
    setTimeout(() => {
      win.show()
    }, 2500)
  })

  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    console.log(deviceList)
    if (deviceList && deviceList.length > 0) {
      callback(deviceList[0].deviceId)
    }
  })

  ipcMain.on('exit', event => {
    if (event.sender.id === win.id) {
      win.close()
      global.electronApp.exit()
    }
  })

  ipcMain.on('minimize', event => {
    if (event.sender.id === win.id) {
      win.minimize()
    }
  })

  win.loadURL(global.isDev ? 'http://localhost:3000' : 'http://localhost:8989/build')

  const sizes = Array(5).fill(652).map((minimalWidth, i) => minimalWidth + (200 * i))

  const size = {
    width: 852,
    height: 700
  }

  win.on('will-resize', (event, newBounds) => {
    const width = sizes.map(width => [width, Math.abs(width - newBounds.width)]).sort((a, b) => a[1] - b[1])[0][0]
    size.width = width
    size.height = newBounds.height
  })

  win.on('resized', () => {
    win.setSize(size.width, size.height, true)
  })
}
