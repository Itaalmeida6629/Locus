const InstituicaoModel = require("../models/InstituicaoModel")
const validarCamposEnderecoETelefone = require("../utils/validacoes")

class InstituicaoService {
    static async getAll() {
        const instituicoes = await InstituicaoModel.findAll()
        if (instituicoes.length === 0) {
            throw new Error('Nenhuma instituição encontrada')
        }
        return instituicoes
    }

    static async getById(id) {
        const instituicao = await InstituicaoModel.findById(id)
        if (!instituicao) {
            throw new Error('Instituição não encontrada')
        }
        return instituicao
    }

    static async getByName(nome) {
        const instituicao = await InstituicaoModel.findByName(nome)
        if (!instituicao) {
            throw new Error('Instituição não encontrada')
        }
        return instituicao
    }

    static async getByCidade(cidade) {
        const instituicoes = await InstituicaoModel.findByCidade(cidade)
        if (instituicoes.length === 0) {
            throw new Error('Nenhuma instituição encontrada para a cidade informada')
        }
        return instituicoes 
    }

    static async createInstituicao(data) {
        const camposObrigatorios = ['nome', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'telefone', 'cep']
            for (const campo of camposObrigatorios) {
        if (data[campo] === undefined || data[campo] === null || (typeof data[campo] === 'string' && !data[campo].trim())) {
            throw new Error(`O campo '${campo}' é obrigatório`)
    }
}
        const nomeNormalizado = data.nome.trim().toLowerCase()
        const existe = await InstituicaoModel.findByName(nomeNormalizado)
        if (existe) {
            throw new Error('Instituição já cadastrada')
        }
        validarCamposEnderecoETelefone(data)

        return await InstituicaoModel.createInstituicao(data)
    }

    static async updateInstituicao(id, data) {
        const notFind = await InstituicaoModel.findById(id)
        if (!notFind) {
            throw new Error('Instituição não encontrada')
        }
        const payload = { ...data }
        if (Object.keys(payload).length === 0) {
            throw new Error('Nenhum campo para atualizar')
        }
        if (payload.nome) {
            const nomeNormalizado = payload.nome.trim().toLowerCase()
            const existe = await InstituicaoModel.findByName(nomeNormalizado)
            if (existe && existe.id !== id) {
                throw new Error('Instituição já cadastrada')
            }}
        validarCamposEnderecoETelefone(payload)
        return await InstituicaoModel.updateInstituicao(id, payload)
    }

    static async deleteInstituicao(id) {
        const notFind = await InstituicaoModel.findById(id)
        if (!notFind) {
            throw new Error('Instituição não encontrada')
        }
        return await InstituicaoModel.deleteInstituicao(id)
    }
}

module.exports = InstituicaoService