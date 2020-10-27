const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const stateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    countryId:{
        type:ObjectId,
        ref:"Country"
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

module.exports = mongoose.model("State", stateSchema)