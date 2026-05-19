const db = require('../config/database')

class InstituicaoModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM Instituicoes')
        return rows
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM Instituicoes WHERE id = ?', [id])
        return rows[0]
    }

    static async findByName(nome) {
        const [rows] = await db.query('SELECT * FROM Instituicoes WHERE nome = ?', [nome])
        return rows[0]
    }

    static async findByCidade(cidade) {
        const [rows] = await db.query('SELECT * FROM Instituicoes WHERE cidade = ?', [cidade])
        return rows
    }
    
    static async create({ nome, rua, numero, bairro, cidade, estado, telefone, cep }) {
        const [result] = await db.query(
            'INSERT INTO Instituicoes (nome, rua, numero, bairro, cidade, estado, telefone, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [nome, rua, numero, bairro, cidade, estado, telefone, cep])
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
            `UPDATE Instituicoes SET ${fields.join(', ')} WHERE id = ?`, 
            values
        )
        return result.affectedRows > 0
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Instituicoes WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}

module.exports = InstituicaoModel
            