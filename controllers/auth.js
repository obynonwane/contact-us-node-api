const formidable = require('formidable')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const expressJwt = require('express-jwt')
const User = require('../models/user')
const ResetToken = require('../models/resetToken')
const { sendEmail } = require("../helpers");    
const Role = require('../models/role')
const _ = require('lodash')
const { findOne } = require('../models/user')


//configure dotenv
dotenv.config()

class AuthenticationController {


   
    constructor() {
        
    }

  

    async signUp(req, res, next) {
         
       
        const userExist = await User.findOne({email:req.body.email})
        const phoneExist = await User.findOne({phone:req.body.phone})

        if(userExist) return res.status(400).json({error:'Email is already taken'})
        if(phoneExist) return res.status(400).json({error:'Phone Already Taken' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)


        const userrole = await Role.findOne({name:req.body.role}, (err, name) => {
            if(err || !name) {
                return res.status(403).json({status:false, message:`The given role:${req.body.role} is not found`})
            }
        })

        const user = new User(req.body) //create a new user
        user.role = userrole._id
        user.hashed_password = hashedPassword
        user.salt = salt
        user.verification_token = newAuth.generateVerificationToken()

        await user.save().then( response => {
          
            const emailData = { 
                from: "noreply@node-react.com",
                to: req.body.email,
                subject: "Account Verification Link",
                text: `Please use the following link to reset your password:${user.verification_token}`,
                html: `<p>Please use the following link to reset your password:<a>${process.env.CLIENT_URL}${`activate-account?verification_token=`}${user.verification_token}${`&salt=`}${user.salt}</a></p>`
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

    
        if(!user) return res.status(400).json({error:"Invalid Email"})

          
        //compare password password and hashed password
        const validPass = await bcrypt.compare(password, user.hashed_password)
        if(!validPass)return res.status(401).json({error:'Password does not match'})
       
        
        
        //Query to get the user Role and Permissions
       let userRoleAndPerm = await Role.findById(user.role._id, (err, result) => {
           if(err || !result){
               return res.json({error:"Invalid Role"})
           }
       }).populate("permission","_id name").select("_id name")
       
        

      
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
                firtname:user.first_name, 
                salt:user.salt, 
                verified:user.verified,
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

    generateVerificationToken(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    generatePasswordRsetToken() {
        return Math.random().toString(36).substring(4, 30) + Math.random().toString(50).substring(4, 30);
    }

    async activateAccount(req, res, next) {
        console.log(req.query)
         await User.findOne({salt:req.query.salt}, (err, result) => {
            if(err || !result) return res.status(403).json({error:'Userverification failed, request for new a verification Link'})

            if(result.verification_token != req.query.verification_token) return res.status(403).json({error:'Userverification failed, request for new a verification Link'})


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

    async getResetLink(req, res, next) {
        const email = req.body.email
       
        await User.findOne({email:email}, (err, result) => {
            if(err || !result){
                return res.status(400).json({status:false, message:"Account with the given email do not exist"})  
            }
           

            let generateResetToken = newAuth.generateVerificationToken() //generate password reset token
            const email = result.email
            const token = generateResetToken


            ResetToken.findOne({email:result.email}, (tokenError, tokendetail) => {

                //If error or email does not exist create the record
                if(tokenError || !tokendetail){
                    const resetDocument = new ResetToken({email:email, token:token})
                    resetDocument.save()
                    .then(resp => {
                        newAuth.forwardEmailPasswordReset(resp)
                        .then( success => {
                            return res.json({status:true, message:"Password reset link Sent Succesfully"})
                        })
                      
                        console.log("Token Created")
                    }).catch(err => {
                        console.log(err)
                    })
                }

              
                if(tokendetail){
                    //   If no error or Email Exist Update the record belonging to the current Email
               
                    let tokendoc = _.extend(tokendetail, {token:generateResetToken})
                    tokendoc.updated_at = Date.now()
                    
        
                    tokendoc.save((err, result) => {
                        if(err || !result) {
                            return res.status(400).json(err)
                        }
                    
                        newAuth.forwardEmailPasswordReset(result)
                        .then( success => {
                            return res.json({status:true, message:"Password reset link Sent Succesfully"})
                        })

                    })
                }
            })

        })
    } //end getResetLink

    //update your password 
    async updatePassword(req, res, next){
        const token =  req.query.verification_token
        const email = req.query.email

       
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        if(req.body.password != req.body.confirm_password) {
            return res.status(400).json({statuss:false, message:"Password and Confirm Password do not match"})
        }

        await ResetToken.findOne({token:token}, (err, result) => {
            

            if(err || !result) {
                return res.status(400).json({status:false, message:"Invalid Token, please requesst for new reset password link"})
            } else if(result.email != email){
                return res.status(400).json({status:false, message:"Email and Token mismatch, please requesst for new reset password link"})
            }

            if(result){
                User.findOne({email:email}, (error, resp) => {
                    if(error || !resp){
                        return res.status(400).json({status:false, message:"Unable to updatee password at this time"})
                    }

                    
                    
                 
                   
                    let user = _.extend(resp, {hashed_password:hashedPassword})
                    user.updated_at = Date.now()
                    user.hashed_password = hashedPassword

                    user.save((err, result) => {
                        if(err || !result){
                            return res.status(400).json({status:false,message:"Unable to updatee password at this time second"})
                        }

                        return res.json({status:true,message:"Passowrd changed successfully"})

                    })
                })
            }
            
        })
       
    }

    generateHashedPassword(plain_password){
        try {
            const salt = bcrypt.genSalt(10)
            const hashedPassword = bcrypt.hash(plain_password, salt)
            console.log(hashedPassword)
            return hashedPassword

        } catch(err){
            console.log(err)
        }
    }


    async forwardEmailPasswordReset(user){
        const emailData = {
            from: "noreply@node-react.com",
            to: user.email,
            subject: "Email Reset Link",
            text: `Please use the following link to reset your password:${user.token}`,
            html: `<p>Please use the following link to reset your password:<a>${process.env.CLIENT_URL}${`api/v1/auth/updatepassword?verification_token=`}${user.token}${`&email=`}${user.email}</a></p>`
        };

       await sendEmail(emailData).then(() =>{
            console.log("Email Sent")
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