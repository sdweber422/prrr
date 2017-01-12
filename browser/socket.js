import state from './state'
const io = require('socket.io-client')
const socket = io.connect(location.origin)

const getPrrrIndex = (prrr) => {
  const prrrs = state.get().prrrs
  const prrrToUpdate = prrrs.find(oldPrrr => {
    return prrr.id === oldPrrr.id
  })
  const prrrIndex = prrrs.indexOf(prrrToUpdate)

  return prrrIndex
}

socket.on('errorReport', function(payload){
  console.log('SOCKET ERROR REPORT', payload)
})

socket.on('updateSession', function(session){
  state.set({session})
})

socket.on('initialPrrrs', function(prrrs){
  state.set({prrrs})
})

socket.on('broadcastToAll', function(prrr){
  const prrrs = state.get().prrrs
  const index = getPrrrIndex(prrr)
  prrrs.splice(index, 1, prrr)
  state.set({prrrs})
})

socket.on('newPrrr', function(prrr){
  const prrrs = state.get().prrrs
  prrrs.push(prrr)
  state.set({prrrs})
})

socket.on('removePrrr', function(prrr){
  const prrrs = state.get().prrrs
  const index = getPrrrIndex(prrr)
  prrrs.splice(index, 1)
  state.set({prrrs})
})

socket.on('prrrClaimedByYou', function(prrr){
  const url = `https://github.com/${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
  const popup = window.open(url, '_blank')
   if (popup) popup.focus()
})

module.exports = socket
