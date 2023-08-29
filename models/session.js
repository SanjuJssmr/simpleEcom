const mongoose = require('mongoose')

let objectId = mongoose.Schema.Types.ObjectId;

const sessionSchema = new mongoose.Schema({
    userId: {
        type: objectId
    },
    token: {
        type: String
    }
},
    {
        timestamps: true,
        versionKey:false
    })


module.exports = mongoose.model('session', sessionSchema)