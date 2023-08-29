const User = require('../models/users.js')
const Prod = require('../models/products.js');
const sales = require('../models/sales.js');

const getUser = async(req,res)=>{
    try {
         let Users  = await User.find()
         return res.send({status:1, response:Users});
    } catch (error) {
        return res.send({status:0, response:error.message})
    }
}


const getAllProd = async(req,res)=>{
    try {
        let Prods = await Prod.find()
        return res.send({status:1, response:Prods});
    } catch (error) {
        return res.send({status:1, response:error.message});
    }
}


const cardTracks = async(req,res)=>{
    try {
        let cardTrack = await sales.aggregate([
            {$lookup:{
                from:"users",
                localField:"userBuying",
                foreignField:"_id",
                as:"DetailsOfAddTOCard"
            }},
            {$match:{"status":1}},
            {$project:{"productBuying":1, "quantity":1,"status":1, _id:0, "DetailsOfAddTOCard.username":1,"DetailsOfAddTOCard.email":1}},
        ])
        return res.send({status:1, reponse:cardTrack})
    } catch (error) {
        return res.send({status:0, response:error.message})
    }
}


const salesTrack = async(req,res)=>{
    try {
        let purchaseTrack = await sales.aggregate([
            {$lookup:{
                from:"users",
                localField:"userBuying",
                foreignField:"_id",
                as:"DetailsOfPurchase"
            }},
            {$match:{"status":2}},
            {$project:{"productBuying":1, "quantity":1, "status":1, _id:0, "DetailsOfPurchase.username":1,"DetailsOfPurchase.email":1}},
        ])
        return res.send({status:1, reponse:purchaseTrack})
    } catch (error) {
        return res.send({status:0, response:error.message})
    }
}


module.exports = {getUser, getAllProd, cardTracks, salesTrack}