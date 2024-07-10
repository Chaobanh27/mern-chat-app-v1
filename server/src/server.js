import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import routes from '~/routes/v1/index'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import logger from '~/config/logger'
import { env } from '~/config/environment.js'
import SocketServer from './sockets/SocketServer'
import { corsOptions } from './config/cors'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'


//create express app
const app = express()

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

//morgan
if (env.BUILD_MODE !== 'production') {
  app.use(morgan('dev'))
}

//helmet
app.use(helmet())

//parse json request url
app.use(express.json())

//parse json request body
app.use(express.urlencoded({ extended: true }))

//sanitize request data
app.use(mongoSanitize())

//enable cookie parser
app.use(cookieParser())

//gzip compression
app.use(compression())

//file upload
app.use(
  fileUpload({
    useTempFiles: true
  })
)

//cors
app.use(cors(corsOptions))

//api v1 routes
app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandlingMiddleware)

//error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})


let server = app.listen(env.LOCAL_DEV_APP_PORT, () => {
  logger.info(`Server is listening at ${env.LOCAL_DEV_APP_PORT}.`)
})


//exit on mognodb error
mongoose.connection.on('error', (err) => {
  logger.error(`Mongodb connection error : ${err}`)
  process.exit(1)
})

//mongodb debug mode
// if (process.env.BUILD_MODE !== 'production') {
//   mongoose.set('debug', true)
// }

//mongodb connection
mongoose
  .connect(env.MONGODB_URI, {})
  .then(() => {
    logger.info('Connected to Mongodb.')
  })


//socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: corsOptions
})

io.on('connection', (socket) => {
  logger.info('socket io connected successfully')
  SocketServer(socket, io)
})

//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info('Server closed.')
    process.exit(1)
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}
process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

//SIGTERM
process.on('SIGTERM', () => {
  if (server) {
    logger.info('Server closed.')
    process.exit(1)
  }
})

