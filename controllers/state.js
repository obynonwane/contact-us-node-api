const State = require('../models/state')
const formidable = require('formidable')
const _ = require('lodash')




class StateController {

    stateById (req, res, next, id) {
        State.findById(id).exec((err, state) => {
            if(err || !state) {
                return res.status(400).json({
                    error:'State not found'
                })
            }
    
            req.state = state  //append profile object to the request object
    
            next()
        })  
    }

    getAllStates (req, res, next) {

        State.find((err, states) =>{
            if(err){
                return res.status(401).json({err})
            }
            
            res.json({states})
        }).populate("countryId", "_id name").select("_id name")
        
    }

    async create(req, res, next) {
       
        const state = new State({name:req.body.name, countryId:req.body.countryId})
        await state.save((err, result) => {
            if(result){
                result.created = undefined
                result.updated_at = undefined
                result.__v = undefined
                return res.json({status:true, state:result})
            }
            if(err){
                console.log(err)
            }
        })

    }

    updateState (req, res, next) {
        let state = req.state
        state = _.extend(state, req.body)
        state.updaated = Date.now()
        state.save((err, state) =>{
            if(err){
                return res.status(400).json({eror:err})
            }
    
            res.json({message:"State Updated Successfully", state})
        })
    }

    deleteState (req, res, next) {
        let state = req.state
        state.remove((err, state) =>{
            if(err){
                return res.status(400).json({error:err})
            }
    
            res.json({message: 'state deleted succesfully'})
        })
    }


    getState (req, res, next) {
        req.state.created = undefined
        req.state.updated_at = undefined
        return res.json(req.state)
    }
    
}

module.exports = StateController