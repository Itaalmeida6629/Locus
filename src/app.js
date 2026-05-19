const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

const instituicaoRoutes = require('./routes/instituicaoRoutes')
const authRoutes = require('./routes/authRoutes')

app.use('/instituicoes', instituicaoRoutes)
app.use('/auth', authRoutes)

module.exports = app

