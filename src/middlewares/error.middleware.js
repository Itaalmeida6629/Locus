function errorMiddleware(err, req, res, next) {
    let statusCode = 400
    let message = err.message

    if (message.includes('não encontrado') || message.includes('Nenhum')) {
        statusCode = 404
    } else if (message.includes('Acesso negado') || message.includes('inválido')) {
        statusCode = 403
    }

    if (!err.message || err.sqlState) { 
        statusCode = 500
        message = 'Erro interno do servidor'
        console.error(' Erro de Infra/Banco:', err)
    }

    return res.status(statusCode).json({ message })
}

module.exports = errorMiddleware;