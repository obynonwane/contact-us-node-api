const express = require('express')
//Implement Router
const router = express.Router()

//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {requireSignin} = require('../helpers/authorizer')



const PermissionController = require('../controllers/permission')
const {allPermissions, permissionById} = new  PermissionController()


router.get('/api/v1/permission/all', allPermissions)



router.param('permissionId', permissionById)


//export this route file
module.exports = router