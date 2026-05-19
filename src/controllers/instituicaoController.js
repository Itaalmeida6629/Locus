const InstituicaoService = require('../services/instituicaoService')

class InstituicaoController {
    static async getAll(req, res) {
        try {
            const instituicoes = await InstituicaoService.getAll()
            res.status(200).json(instituicoes)
        }
        catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params
            const instituicao = await InstituicaoService.getById(id)
            res.status(200).json(instituicao)
        }
        catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async getByName(req, res) {
        try {
            const { nome } = req.params
            const instituicao = await InstituicaoService.getByName(nome)
            res.status(200).json(instituicao)
        }
        catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async getByCidade(req, res) {
        try {
            const { cidade } = req.params
            const instituicoes = await InstituicaoService.getByCidade(cidade)
            res.status(200).json(instituicoes)
        }
        catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async create(req, res) {
        try {
            const id = await InstituicaoService.create(req.body)
            res.status(201).json({ message: 'Instituição criada com sucesso', id })
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params
            await InstituicaoService.update(id, req.body)
            res.status(200).json({ message: 'Instituição atualizada com sucesso' })
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params
            await InstituicaoService.delete(id)
            res.status(200).json({ message: 'Instituição excluída com sucesso' })
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
}

module.exports = InstituicaoController