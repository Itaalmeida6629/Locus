const validateTelefone = require('./validateTelefone')
const validateString = require('./validateString')

function validarCamposEnderecoETelefone(payload) {
    const regrasCampos = {
        nome: { min: 2, max: 100, label: 'Nome' },
        rua: { min: 2, max: 100, label: 'Rua' },
        numero: { min: 1, max: 20, label: 'Número' },
        bairro: { min: 2, max: 50, label: 'Bairro' },
        cidade: { min: 2, max: 50, label: 'Cidade' },
        estado: { min: 2, max: 2, label: 'Estado' },
        cep: { min: 8, max: 10, label: 'CEP' }
    }

    for (const campo in payload) {
        if (regrasCampos[campo]) {
            const { min, max, label } = regrasCampos[campo]
            const error = validateString(payload[campo], { min, max, fieldName: label })
            if (error) throw new Error(error)
        }
    }

    if (payload.telefone && !validateTelefone(payload.telefone)) {
        throw new Error('Telefone inválido')
    }
}

module.exports = validarCamposEnderecoETelefone