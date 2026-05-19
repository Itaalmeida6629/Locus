const UserService = require('../services/userService')

class UserController {
    static async login(req, res, next) {
        try {
            const { token } = await UserService.login(req.body)
            res.status(200).json({ token })
        }
        catch (error) {
            next(error)
        }
    }

    static async getAll(req, res, next) {
        try {
            const usuarios = await UserService.getAllUsers()
            res.status(200).json(usuarios)
        }
        catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params
            const usuario = await UserService.getUserById(id)
            res.status(200).json(usuario)
        }
        catch (error) {
            next(error)
        }
    }

    static async getByEmail(req, res, next) {
        try {
            const { email } = req.params
            const usuario = await UserService.getUserByEmail(email)
            res.status(200).json(usuario)
        }
        catch (error) {
            next(error)
        }
    }

    static async getByInstituicaoId(req, res, next) {
        try {
            const { instituicao_id } = req.params
            const usuarios = await UserService.getUsersByInstituicaoId(instituicao_id)
            res.status(200).json(usuarios)
        }
        catch (error) {
            next(error)
        }
    }

    static async createUser(req, res, next) {
        try {
            const usuario = await UserService.createUser(req.body)
            res.status(201).json({ message: 'Usuário criado com sucesso', usuario })
        }
        catch (error) {
            next(error)
        }
    }

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params
            const usuarioLogado = req.user
            await UserService.updateUser(id, req.body, usuarioLogado)
            res.status(200).json({ message: 'Usuário atualizado com sucesso' })
        }
        catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params
            await UserService.deleteUser(id)
            res.status(200).json({ message: 'Usuário deletado com sucesso' })
        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = UserController