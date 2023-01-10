const path = require('path')

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
    AppChannel.on('data', data => {
      parser.chaturbate(data, parsedData => {
        if (parsedData.method === 'onNotify' && parsedData.type === 'tip_alert') {
          AppTransportChannel.writeData({
            type: 'tip-message',
            data: parsedData
          })
        }
      })

      parser.xhamsterlive(data, parsedData => {
        if (parsedData.subscriptionKey === 'newChatMessage' && parsedData.type === 'tip') {
          AppTransportChannel.writeData({
            type: 'tip-message',
            data: parsedData
          })
        }
      })

      parser.stripchat(data, parsedData => {
        if (parsedData.subscriptionKey === 'newChatMessage' && parsedData.type === 'tip') {
          AppTransportChannel.writeData({
            type: 'tip-message',
            data: parsedData
          })
        }
      })
    })

    AppChannel.on('reload', () => {
      AppTransportChannel.writeData({
        type: 'reload'
      })
    })
  })
})
