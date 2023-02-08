const kill = require('kill-port')

module.exports = async () => {
  try {
    await kill(6767, 'tcp')
  } catch (e) {}

  try {
    await kill(6767, 'udp')
  } catch (e) {}
}
