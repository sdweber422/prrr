import path from 'path'
import winston from 'winston'

process.env.LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development'
  ? 'silly'
  : 'warn'
)
const LOG_DIRECTORY = path.resolve(__dirname, '../../log')

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'white',
  verbose: 'grey',
  debug: 'blue',
  silly: 'green',
});

const logger = new winston.Logger()

logger.add(
  winston.transports.Console,
  {
    colorize: true,
    timestamp: _ => Date.now(),
  }
)

if (process.env.NODE_ENV !== 'production'){
  logger.add(
    winston.transports.File,
    {
      filename: path.resolve(LOG_DIRECTORY, `${process.env.NODE_ENV}.log`)
    }
  )
}

logger.exitOnError = false

logger.level = process.env.LOG_LEVEL

logger.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
}

export default logger
