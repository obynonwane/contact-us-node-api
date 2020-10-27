const formidable = require('formidable')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const expressJwt = require('express-jwt')
const User = require('../models/user')
const { sendEmail } = require("../helpers");
const Role = require('../models/role')
const _ = require('lodash')


//configure dotenv
dotenv.config()

class AuthenticationController {


   
    constructor() {
        
    }

  

    async signUp(req, res, next) {
         
        
        const userExist = await User.findOne({email:req.body.email})
        const phoneExist = await User.findOne({phone:req.body.phone})

        if(userExist) return res.status(403).json({error:'Email is already taken'})
        if(phoneExist) return res.status(403).json({error:'Phone Already Taken' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User(req.body) //create a new user
        user.role = req.role
        user.hashed_password = hashedPassword
        user.salt = salt
        user.verification_token = newAuth.generateVerificatioToken()

        await user.save().then( response => {
          
            const emailData = {
                from: "noreply@node-react.com",
                to: req.body.email,
                subject: "Account Verification Link",
                text: `Please use the following link to reset your password:${user.verification_token}`,
                html: `<p>Please use the following link to reset your password:<a>${process.env.CLIENT_URL}${`/api/v1/auth/activate-account?verification-token=`}${user.verification_token}${`&salt=`}${user.salt}</a></p>`
            };

            sendEmail(emailData).then(() =>{
                console.log("Email Sent")
            })
            return res.status(200).json({message:'Account created successfully proceed to login'}) //return response to client  


          

        }).catch( err => {
            return res.status(400).json({message:'Account Could not be Created', err}) //return response to client  
        }) //save the user

          
    }

    async signIn(req, res, next) {
        
        //Destructure to get email and password fro request
        const {email, password} = req.body

        //fiond user from database whose email was in request
        const user = await User.findOne({email})
        .populate("role")
        .select("_id first_name surname email phone salt hashed_password verified")

        // check if email is found and return appropriate result
        if(!user) return res.status(400).json({messa:"Invalid Email"})

          
        //compare password password and hashed password
        const validPass = await bcrypt.compare(password, user.hashed_password)
        if(!validPass)return res.status(401).json({error:'Password does not match'})
       
        
        // return res.json({data:"Obinna You are here"})
        
        //Query to get the user Role and Permissions
       let userRoleAndPerm = await Role.findById(user.role._id, ).populate("permission","_id name").select("_id name")
       
       
        let extract_permission = userRoleAndPerm.permission
        let extract_role = userRoleAndPerm.name

        
        
        //loop extract user permission and put into an array
        let user_permissions = newAuth.extractPermission(extract_permission)
        
      
        //generate token with user id and secret
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date + 9999})
        
      

        return res.json({
            user:{
                id:user._id, 
                email:user.email, 
                surname:user.surname, 
                firtname:user.firtst_name, 
                salt:user.salt, 
                verified:user.verified,
                complete:account_complete,
                role:extract_role, 
                permission:user_permissions
            }, token})
   
    }

    extractPermission (extract_permission) {

        let user_permissions = []
        extract_permission.map(data => {
            user_permissions.push(data.name)
        })

        return user_permissions
      
    }

    generateVerificatioToken(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async activateAccount(req, res, next) {
         await User.findOne({salt:req.query.salt}, (err, result) => {
            if(err || !result) return res.status(403).json({error:'Userverification failed, request for new a verification Link'})

            if(result.verification_token != req.query['verification-token']) return res.status(403).json({error:'Userverification failed, request for new a verification Link'})


            let user = _.extend(result, req.body)
            user.verified = true
            user.save((err, user) =>{
                if(err) return res.status(400).json({eror:err})
                res.json({message:"Account Activated Succesfully"})
            })
        })

    }

    signOut (req, res)  {
        
        res.clearCookie("t")//This removes the cookie created
        return res.json({
            message:"Signout Successfully!" 
        })
    }

    requireSignin  () {
        expressJwt({
            secret: process.env.JWT_SECRET,
            algorithms: ["HS256"], // added later
            userProperty: "auth",   //if the token is valid add the verified user ID to the auth property
            
        })
    }
}
let newAuth = new AuthenticationController()
module.exports = AuthenticationController