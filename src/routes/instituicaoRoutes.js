require('dotenv').config()
const express = require('express')
const InstituicaoController = require('../controllers/instituicaoController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/', InstituicaoController.getAll)
router.get('/:id', InstituicaoController.getById)
router.get('/nome/:nome', InstituicaoController.getByName)
router.get('/cidade/:cidade', InstituicaoController.getByCidade)

router.post('/', authenticateToken, authorizeRole('ADMIN'), InstituicaoController.create)
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), InstituicaoController.update)
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), InstituicaoController.delete)

module.exports = router