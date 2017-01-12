import socket from '../socket'

export default function logout() {
  socket.emit('logout')
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/logout')
  xhr.send()
}
