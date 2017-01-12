import socket from '../socket'

export default function createPrrr({owner, repo, number}) {
  socket.emit('createPrrr', {owner, repo, number})
}
