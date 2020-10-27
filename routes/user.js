const express = require('express')
const router = express.Router()

const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const UserController = require('../controllers/user')
const {allUsers, userById, updateUser, getUserDetails} = new UserController()

const {requireSignin} = require('../helpers/authorizer')

router.get('/api/v1/user/all', trustedClient, allUsers)
router.put('/api/v1/user/update/:userId', trustedClient, updateUser)
router.get('/api/v1/user/user_details/:userId', trustedClient, getUserDetails)




router.param('userId', userById)

//export this route file
module.exports = router