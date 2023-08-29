const express = require('express')
const { addtoCard, buyProduct } = require('../controllers/salesController')

let salesRoutes = express.Router()

salesRoutes.post('/addToCard',addtoCard)
salesRoutes.post('/buyProduct',buyProduct)

module.exports= salesRoutes