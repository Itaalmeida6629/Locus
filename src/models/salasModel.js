const db = require('../config/database')

class SalasModel {

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM salas WHERE id = ?', [id])
        return rows[0]
    }

    static async getSalasByInstituicao(instituicao_id) {
        const query = 'SELECT * FROM salas WHERE instituicao_id = ?'
        const [rows] = await db.query(query, [instituicao_id])
        return rows
    }

    static async createSala({  tipo, capacidade, instituicao_id}) {
        const [result] = await db.query(
            'INSERT INTO salas (tipo, capacidade, instituicao_id) VALUES (?, ?, ?)',
            [tipo, capacidade, instituicao_id]
        )
        return result.insertId
    }

    static async updateSala(id, data) {
        const fields = []
        const values = []
        for (const campo in data) {
            fields.push(`${campo} = ?`)
            values.push(data[campo])
        }
        values.push(id)
        const [result] = await db.query(
            `UPDATE salas SET ${fields.join(', ')} WHERE id = ?`,
            values
        )
        return result.affectedRows > 0
    }

    static async deleteSala(id) {
        const [result] = await db.query('DELETE FROM salas WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}

module.exports = SalasModel