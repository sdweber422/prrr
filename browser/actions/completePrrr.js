import socket from '../socket'

export default function completePrrr(prrrId) {
  socket.emit('completePrrr', {prrrId})
}
