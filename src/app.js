const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

const instituicaoRoutes = require('./routes/instituicaoRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/usuarios', userRoutes)
app.use('/instituicoes', instituicaoRoutes)

app.use(errorMiddleware)

module.exports = app

