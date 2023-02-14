const { app, BrowserWindow }   = require('electron')
    //, updateElectronApp       = require('update-electron-app')
    , readmeWindow             = require('./readme-window')
    , otherWindow              = require('./other-window')
    , mainWindow               = require('./main-window')
    , os                       = require('os')
//updateElectronApp()

global.isDev = false

global.electronApp = app

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

module.exports = async () => {
  await app.whenReady()

  return {
    mainWindow: () => {
      mainWindow()

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          mainWindow()
        }
      })
    },
    otherWindow,
    readmeWindow,
    focus: () => {
      app.focus({
        steal: true
      })

      const platform = os.platform()

      if (!(platform === 'darwin' || platform === 'linux')) {
        global.instanceMainWindow.minimize()
        global.instanceMainWindow.focus()
      }
    }
  }
}
