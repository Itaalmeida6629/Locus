const db = require('../config/database')

class UserModel {
    static async findAll() {
        const [rows] = await db.query('SELECT id, nome, email, telefone, rua, numero, bairro, cidade, estado, cidade, estado, tipo, instituicao_id, criado_em FROM Usuarios')
        return rows
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, nome, email, telefone, rua, numero, bairro, cidade, estado, cidade, estado, tipo, instituicao_id, criado_em FROM Usuarios WHERE id = ?', [id])
        return rows[0]
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email])
        return rows[0]
    }

    static async findByInstituicaoId(instituicao_id) {
        const [rows] = await db.query('SELECT id, nome, email, telefone, rua, numero, bairro, cidade, estado, cidade, estado, tipo, instituicao_id, criado_em FROM Usuarios WHERE instituicao_id = ?', [instituicao_id])
        return rows
    }

    static async create({ nome, email, senha_hash, telefone, rua, numero, bairro, cidade, estado, tipo, instituicao_id }) {
        const [result] = await db.query(
            'INSERT INTO Usuarios (nome, email, senha_hash, telefone, rua, numero, bairro, cidade, estado, tipo, instituicao_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nome, email, senha_hash, telefone, rua, numero, bairro, cidade, estado, tipo, instituicao_id])
        return result.insertId
    }

    static async update(id, data) {
        const fields = []
        const values = []
        for (const key in data) {
            fields.push(`${key} = ?`)
            values.push(data[key])
        }
        values.push(id)
        const [result] = await db.query(
            `UPDATE Usuarios SET ${fields.join(', ')} WHERE id = ?`,
            values
        )
        return result.affectedRows > 0
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Usuarios WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}

module.exports = UserModel