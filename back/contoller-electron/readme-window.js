const { BrowserWindow }   = require('electron')
    , path                = require('path')

module.exports = url => {
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: 900,
    height: 700
  })

  win.loadURL(
    global.isDev
      ? `http://localhost:3000?readme=${url}`
      : `http://localhost:8989/build?readme=${url}`
  )
}
