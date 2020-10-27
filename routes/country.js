const express = require('express')

//Controller Class Import
const countryController = require('../controllers/country')
const { getAllCountries, creaateCountry, countryById, getCountry, deleteCountry,updateCountry } = new countryController()

//Middleware Class Import
const trustedHost = require('../middlewares/trusted_host')
const {trustedClient} = new trustedHost()

const {requireSignin} = require('../helpers/authorizer')


//Implement Router
const router = express.Router()



//All available routes
router.get('/api/v1/countries/all', trustedClient, requireSignin, getAllCountries)
router.post('/api/v1/countries/create', creaateCountry)
router.get('/api/v1/countries/:countryId', getCountry)
router.delete('/api/v1/countries/:countryId', deleteCountry)
router.put('/api/v1/countries/:countryId', updateCountry)

router.param('countryId', countryById)





//export this route file
module.exports = router