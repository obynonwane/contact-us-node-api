const User = require('../models/user')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const dotenv = require('dotenv')

//configure dotenv
dotenv.config()


class UserController {

    userById (req, res, next, id) {
        User.findById(id).exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error:'User not found'
                })
            }
    
            req.profile = user  //append profile object to the request object
    
            next()
        })  
    }

    async allUsers(req, res, next) {
        
        await User.find()
        .populate("role","_id name")
        .select("_id first_name surname email phone salt body")
        .then(users => {
            return res.json({
                users
            })
        })
        .catch(error => {
            console.log(console.error);
            
        })
        
    }

    // async  updateUser(req, res, next) {
    //     // return res.json({profile:req.profile})
    //     let form  = new formidable.IncomingForm()
    //     form.keepExtensions = true
    //     form.parse(req, (err, fields, files) => {
    //         if(err){
    //             return res.status(400).json({
    //                 error:"Photo could not be uploaded"
    //             })
    //         }

    //         let user = req.profile
    //         user = _.extend(user, fields)
    //         user.updated_at = Date.now()

    //         if(files.photo){
    //             user.photo.data = fs.readFileSync(files.photo.path)
    //             user.photo.contentType = files.photo.type
    //         }

    //         user.save((err, result) =>{
    //             if(err || !result) {
    //                 return res.status(400).json(err)
    //             }
    //             return res.json(user)
    //         })
    //     })
    // }

    async updateUser(req, res, next) {
        const address = req.body.address
        const street = req.body.street
        const image = req.file 
        const lga = req.body.lga
        const state = req.body.state
        const country = req.body.country

        if(!image) return res.status(400).json({error:"Profile Image is required"})

        const imageUrl = image.path

        let user = req.profile
        user = _.extend(user, req.body)
        user.updated_at = Date.now()
        user.photo = imageUrl

        user.save((err, result) => {
            if(err || !result) {
                return res.status(400).json(err)
            }
           
            return res.json({status:true, message:"Account Updated Successfully"})
        })

    }

    async getUserDetails(req, res, next) {

        const user_id = req.profile._id

        const data =  await User.findById(user_id, (err, result) => {
            const client = `${process.env.CLIENT_URL}`;
                return res.json({
                    id:result._id,
                    first_name:result.first_name,
                    surname:result.surname,
                    email:result.email,
                    phone:result.phone,
                    photo:client+result.photo,
                    address:result.address,
                    street:result.street,
                    city:result.city,
                    country:result.country.name,
                    state:result.state.name,
                    lga:result.lga.name,
                    verified:result.verified,
                    account_complete:result.account_complete,
                    role:result.role.name,
                    roles:result.role
                })
             })
            .populate("country")
            .populate("state")
            .populate("lga")
            .populate("role")
        
       
    }
}

module.exports = UserController