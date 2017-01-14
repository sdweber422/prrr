import request from '../request'
import state from '../state'
import loadPrrrs from './loadPrrrs'
import Visibility from 'visibilityjs'

const POLLING_DELAY = 1000

const pullForPrrs = function(){
  if (Visibility.hidden()) return scheduleNextLoad()
  return loadPrrrs()
    .then(prrrs => {
      scheduleNextLoad()
      return prrrs
    })
    .catch(error => {
      scheduleNextLoad()
      throw error
    })
}

let timeout
const scheduleNextLoad = function(){
  clearTimeout(timeout)
  timeout = setTimeout(pullForPrrs, POLLING_DELAY)
}

// pullForPrrs()
loadPrrrs()


window.DEBUG = window.DEBUG || {}
window.DEBUG.stopPollingForPrrs = function(){
  clearTimeout(timeout)
}
