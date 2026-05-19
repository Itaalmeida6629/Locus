const SalasModel = require('../models/salasModel')
const tipos = ['sala de aula', 'laboratório', 'auditório']

class SalasService {
    static async getSalasByInstituicao(instituicaoId) {
        const salas = await SalasModel.getSalasByInstituicao(instituicaoId)
        if (salas.length === 0) {
            throw new Error('Nenhuma sala encontrada para esta instituição')
        }
        return salas
    }

    static async getSalaById(id) {
        const sala = await SalasModel.findById(id)
        if (!sala) {
            throw new Error('Sala não encontrada')
        }
        return sala
    }

    static async createSala(data) {
        const camposObrigatorios = ['tipo', 'capacidade', 'instituicao_id']
        for (const campo of camposObrigatorios) {
            if (data[campo] === undefined || data[campo] === null || (typeof data[campo] === 'string' && !data[campo].trim())) {
                throw new Error(`O campo '${campo}' é obrigatório`);
            }
        }
        if (typeof data.capacidade !== 'number' || data.capacidade <= 0) {
            throw new Error('A capacidade deve ser um número positivo')
        }
        if (typeof data.tipo !== 'string' || !data.tipo.trim()) {
            throw new Error('O tipo da sala deve ser uma string não vazia')
        }
        const tipoNormalizado = data.tipo.trim().toLowerCase()
        if (!tipos.includes(tipoNormalizado)) {
            throw new Error('O tipo da sala deve ser "sala de aula", "laboratório" ou "auditório"')
        }
        
        if (isNaN(data.instituicao_id) || data.instituicao_id <= 0) {
            throw new Error('O ID da instituição deve ser um número positivo')
        }

        return await SalasModel.createSala({ ...data, tipo: tipoNormalizado })
    }

    static async updateSala(id, data) {
        const salaExistente = await SalasModel.findById(id)
        if (!salaExistente) {
            throw new Error('Sala não encontrada')
        }
        const payload = { ...data }
        if (payload.capacidade !== undefined) {
            if (typeof payload.capacidade !== 'number' || payload.capacidade <= 0) {
                throw new Error('A capacidade deve ser um número positivo')
            }
        }
        if (payload.tipo !== undefined) {
            if (typeof payload.tipo !== 'string' || !payload.tipo.trim()) {
                throw new Error('O tipo da sala deve ser uma string não vazia')
            }
            const tipoNormalizado = payload.tipo.trim().toLowerCase()
            if (!tipos.includes(tipoNormalizado)) {
                throw new Error('O tipo da sala deve ser "sala de aula", "laboratório" ou "auditório"')
            }
            payload.tipo = tipoNormalizado
        }
        if (payload.instituicao_id !== undefined) {
            throw new Error('Não é permitido alterar a instituição da sala')
        }
        return await SalasModel.updateSala(id, payload)
    }

    static async deleteSala(id) {
        const salaExistente = await SalasModel.findById(id)
        if (!salaExistente) {
            throw new Error('Sala não encontrada')
        }
        return await SalasModel.deleteSala(id)
    }
}

module.exports = SalasService