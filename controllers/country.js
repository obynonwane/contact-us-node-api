const Country = require('../models/country')
const formidable = require('formidable')
const _ = require('lodash')




class CountryController {

    countryById (req, res, next, id) {
        Country.findById(id).exec((err, country) => {
            if(err || !country) {
                return res.status(400).json({
                    error:'Country not found'
                })
            }
    
            req.country = country  //append profile object to the request object
    
            next()
        })  
    }


    getAllCountries (req, res, next) {
        Country.find((err, countries)=>{
        if(err){
            return res.status(401).json({err})
        }
    
        res.json({countries})
       }).select('_id name')
    }
    

    creaateCountry (req, res, next) {

        
        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields) => {
            if(err){
                return res.status(400).json({error:err})
            }

            let country = new Country(fields)
            country.save((err, result) => {
                if(err){
                    return res.status(400).json({message:err})
                }
        
                res.json({
                    message:"country succefully created",
                    result
                })
            })
        })  
    }
    
    
    updateCountry (req, res, next) {
        let country = req.country
        country = _.extend(country, req.body)
        country.updaated = Date.now()
        country.save((err, country) =>{
            if(err){
                return res.status(400).json({eror:err})
            }
    
            res.json({message:"Country Updated Successfully", country})
        })
    }
    

    deleteCountry (req, res, next) {
        let country = req.country
        country.remove((err, country) =>{
            if(err){
                return res.status(400).json({error:err})
            }
    
            res.json({message: 'country deleted succesfully'})
        })
    }
    
    
    getCountry (req, res, next) {
        req.country.created = undefined
        req.country.updated_at = undefined
        return res.json(req.country)
    
    }

}

module.exports = CountryController