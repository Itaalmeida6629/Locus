const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token não fornecido' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' })
        req.user = user
        next()
    })
}

function authorizeRole(tipo) {
    return (req, res, next) => {
        if (req.user.tipo !== tipo) {
            return res.status(403).json({ message: 'Acesso negado: função insuficiente' })
        }
        next()
    }
}

module.exports = { authenticateToken, authorizeRole }