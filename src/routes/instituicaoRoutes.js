const express = require('express')
const InstituicaoController = require('../controllers/instituicaoController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/', InstituicaoController.getAll)
router.get('/:id', InstituicaoController.getById)
router.get('/nome/:nome', InstituicaoController.getByName)
router.get('/cidade/:cidade', InstituicaoController.getByCidade)

router.post('/', authenticateToken, authorizeRole('admin'), InstituicaoController.create)
router.put('/:id', authenticateToken, authorizeRole('admin'), InstituicaoController.update)
router.delete('/:id', authenticateToken, authorizeRole('admin'), InstituicaoController.delete)

module.exports = router