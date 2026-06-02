const UserModel = require('../models/userModel')
const InstituicaoModel = require('../models/instituicaoModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validateLogin = require('../utils/validateLogin')
const validateEmail = require('../utils/validateEmail')
const validateString = require('../utils/validateString')
const validarCamposEnderecoETelefone = require('../utils/validacoes')
const tipo = ['admin', 'professor']

class UserService {

    static async login(data) {
        const { email, senha_hash } = data
        const erroLogin = validateLogin(data)
        if (erroLogin) {
            throw new Error(erroLogin)
        }
        if (!validateEmail(data.email)) {
            throw new Error('Email inválido')
        }
        const usuario = await UserModel.findByEmail(data.email)
        if (!usuario) {
            throw new Error('Email ou senha incorretos')
        }
        const senhaValida = await bcrypt.compare(data.senha_hash, usuario.senha_hash)
        if (!senhaValida) {
            throw new Error('Email ou senha incorretos')
        }
        const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return { token }
    }

    static async getAllUsers() {
        const usuarios = await UserModel.findAll()
        if (usuarios.length === 0) {
            throw new Error('Nenhum usuário encontrado')
        }
        return usuarios
    }

    static async getUserById(id) {
        const usuario = await UserModel.findById(id)
        if (!usuario) {
            throw new Error('Usuário não encontrado')
        }
        return usuario
    }

    static async getUserByEmail(email) {
        const usuario = await UserModel.findByEmail(email)
        if (!usuario) {
            throw new Error('Usuário não encontrado')
        }
        return usuario
    }

    static async getUsersByInstituicaoId(instituicao_id) {
        const instituicao = await InstituicaoModel.findById(instituicao_id)
        if (!instituicao) {
            throw new Error('Instituição não encontrada')
        }
        const usuarios = await UserModel.findByInstituicaoId(instituicao_id)
        if (usuarios.length === 0) {
            throw new Error('Nenhum usuário encontrado para esta instituição')
        }
        return usuarios
    }

    static async createUser(data) {
        const camposObrigatorios = ['nome', 'email', 'senha_hash', 'telefone', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'tipo', 'instituicao_id']
        for (const campo of camposObrigatorios) {
            if (data[campo] === undefined || data[campo] === null || (typeof data[campo] === 'string' && !data[campo].trim())) {
                throw new Error(`Campo ${campo} é obrigatório`)
            }
        }
        if (!validateEmail(data.email)) {
            throw new Error('Email inválido')
        }
        const usuarioExistente = await UserModel.findByEmail(data.email)
        if (usuarioExistente) {
            throw new Error('Email já cadastrado')
        }
        validarCamposEnderecoETelefone(data)
        if (isNaN(data.instituicao_id)) {
            throw new Error('ID da instituição deve ser um número')
        }
        const instituicao = await InstituicaoModel.findById(data.instituicao_id)
        if (!instituicao) {
            throw new Error('Instituição não encontrada')
        }
        const tipoNormalizado = data.tipo.trim().toLowerCase()
        if (!tipo.includes(tipoNormalizado)) {
            throw new Error('Tipo de usuário inválido')
        }
        const erroSenha = validateString(data.senha_hash, { min: 6, max: 100, fieldName: 'Senha' })
        if (erroSenha) {
            throw new Error(erroSenha)
        }
        const senhaHash = await bcrypt.hash(data.senha_hash, 10)

        const novoUsuario = await UserModel.createUser({ ...data, tipo: tipoNormalizado, senha_hash: senhaHash })
        if (novoUsuario) delete novoUsuario.senha_hash
        return novoUsuario
    }

    static async updateUser(id, data, usuarioLogado) {
        if (usuarioLogado.tipo !== 'admin' && String(usuarioLogado.id) !== String(id)) {
            throw new Error('Acesso negado: você só pode atualizar o seu próprio perfil')
        }
        const usuario = await UserModel.findById(id)
        if (!usuario) {
            throw new Error('Usuário não encontrado')
        }
        const payload = { ...data }
        if (Object.keys(payload).length === 0) {
            throw new Error('Nenhum campo para atualizar')
        }
        if (payload.email) {
            if (!validateEmail(payload.email)) {
                throw new Error('Email inválido')
            }
            const usuarioExistente = await UserModel.findByEmail(payload.email)
            if (usuarioExistente && usuarioExistente.id !== id) {
                throw new Error('Email já cadastrado')
            }
        }
        if (payload.instituicao_id) {
            if (isNaN(payload.instituicao_id)) {
                throw new Error('ID da instituição deve ser um número')
            }
            const instituicao = await InstituicaoModel.findById(payload.instituicao_id)
            if (!instituicao) {
                throw new Error('Instituição não encontrada')
            }
        }
        if (payload.tipo) {
            const tipoNormalizado = payload.tipo.trim().toLowerCase()
            if (!tipo.includes(tipoNormalizado)) {
                throw new Error('Tipo de usuário inválido')
            }
            payload.tipo = tipoNormalizado
        }
        if (payload.senha_hash) {
            const erroSenha = validateString(payload.senha_hash, { min: 6, max: 100, fieldName: 'Senha' })
            if (erroSenha) {
                throw new Error(erroSenha)
            }
            payload.senha_hash = await bcrypt.hash(payload.senha_hash, 10)
        }
        validarCamposEnderecoETelefone(payload)
        return await UserModel.updateUser(id, payload)
    }

    static async deleteUser(id) {
        const usuario = await UserModel.findById(id)
        if (!usuario) {
            throw new Error('Usuário não encontrado')
        }
        return await UserModel.deleteUser(id)
    }
}

module.exports = UserService