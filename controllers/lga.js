const Lga = require('../models/lga')
const formidable = require('formidable')
const _ = require('lodash')




class LgaController {

    lgaById (req, res, next, id) {
        Lga.findById(id).exec((err, lga) => {
            if(err || !lga) {
                return res.status(400).json({
                    error:'Lga not found'
                })
            }
    
            req.lga = lga  //append profile object to the request object
    
            next()
        })  
    }

    getAlllgas (req, res, next) {
        Lga.find((err, states) =>{
            if(err){
                return res.status(401).json({err})
            }
            
            res.json({states})
        }).populate("stateId", "_id name").select("_id name")
        
    }


    async create(req, res, next) {
       
        const lga = new Lga(req.body)
        await lga.save((err, result) => {
            if(result){
                result.created = undefined
                result.updated_at = undefined
                result.__v = undefined
                return res.json({status:true, lga:result})
            }
            if(err){
                console.log(err)
            }
        })

    }
    deleteLga (req, res, next) {
        let lga = req.lga
        lga.remove((err, lga) =>{
            if(err){
                return res.status(400).json({error:err})
            }
    
            res.json({message: 'lga deleted succesfully'})
        })
    }

    updateLga (req, res, next) {
        let lga = req.lga
        lga = _.extend(lga, req.body)
        lga.updaated = Date.now()
        lga.save((err, lga) =>{
            if(err){
                return res.status(400).json({eror:err})
            }
    
            res.json({message:"State Updated Successfully", lga})
        })
    }

    getLga (req, res, next) {
        req.lga.created = undefined
        req.lga.updated_at = undefined
        return res.json(req.lga)
    }
}

module.exports = LgaController