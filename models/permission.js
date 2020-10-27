const mongoose = require('mongoose')

const permissionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
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

module.exports = mongoose.model("Permission", permissionSchema)