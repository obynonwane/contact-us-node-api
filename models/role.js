const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    permission:[{
        type:ObjectId,
        ref:"Permission"
    }],
    created: {
        type: Date,
        default: Date.now()
    },

    updated_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Role", roleSchema)