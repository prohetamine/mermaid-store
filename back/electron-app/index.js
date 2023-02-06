const { app, BrowserWindow }   = require('electron')
    , updateElectronApp        = require('update-electron-app')
    , readmeWindow             = require('./readme-window')
    , otherWindow              = require('./other-window')
    , mainWindow               = require('./main-window')

updateElectronApp()

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
    readmeWindow
  }
}
