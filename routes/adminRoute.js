const express = require('express')
const { validationToken } = require('../middlewares/middlewares')
const {  checKIfAdmin } = require('../validation/validate')
const { getUser, getAllProd, cardTracks, salesTrack } = require('../controllers/adminController')

const adminRouter = express.Router()

adminRouter.get('/allUsers',validationToken, checKIfAdmin, getUser )
adminRouter.get('/allProducts',validationToken, checKIfAdmin,getAllProd)
adminRouter.get('/allCardTrack',validationToken, checKIfAdmin, cardTracks)
adminRouter.get('/allSalesTrack',validationToken, checKIfAdmin,salesTrack)

module.exports = adminRouter
