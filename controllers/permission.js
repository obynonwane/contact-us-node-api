
const Permission = require('../models/permission')

class PermissionController {


    async createPermision(req, res, next){

    }

    async allPermissions(req, res, next){
        await Permission.find()
        .then(permissions => {
            return res.json({
                permissions
            })
        })
        .catch(error => {
            console.log(console.error);
            
        })
    }

    async deletePermission(req, res, next, id){

    }

    async updatePermission(req, res, next, id){

    }

    permissionById(req, res, next, id){
        Permission.findById(id).exec((err, permission) => {
            if(err || !permission) {
                return res.status(400).json({
                    error:'Permission not found'
                })
            }

            req.permission = permission  //append permission to request object

            next()
        })  
    }

}

module.exports = PermissionController