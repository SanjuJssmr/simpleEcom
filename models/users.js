const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        designation: {
            type: [String],
        },
        otp:{
            type: String
        },
        verified:{
            type: Boolean,
            default:false
        },
        image:
        {
           type:String
        },
        admin:{
            type:Boolean,
            default: false
        }    
    },
    {
        timestamps: true,
        versionKey:false
    }
);

module.exports = mongoose.model("users", userSchema);
