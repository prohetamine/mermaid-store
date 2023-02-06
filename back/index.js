const { app, BrowserWindow }  = require('electron')
    , path                    = require('path')
    , express                 = require('express')
    , os                      = require('os')

const NodeMermaid             = require('node-mermaid')
    , NodeMermaidStore        = require('node-mermaid/store')

const isDev = false

const isMacOS = os.platform() === 'darwin'

const MainWindow = () => {
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
      symbolColor: '#fff',
      borderRadius: 8
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

const MermaidWindow = windowConfig => {
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

const MermaidReadmeWindow = url => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: 900,
    height: 700
  })

  win.loadURL(
    isDev
      ? `http://localhost:3000?readme=${url}`
      : `http://localhost:8989/build?readme=${url}`
  )
}

app.whenReady().then(async () => {
  const server = express()

  const NME = NodeMermaid({
    port: 6767,
    debug: false
  })

  const MS = await NodeMermaidStore({
    port: 6969,
    debug: false
  })

  await NME.ready()
  await MS.ready()

  MS.AppChannel.on('sendMessage', NME.sendMessage)

  NME.on('data', data =>
    MS.AppChannel.writeData('data', data)
  )

  NME.on('status', status =>
    MS.AppChannel.writeData('status', status)
  )

  MS.on('open-window', MermaidWindow)
  MS.on('open-readme', MermaidReadmeWindow)

  server.use('/build', express.static(path.resolve(__dirname, '..', 'front', 'build')))
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
