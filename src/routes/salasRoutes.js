const express = require('express')
const SalasController = require('../controllers/salasController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

const router = express.Router()

router.get('/instituicao/:instituicao_id', SalasController.getSalasByInstituicao)
router.get('/:id', SalasController.getSalaById)
router.post('/', authenticateToken, authorizeRole('admin'), SalasController.createSala)
router.put('/:id', authenticateToken, authorizeRole('admin'), SalasController.updateSala)
router.delete('/:id', authenticateToken, authorizeRole('admin'), SalasController.deleteSala)

module.exports = router