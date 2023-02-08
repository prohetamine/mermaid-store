const express             = require('express')
    , path                = require('path')
    , NodeMermaid         = require('node-mermaid')
    , NodeMermaidStore    = require('node-mermaid/store')
    , ElectronApp         = require('./electron-app')
    , fixForWindows       = require('./libs/fix-for-windows')

;(async () => {
  const server = express()

  await fixForWindows()

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

  const { mainWindow, otherWindow, readmeWindow, browserProtocol } = await ElectronApp()

  const options = {
    search: MS.search
  }

  browserProtocol(options)

  const _readmeWindow = readmeWindow(options)

  MS.on('open-window', otherWindow)
  MS.on('open-readme', _readmeWindow)

  server.use('/build', express.static(path.resolve(__dirname, '..', 'front', 'build')))
  server.listen(8989, () => mainWindow())
})()
