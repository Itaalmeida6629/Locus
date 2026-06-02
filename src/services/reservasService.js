const ReservasModel = require('../models/reservasModel')
const SalasModel = require('../models/salasModel')
const UserModel = require('../models/userModel')
const statusPermitidos = ['ativa', 'finalizada']

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
        // Atualizado: agora valida os campos de data_inicio e data_fim
        const camposObrigatorios = ['usuario_id', 'sala_id', 'data_inicio', 'data_fim', 'status']
        for (const campo of camposObrigatorios) {
            if (data[campo] === undefined || data[campo] === null || (typeof data[campo] === 'string' && !data[campo].trim())) {
                throw new Error(`O campo '${campo}' é obrigatório`)
            }
        }
        const statusNormalizado = data.status.trim().toLowerCase()
        if (!statusPermitidos.includes(statusNormalizado)) {
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

        // Conversão e validação das datas informadas
        const inicioNova = new Date(data.data_inicio)
        const fimNova = new Date(data.data_fim)
        const dataAtual = new Date()

        if (isNaN(inicioNova.getTime()) || isNaN(fimNova.getTime())) {
            throw new Error('Formatos de data de início ou fim inválidos.')
        }
        if (inicioNova.getTime() < dataAtual.getTime()) {
            throw new Error('A data de início da reserva deve ser futura.')
        }
        if (fimNova.getTime() <= inicioNova.getTime()) {
            throw new Error('A data de término deve ser posterior à data de início.')
        }

        // Validação de sobreposição de intervalos no mesmo espaço
        const salaReservada = await ReservasModel.findBySalaId(data.sala_id)
        const listaReservas = Array.isArray(salaReservada) ? salaReservada : []

        const conflitoReserva = listaReservas.some(reserva => {
            if (reserva.status.toLowerCase() !== 'ativa') return false

            const reservaInicio = new Date(reserva.data_inicio)
            const reservaFim = new Date(reserva.data_fim)

            // Fórmula matemática para detectar qualquer tipo de intersecção entre horários:
            // (InicioA < FimB) E (FimA > InicioB)
            return (inicioNova.getTime() < reservaFim.getTime() && fimNova.getTime() > reservaInicio.getTime())
        })

        if (conflitoReserva) {
            throw new Error('A sala já está reservada para o intervalo de tempo especificado')
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
            if (!statusPermitidos.includes(statusNormalizado)) {
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

        // Atualizado: Verifica conflitos se houver mudança de sala OU de qualquer uma das datas
        if (payload.data_inicio !== undefined || payload.data_fim !== undefined || payload.sala_id !== undefined) {

            const salaIdAlvo = payload.sala_id !== undefined ? payload.sala_id : reservaExistente.sala_id
            const salaExiste = await SalasModel.findById(salaIdAlvo)
            if (!salaExiste) {
                throw new Error('Sala não encontrada')
            }

            // Fallbacks caso a requisição altere apenas uma das datas passadas
            const strInicioAlvo = payload.data_inicio !== undefined ? payload.data_inicio : reservaExistente.data_inicio
            const strFimAlvo = payload.data_fim !== undefined ? payload.data_fim : reservaExistente.data_fim

            const inicioNova = new Date(strInicioAlvo)
            const fimNova = new Date(strFimAlvo)
            const dataAtual = new Date()

            if (isNaN(inicioNova.getTime()) || isNaN(fimNova.getTime())) {
                throw new Error('Formatos de data de início ou fim inválidos.')
            }
            if (inicioNova.getTime() < dataAtual.getTime()) {
                throw new Error('A data de início da reserva deve ser futura.')
            }
            if (fimNova.getTime() <= inicioNova.getTime()) {
                throw new Error('A data de término deve ser posterior à data de início.')
            }

            const salaReservada = await ReservasModel.findBySalaId(salaIdAlvo)
            const listaReservas = Array.isArray(salaReservada) ? salaReservada : []

            const conflitoReserva = listaReservas.some(reserva => {
                const reservaInicio = new Date(reserva.data_inicio)
                const reservaFim = new Date(reserva.data_fim)

                return (
                    reserva.id !== Number(id) &&
                    reserva.status.toLowerCase() === 'ativa' &&
                    (inicioNova.getTime() < reservaFim.getTime() && fimNova.getTime() > reservaInicio.getTime())
                )
            })

            if (conflitoReserva) {
                throw new Error('A sala já está reservada para o intervalo de tempo especificado')
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