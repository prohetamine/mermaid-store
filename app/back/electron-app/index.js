const { app, BrowserWindow, dialog }   = require('electron')
    //, updateElectronApp       = require('update-electron-app')
    , readmeWindow             = require('./readme-window')
    , otherWindow              = require('./other-window')
    , mainWindow               = require('./main-window')
    , os                       = require('os')
    , qs                       = require('querystringify')

//updateElectronApp()

global.isDev = false

global.electronApp = app

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

module.exports = async () => {
  if (os.platform() === 'darwin' || os.platform() === 'linux') {
    await app.whenReady()

    global.electronApp.setAsDefaultProtocolClient('mermaid-store')

    return {
      mainWindow: () => {
        mainWindow()

        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow()
          }
        })
      },
      browserProtocol: ({ search }) => {
        global.electronApp.on('open-url', (_, url) => {
          const query = qs.parse(url.replace(/mermaid-store:\/\//, ''))

          if (query.search) {
            search(query.search)
          }
        })
      },
      otherWindow,
      readmeWindow
    }
  } else {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore()
          mainWindow.focus()
        }

        const win = global.mainWindowGlobalControll
        if (win.isDestroyed()) {
          if (win.isMinimized()) {
            win.restore()
          }
          win.focus()
        }
        dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
      })

      return {
        mainWindow: () => {
          mainWindow()

          app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
              mainWindow()
            }
          })
        },
        browserProtocol: ({ search }) => {
          global.electronApp.on('open-url', (_, url) => {
            const query = qs.parse(url.replace(/mermaid-store:\/\//, ''))

            if (query.search) {
              search(query.search)
            }
          })
        },
        otherWindow,
        readmeWindow
      }
    }
  }
}
