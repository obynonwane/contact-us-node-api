const User = require('../models/user')
const Role = require('../models/role')
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


    async updateUser(req, res, next) {
        //Extract Image

  
        const image = req.file 
     
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

        const data =  await User.findById(user_id)
            .populate("country")
            .populate("state")
            .populate("lga")
            .populate("role")
            .then(result => {
               const base_url = `${process.env.CLIENT_URL}`;

                let user_permission = []

                Role.findById(result.role._id).populate('permission')
                  .then(response => {
                    let userPerm = response.permission
                
                    userPerm.map((perm) => {
                        user_permission.push(perm.name)
                    })

                    return res.json({
                        id:result._id,
                        firtname:result.first_name,
                        surname:result.surname,
                        email:result.email,
                        phone:result.phone,
                        photo:base_url+result.photo,
                        address:result.address,
                        street:result.street,
                        city:result.city,
                        country:result.country.name,
                        state:result.state.name,
                        lga:result.lga.name,
                        verified:result.verified,
                        account_complete:result.account_complete,
                        role:result.role.name,
                        permission:user_permission
                    })
                    
                  }).catch(err => {
                    return res.json({status:false, message:'User update failed', error:err})
                  })
            }).catch(err => {
                return res.json({status:false, message:'User update failed', error:err})
            })
    }
}

module.exports = UserController