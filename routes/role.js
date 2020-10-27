const express = require('express')
//Implement Router
const router = express.Router()

//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {requireSignin} = require('../helpers/authorizer')

const RoleController = require('../controllers/role')
const {create, assignPermissionToRole, allRoles} = new  RoleController()

const PermissionController = require('../controllers/permission')
const {permissionById} = new  PermissionController()

router.post('/api/v1/role/create', trustedClient, requireSignin, create)
router.put('/api/v1/role/assignpermission/', assignPermissionToRole)
router.get('/api/v1/role/all', allRoles)



router.param('permissionId', permissionById)


//export this route file
module.exports = router