const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const lgaSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    stateId:{
        type:ObjectId,
        ref:"State"
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

module.exports = mongoose.model("Lga", lgaSchema)