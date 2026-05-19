require('dotenv').config()
const app = require('./src/app')
const initAdmin = require('./src/config/initAdmin')
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    await initAdmin()
})