import { observable, toJS } from 'mobx'

let pinApps = {}

try {
  pinApps = JSON.parse(localStorage.getItem('pinApps')) || {}
} catch (e) {}


const mainState = observable({
  search: '',
  appsPlayState: true,
  statusWall: {
    repositorys: 0,
    availableApplications: 0,
    installedApplications: 0,
    activeApplications: 0
  },
  isPlayAllApp: false,
  readmeViewerUrl: null,
  pinApps
})

setInterval(() => {
  const pinApps = JSON.stringify(toJS(mainState.pinApps))
  localStorage.setItem('pinApps', pinApps)
}, 10000)

export default mainState
