const express = require('express')
const { check, body } = require('express-validator/check');
const User = require('../models/user')

const AuthController = require('../controllers/auth')
const {signUp, signIn, signOut,activateAccount, getResetLink, updatePassword} = new  AuthController()

const requestValidator = require('../validator')
const {signupValidator} = new  requestValidator()

const RoleController = require('../controllers/role')
const {getCustomerRole} = new  RoleController()


//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {validToken} = require('../middlewares/verifytoken')

//Implement Router
const router = express.Router()


router.post('/api/v1/auth/signup', trustedClient, signupValidator, signUp)
router.post('/api/v1/auth/signin', trustedClient, signIn)
router.get('/api/v1/auth/signout', trustedClient, validToken, signOut)
router.get('/api/v1/auth/activate-account', trustedClient, activateAccount)
router.post('/api/v1/auth/getresetlink', trustedClient, getResetLink)
router.post('/api/v1/auth/updatepassword', trustedClient, updatePassword)


//export this route file
module.exports = router