const express = require('express')

//Controller Class Import
const lgaController = require('../controllers/lga')
const { getAlllgas, create, getLga, lgaById, deleteLga, updateLga } = new lgaController()

//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {requireSignin} = require('../helpers/authorizer')


//Implement Router
const router = express.Router()



//All available routes
router.get('/api/v1/lgas/all', trustedClient, requireSignin,  getAlllgas)
router.post('/api/v1/lgas/create', trustedClient, requireSignin,  create)
router.get('/api/v1/lgas/:lgaId', trustedClient, requireSignin, getLga)
router.delete('/api/v1/lgas/:lgaId',trustedClient, requireSignin, deleteLga)
router.put('/api/v1/lgas/:lgaId', trustedClient, requireSignin, updateLga)

router.param('lgaId', lgaById)



//export this route file
module.exports = router