const InstituicaoService = require('../services/instituicaoService')

class InstituicaoController {
    static async getAll(req, res, next) {
        try {
            const instituicoes = await InstituicaoService.getAll()
            res.status(200).json(instituicoes)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params
            const instituicao = await InstituicaoService.getById(id)
            res.status(200).json(instituicao)
        } catch (error) {
            next(error)
        }
    }

    static async getByName(req, res, next) {
        try {
            const { nome } = req.params
            const instituicao = await InstituicaoService.getByName(nome)
            res.status(200).json(instituicao)
        } catch (error) {
            next(error)
        }
    }

    static async getByCidade(req, res, next) {
        try {
            const { cidade } = req.params
            const instituicoes = await InstituicaoService.getByCidade(cidade)
            res.status(200).json(instituicoes)
        } catch (error) {
            next(error)
        }
    }

    static async createInstituicao(req, res, next) {
        try {
            const id = await InstituicaoService.createInstituicao(req.body)
            res.status(201).json({ message: 'Instituição criada com sucesso', id })
        } catch (error) {
            next(error)
        }
    }

    static async updateInstituicao(req, res, next) {
        try {
            const { id } = req.params
            await InstituicaoService.updateInstituicao(id, req.body)
            res.status(200).json({ message: 'Instituição atualizada com sucesso' })
        } catch (error) {
            next(error)
        }
    }

    static async deleteInstituicao(req, res, next) {
        try {
            const { id } = req.params
            await InstituicaoService.deleteInstituicao(id)
            res.status(200).json({ message: 'Instituição excluída com sucesso' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = InstituicaoController