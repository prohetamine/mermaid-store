var qs = require('querystringify')

module.exports = ({ search }) => {
  global.electronApp.setAsDefaultProtocolClient('mermaid-store')

  global.electronApp.on('open-url', (_, url) => {
    const query = qs.parse(url.replace(/mermaid-store:\/\//, ''))

    if (query.search) {
      search(query.search)
    }
  })
}
