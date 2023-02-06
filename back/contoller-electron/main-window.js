const { BrowserWindow, ipcMain }   = require('electron')
    , path                         = require('path')
    , os                           = require('os')

const isMacOS = os.platform() === 'darwin'

module.exports = () => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'app-icon.png'),
    width: 852,
    height: 700,
    minWidth: 652,
    maxWidth: 1252,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#4C9AF1',
      symbolColor: '#fff'
    },
    fullscreen: false,
    fullscreenable: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    console.log(deviceList)
    if (deviceList && deviceList.length > 0) {
      callback(deviceList[0].deviceId)
    }
  })

  ipcMain.on('setWindowButtonVisibility', (e, isVisibility) => {
    if (isMacOS) {
      win.setWindowButtonVisibility(isVisibility)
    } else {
      // windows ?????
    }
  })

  win.loadURL(global.isDev ? 'http://localhost:3000' : 'http://localhost:8989/build')

  const sizes = Array(20).fill(652).map((minimalWidth, i) => minimalWidth + (200 * i))

  const size = {
    width: 852,
    height: 600
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
