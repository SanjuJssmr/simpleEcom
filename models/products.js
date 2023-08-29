const mongoose = require('mongoose')

let userPostedId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({
    userPosted:{
        type:userPostedId,
        ref:'users'
    },
   productName:{
        type:String,
        default:"DSABook"
    },
    quantity:{
        type:Number
    },
    price:{
        type:Number
    },
    image:
    {
       type:String
    },
    pdf:{
        type:String
    } ,
},{
    timestamps:true,
    versionKey:false
})

module.exports = mongoose.model('products',productSchema)