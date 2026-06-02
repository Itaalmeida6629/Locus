const ReservasModel = require('../models/reservasModel')
const SalasModel = require('../models/salasModel')
const UserModel = require('../models/userModel')
const status = ['ativa', 'finalizada', 'cancelada']

class ReservasService {

    static async getAll() {
        const reservas = await ReservasModel.findAll()
        if (reservas.length === 0) {
            throw new Error('Nenhuma reserva encontrada')
        }
        return reservas
    }

    static async getBySalaId(sala_id) {
        const reservas = await ReservasModel.findBySalaId(sala_id)
        if (reservas.length === 0) {
            throw new Error('Nenhuma reserva encontrada para a sala especificada')
        }
        return reservas
    }

    static async getById(id) {
        const reserva = await ReservasModel.findById(id)
        if (!reserva) {
            throw new Error('Reserva não encontrada')
        }
        return reserva
    }

    static async getByInstituicao(id_instituicao) {
        const reservas = await ReservasModel.findByInstituicao(id_instituicao)
        if (reservas.length === 0) {
            throw new Error('Nenhuma reserva encontrada para a instituição especificada')
        }
        return reservas
    }

    static async getByUser(id_usuario) {
        const reservas = await ReservasModel.findByUser(id_usuario)
        if (reservas.length === 0) {
            throw new Error('Nenhuma reserva encontrada para o usuário especificado')
        }
        return reservas
    }

    static async createReserva(data) {
        const camposObrigatorios = ['usuario_id', 'sala_id', 'data_reserva', 'status']
        for (const campo of camposObrigatorios) {
            if (data[campo] === undefined || data[campo] === null || (typeof data[campo] === 'string' && !data[campo].trim())) {
                throw new Error(`O campo '${campo}' é obrigatório`)
            }
        }
        const statusNormalizado = data.status.trim().toLowerCase()
        if (!status.includes(statusNormalizado)) {
            throw new Error('Status inválido')
        }

        const salaExiste = await SalasModel.findById(data.sala_id)
        if (!salaExiste) {
            throw new Error('Sala não encontrada')
        }
        const usuarioExiste = await UserModel.findById(data.usuario_id)
        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado')
        }
        const dataReserva = new Date(data.data_reserva)
        const dataAtual = new Date()
        if (isNaN(dataReserva.getTime()) || dataReserva.getTime() < dataAtual.getTime()) {
            throw new Error('Data de reserva inválida. A data deve ser futura.')
        }
        const salaReservada = await ReservasModel.findBySalaId(data.sala_id)
        const listaReservas = Array.isArray(salaReservada) ? salaReservada : []
        const conflitoReserva = listaReservas.some(reserva => {
            const reservaData = new Date(reserva.data_reserva)
            return (
                (reserva.status.toLowerCase() === 'ativa') &&
                reservaData.getTime() === dataReserva.getTime()
            )
        })
        if (conflitoReserva) {
            throw new Error('A sala já está reservada para a data e hora especificadas')
        }

        const reservaId = await ReservasModel.createReserva({
            ...data,
            status: statusNormalizado
        })
        return await this.getById(reservaId)
    }

    static async updateReserva(id, data) {
        const reservaExistente = await ReservasModel.findById(id)
        if (!reservaExistente) {
            throw new Error('Reserva não encontrada')
        }

        const payload = { ...data }
        if (payload.status !== undefined) {
            const statusNormalizado = payload.status.trim().toLowerCase()
            if (!status.includes(statusNormalizado)) {
                throw new Error('Status inválido')
            }
            payload.status = statusNormalizado
        }

        if (payload.usuario_id !== undefined) {
            const usuarioExiste = await UserModel.findById(payload.usuario_id)
            if (!usuarioExiste) {
                throw new Error('Usuário não encontrado')
            }
        }
        if (payload.data_reserva !== undefined || payload.sala_id !== undefined) {
            const salaIdAlvo = payload.sala_id !== undefined ? payload.sala_id : reservaExistente.sala_id
            const salaExistente = await SalasModel.findById(salaIdAlvo)
            if (!salaExistente) {
                throw new Error('Sala não encontrada')
            }

            const dataReserva = new Date(payload.data_reserva ?? reservaExistente.data_reserva)
            const dataAtual = new Date()
            if (isNaN(dataReserva.getTime()) || dataReserva.getTime() < dataAtual.getTime()) {
                throw new Error('Data de reserva inválida. A data deve ser futura.')
            }

            const salaReservada = await ReservasModel.findBySalaId(salaIdAlvo)
            const listaReservas = Array.isArray(salaReservada) ? salaReservada : []
            const conflitoReserva = listaReservas.some(reserva => {
                const reservaData = new Date(reserva.data_reserva)
                return (
                    reserva.id !== Number(id) &&
                    reserva.status.toLowerCase() === 'ativa' &&
                    reservaData.getTime() === dataReserva.getTime()
                )
            })
            if (conflitoReserva) {
                throw new Error('A sala já está reservada para a data e hora especificadas')
            }
        }
        return await ReservasModel.updateReserva(id, payload)
    }

    static async deleteReserva(id) {
        const reservaExistente = await ReservasModel.findById(id)
        if (!reservaExistente) {
            throw new Error('Reserva não encontrada')
        }
        return await ReservasModel.deleteReserva(id)
    }
}

module.exports = ReservasService