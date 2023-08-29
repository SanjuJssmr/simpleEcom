require("dotenv").config()
const multer = require('multer')
const nodemailer = require('nodemailer')

let DBInfo, fileStore, configMail;

DBInfo = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,

}

fileStore = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

configMail = {
  fromSmtp: process.env.SMTP_MAIL,
  setUp: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  })
}


module.exports = { configMail, fileStore, DBInfo }



