import socket from '../socket'

export default function archivePrrr(prrrId) {
  socket.emit('archive', {id:prrrId})
}
