import './environment'
import path from 'path'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import passport from 'passport'
import cookieSession from 'cookie-session'
import http from 'http'

const publicPath = path.resolve(__dirname, '../public')
const server = express()

if (process.env.NODE_ENV !== 'test') server.use(logger('dev'))

if (process.env.NODE_ENV === 'test')
  process.env.SESSION_KEY = 'FAKE_TEST_SESSION_KEY'

server.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}))
server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(publicPath))
server.use(bodyParser.json())

server.use(require('./authentication'))
server.use('/api', require('./api'))

server.get('/*', (req, res, next) => {
  if (req.xhr) return next()
  res.sendFile(publicPath+'/index.html')
});

server.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

server.start = function(port, callback){
  server.set('port', port)
  console.log(`http://localhost:${port}/`)
  const httpServer = http.createServer(server)
  httpServer.listen(port, callback)
  return httpServer
}

if (process.env.NODE_ENV !== 'test'){
  server.start(process.env.PORT || '3000')
}

export default server
