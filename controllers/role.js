const Role = require('../models/role')
const Permission = require('../models/permission')
const _ = require('lodash')

class RoleController {

    async create(req, res, next) {
        const role = await new Role(req.body) //create a new role
        await role.save().then( response => {
            return res.status(200).json({message:'Role created successfully', response}) //return response to client  

        }).catch( err => {
            return res.status(403).json({message:'Role Could not be Created'}) //return response to client  
        }) //save the user
    }

    async allRoles(req, res, next){
        await Role.find().populate("permission","_id name")
        .then(roles => {
            return res.json({
                roles
            })
        })
       
        .catch(error => {
            console.log(console.error);
            
        })
    }

    getCustomerRole(req, res, next){
        const id = "5f97d76adbc6d25d2a9c137b"
        Role.findById(id).exec((err, role) => {
            if(err || !role) {
                return res.status(400).json({
                    error:'Role not found'
                })
            }
            req.role = role  
            next()
        })  
    }

    async assignPermissionToRole(req, res, next) {

        await Permission.findById(req.query.permissionId, (err, result) => {
                if(err || !result){
                    return res.status(404).json({
                        error:'Permission not found'
                    })  
                }
        })

        await Role.findById(req.query.roleId, (err, role) => {
            if(err || !role){
                return res.status(404).json({
                    error:'Role not found'
                })  
            }

            let permissionFound = false
            role.permission.map(function(data){
                if(data == req.query.permissionId){
                    permissionFound = true
                }
            })

            if(permissionFound) return res.status(403).json({eror:"This Permission Has Already been Assigned to this role"})  

            role = _.extend(role, role)
            role.permission.push(req.query.permissionId)
            role.save().then((role) =>{
                res.json({message:"Permission Added to Role Succesfully"})
            })
            .catch(error => {
                return res.status(400).json({error:error})
            }) 

        })
    }


}

module.exports = RoleController