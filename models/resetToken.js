const mongoose = require('mongoose')

const resetTokenSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    token:{
        type:String, 
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("ResetToken", resetTokenSchema)