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

dotenv.config()

const CSS_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.js'

const app = express()

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
)

const server = http.createServer(app)

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})

const MONGO_URL = process.env.MONGO_URL

mongoose.Promise = Promise
mongoose.connect(MONGO_URL as string)
mongoose.connection.on('error', (error: Error) => console.log(error))

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (error: Error) => {
    console.log('MongoDB connection error:', error)
})

app.use('/', router())

export default app
