const SalasService = require('../services/salasService')

class SalasController {
    static async getSalasByInstituicao(req, res, next) {
        try {
            const { instituicao_id } = req.params
            const salas = await SalasService.getSalasByInstituicao(instituicao_id)
            res.status(200).json(salas)
        } catch (error) {
            next(error)
        }
    }

    static async getSalaById(req, res, next) {
        try {
            const { id } = req.params
            const sala = await SalasService.getSalaById(id)
            res.status(200).json(sala)
        } catch (error) {
            next(error)
        }
    }

    static async createSala(req, res, next) {
        try {
            const id = await SalasService.createSala(req.body)
            res.status(201).json({ message: 'Sala criada com sucesso', id })
        } catch (error) {
            next(error)
        }
    }

    static async updateSala(req, res, next) {
        try {
            const { id } = req.params
            await SalasService.updateSala(id, req.body)
            res.status(200).json({ message: 'Sala atualizada com sucesso' })
        } catch (error) {
            next(error)
        }
    }

    static async deleteSala(req, res, next) {
        try {
            const { id } = req.params
            await SalasService.deleteSala(id)
            res.status(200).json({ message: 'Sala deletada com sucesso' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = SalasController