const express = require('express')
const UserController = require('../controllers/userController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/login', UserController.login)

router.get('/', authenticateToken, UserController.getAll)
router.get('/:id', authenticateToken, authorizeRole('admin'), UserController.getById)
router.get('/email/:email', authenticateToken, authorizeRole('admin'), UserController.getByEmail)
router.get('/instituicao/:instituicao_id', authenticateToken, authorizeRole('admin'), UserController.getByInstituicaoId)
router.post('/', authenticateToken, authorizeRole('admin'), UserController.createUser)
router.put('/:id', authenticateToken, UserController.updateUser)
router.delete('/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser)

module.exports = router