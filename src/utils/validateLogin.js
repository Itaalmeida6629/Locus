function validateLogin(body) {
    if (!body) {
        return 'Corpo da requisição é obrigatório'
    }

    const { email, senha_hash } = body

    if (!email) {
        return 'email é obrigatório'
    }

    if (!senha_hash) {
        return 'senha é obrigatória'
    }

    if (typeof email !== 'string') {
        return 'email deve ser string'
    }

    if (typeof senha_hash !== 'string') {
        return 'senha deve ser string'
    }

    return null
}

module.exports = validateLogin