import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import mongoose from 'mongoose'
import router from './router/index'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import logger from './logger'

dotenv.config()

const app = express()

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const server = http.createServer(app)

server.listen(8080, () => {
    logger.info('Server running on http://localhost:8080')
})

const MONGO_URL = process.env.MONGO_URL

mongoose.Promise = Promise
mongoose.connect(MONGO_URL as string)
mongoose.connection.on('error', (error: Error) => logger.error(error))

mongoose.connection.on('connected', () => {
    logger.info('Connected to MongoDB')
})

mongoose.connection.on('error', (error: Error) => {
    logger.error('MongoDB connection error:', error)
})

app.use('/', router())

export default app
