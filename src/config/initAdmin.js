const db = require('./database')
const bcrypt = require('bcrypt')

async function criarPrimeiroAdmin() {
    try {

        const [admins] = await db.query("SELECT id FROM Usuarios WHERE tipo = 'admin' LIMIT 1")

        if (admins.length > 0) {
            return
        }

        console.log('Nenhum administrador encontrado. Iniciando configuracao inicial...')

        const [instituicoes] = await db.query("SELECT id FROM Instituicoes WHERE id = 1")
        if (instituicoes.length === 0) {
            await db.query(`
                INSERT INTO Instituicoes (id, nome, rua, numero, bairro, cidade, estado, telefone, cep)
                VALUES (1, 'Instituicao Padrao Locus', 'Rua Central', '123', 'Centro', 'Sua Cidade', 'RS', '54999999999', '95150000')
            `)
        }

        const senhaPadrao = 'LocusAdmin'
        const senhaHash = await bcrypt.hash(senhaPadrao, 10)

        await db.query(`
            INSERT INTO Usuarios (nome, email, senha_hash, telefone, rua, numero, bairro, cidade, estado, cep, tipo, instituicao_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            'Administrador Sistema',
            'admin@locus.com',
            senhaHash,
            '54999999999',
            'Rua Padrao',
            'S/N',
            'Centro',
            'Sua Cidade',
            'RS',
            '95150000',
            'admin',
            1
        ])

        console.log('Primeiro administrador criado com sucesso.')
        console.log('Email: admin@locus.com')
        console.log(`Senha: ${senhaPadrao}`)

    } catch (error) {
        console.error('Erro ao criar o administrador inicial:', error)
    }
}

module.exports = criarPrimeiroAdmin;