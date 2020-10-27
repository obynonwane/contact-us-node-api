const express = require('express')

//Controller Class Import
const stateController = require('../controllers/state')
const { getAllStates, create, getState, stateById, deleteState, updateState } = new stateController()

//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {requireSignin} = require('../helpers/authorizer')


//Implement Router
const router = express.Router()



//All available routes
router.get('/api/v1/states/all', trustedClient, requireSignin,  getAllStates)
router.post('/api/v1/states/create', trustedClient, requireSignin,  create)
router.get('/api/v1/states/:stateId', trustedClient, requireSignin, getState)
router.delete('/api/v1/states/:stateId',trustedClient, requireSignin, deleteState)
router.put('/api/v1/states/:stateId', trustedClient, requireSignin, updateState)


router.param('stateId', stateById)


//export this route file
module.exports = router