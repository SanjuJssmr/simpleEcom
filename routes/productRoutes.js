const express = require('express')
const { createProduct, aggregateData, bucketTest } = require('../controllers/productControllers')
const { imagesUpload } = require('../middlewares/middlewares')

let prodcutRouter = express.Router()

prodcutRouter.post('/newProduct',imagesUpload,createProduct)
prodcutRouter.get('/combinedData',aggregateData)
prodcutRouter.get('/bucket', bucketTest)

module.exports = prodcutRouter