import socket from '../socket'

export default function unclaimPrrr(prrrId) {
  socket.emit('unclaimPrrr', {prrrId})
}
