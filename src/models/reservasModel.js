const db = require('../config/db')

class ReservasModel {

    static async findAll() {
        const [rows] = await db.query('SELECT r.id, i.nome as instituicao_nome, r.sala_id, r.usuario_id, r.data_inicio, r.data_fim, r.status FROM Reservas r JOIN Instituicoes i ON r.id_instituicao = i.id')
        return rows
    }

    static async findBySalaId(sala_id) {
        const [rows] = await db.query('SELECT * FROM Reservas WHERE sala_id = ?', [sala_id])
        return rows
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT r.id, i.nome as instituicao_nome, r.sala_id, r.usuario_id, r.data_inicio, r.data_fim, r.status FROM Reservas r JOIN Instituicoes i ON r.id_instituicao = i.id WHERE r.id = ?', [id])
        return rows[0]
    }

    static async findByInstituicao(id_instituicao) {
        const [rows] = await db.query('SELECT r.id, i.nome as instituicao_nome, r.sala_id, r.usuario_id, r.data_inicio, r.data_fim, r.status FROM Reservas r JOIN Instituicoes i ON r.id_instituicao = i.id WHERE i.id_instituicao = ?', [id_instituicao])
        return rows
    }

    static async findByUser(id_usuario) {
        const [rows] = await db.query('SELECT r.id, i.nome as instituicao_nome, r.sala_id, r.usuario_id, r.data_inicio, r.data_fim, r.status FROM Reservas r JOIN Instituicoes i ON r.id_instituicao = i.id WHERE r.id_usuario = ?', [id_usuario])
        return rows
    }

    static async createReserva({ id_usuario, sala_id, data_inicio, data_fim, status }) {
        const [result] = await db.query(
            'INSERT INTO Reservas (id_usuario, sala_id, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?)',
            [id_usuario, sala_id, data_inicio, data_fim, status])
        return result.insertId
    }

    static async updateReserva(id, data) {
        const fields = []
        const values = []
        for (const campo in data) {
            fields.push(`${campo} = ?`)
            values.push(data[campo])
        }
        values.push(id)
        const [result] = await db.query(
            `UPDATE Reservas SET ${fields.join(', ')} WHERE id = ?`,
            values
        )
        return result.affectedRows > 0
    }

    static async deleteReserva(id) {
        const [result] = await db.query('DELETE FROM Reservas WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}

module.exports = ReservasModel