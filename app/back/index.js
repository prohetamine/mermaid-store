const express             = require('express')
    , cors                = require('cors')
    , path                = require('path')
    , NodeMermaid         = require('node-mermaid')
    , NodeMermaidStore    = require('node-mermaid/store')
    , ElectronApp         = require('./electron-app')
    , sleep               = require('sleep-promise')

;(async () => {
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
  MS.AppChannel.on('sendMessages', NME.sendMessages)

  NME.on('data', data =>
    MS.AppChannel.writeData('data', data)
  )

  NME.on('status', status =>
    MS.AppChannel.writeData('status', status)
  )

  const { mainWindow, otherWindow, readmeWindow, focus } = await ElectronApp()

  const _readmeWindow = readmeWindow({
    search: MS.search
  })

  MS.on('open-window', otherWindow)
  MS.on('open-readme', _readmeWindow)

  server.use(cors())

  server.use('/build', express.static(path.resolve(__dirname, '..', 'front', 'build')))
  server.listen(8989, async () => {
    await mainWindow()

    await sleep(1000)

    server.get('/link', (req, res) => {
      focus()
      if (req.query.search) {
        MS.search(req.query.search)
      }

      res.end('ok')
    })
  })
})()
