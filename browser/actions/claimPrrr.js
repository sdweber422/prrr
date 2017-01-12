import socket from '../socket'

export default function claimPrrr(prrrId) {
  socket.emit('claimPrrr', {prrrId})
}
