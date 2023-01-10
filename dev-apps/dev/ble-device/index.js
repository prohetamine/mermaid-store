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

AppChannel.on('connect', () => {
  AppTransportChannel.on('connect', () => {
    console.log('connect!!!!!!')

    AppTransportChannel.on('readData', data => {
      console.log(data)
    })

    /*setTimeout(() => {
      AppTransportChannel.openWindow({
        file: 'settings.html',
        width: 300,
        height: 400,
        alwaysOnTop: true
      })
    }, 10000)*/

    /*AppChannel.on('status', data => {
      AppTransportChannel.writeData({
        type: 'status',
        data
      })
    })*/

    AppChannel.on('data', data => {
      AppTransportChannel.writeData({
        type: 'message',
        data
      })
    })
  })
})
