const mongoose = require('mongoose')
const  uuidv1 = require('uuidv1')
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema


const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    surname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    hashed_password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        required:true,
        default:false
    },
    verification_token:{
        type:String,
    },
    role:{
        type:ObjectId,
        ref:"Role"
    },
    country:{
        type:ObjectId,
        ref:"Country"
    },
    state:{
        type:ObjectId,
        ref:"State"
    },
    lga:{
        type:ObjectId,
        ref:"Lga"
    },
    city:{
        type:String,
    },
    street:{
        type:String,
    },
    address:{
        type:String,
    },
    photo:{
        type:String,
    },
    account_complete:{
        type: String,
        default: false
    },
    salt:String,
    created: {
        type: Date,
        default: Date.now()
    },

    updated_at: {
        type: Date,
        default: Date.now()
    }
    
})



//Adding methods to the schema
userSchema.methods = {
    
    // authenticate: function(plaintext) {
    //     return this.encryptPassword(plaintext) === this.hashed_password
    // },
}
module.exports = mongoose.model("User", userSchema)