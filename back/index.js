const { app, BrowserWindow }  = require('electron')
    , path                    = require('path')
    , express                 = require('express')
    , fs                      = require('fs')
    , cors                    = require('cors')

const isDev = true

const NodeMermaid = require('node-mermaid')
    , NodeMermaidStore = require('node-mermaid/store')

const MainWindow = () => {
  const win = new BrowserWindow({
    width: 852,
    height: 600,
    minWidth: 652,
    maxWidth: 1252,
    titleBarStyle: 'hidden',
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

  win.loadURL(isDev ? 'http://localhost:3000' : 'http://localhost:8989/build')

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

const MermaidWindow = ({ url, width, height, titleBarStyle, alwaysOnTop, frame, proportions }) => {
  const win = new BrowserWindow({
    width,
    height,
    alwaysOnTop,
    titleBarStyle,
    frame,
    proportions,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

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

app.whenReady().then(async () => {
  const server = express()

  const NME = NodeMermaid({
    port: 6767,
    debug: false
  })

  const MS = NodeMermaidStore({
    port: 6969,
    debug: false,
    basePath: path.join(__dirname, '..', '____IN_APPLICATION____')
  })

  await NME.ready()
  await MS.ready()

  MS.execApps()

  NME.on('data', data =>
    MS.AppChannel.writeData('data', data)
  )

  NME.on('status', status =>
    MS.AppChannel.writeData('status', status)
  )

  MS.on('open-window', MermaidWindow)

  server.use('/build', express.static(path.resolve(__dirname, 'front', 'build')))
  server.listen(8989, () => {
    MainWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        MainWindow()
      }
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
