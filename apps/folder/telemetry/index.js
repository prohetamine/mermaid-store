const fs = require('fs')
    , path = require('path')
    , jsonfile = require('jsonfile')

const config = {
  repo: path.dirname(__dirname).match(/[^\/]+$/)[0],
  app: path.basename(__dirname),
  port: 6969,
  serverPort: 8989,
  size: 1
}

const AppChannel = require('./../../../castum_modules/node-mermaid-extension/app-channel')(config)
    , AppTransportChannel = require('./../../../castum_modules/node-mermaid-extension/app-transport-channel')(config)
    , parser = require('./../../../castum_modules/node-mermaid-extension/parser')

AppChannel.on('connect', () => {
  AppTransportChannel.on('connect', () => {
    const basePath = path.join(__dirname, 'database')

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath)
    }

    AppChannel.on('data', data => {
      const fileName = `${data.platform}.json`
          , filePath = path.join(basePath, fileName)

      parser.chaturbate(data, event => {
        //console.log(event)
      })

      parser.xhamsterlive(data, event => {
        
      })

      try {
        const array = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        jsonfile.writeFileSync(filePath, [...array, data], { spaces: 2 })
      } catch (e) {
        jsonfile.writeFileSync(filePath, [data], { spaces: 2 })
      }

      AppTransportChannel.writeData({
        type: 'message',
        data
      })
    })

    AppChannel.on('reload', () => {
      AppTransportChannel.writeData({
        type: 'reload'
      })
    })
  })
})
