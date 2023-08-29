const multer = require("multer");
const { fileStore } = require("../config/db");
const path = require("path");
const jwt = require("jsonwebtoken");
const { DBInfo } = require("../config/db");
const OS = require('os')
let imgUpload, imagesUpload, pdfUpload, track;


let generateOTP = () => {
  var OTP = "";
  for (var i = 0; i < 4; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

track = (req, res, next) => {
  let date, host, platform, user;
  date = new Date().toLocaleString();
  host = OS.hostname();
  platform = OS.platform();
  user = OS.userInfo()
  console.log({ Date: date, User:user.username, Window: host, platform: platform, headers: req.headers, url: req.url, Ip: req.ip, method: req.method, Originalurl: req.originalUrl, host: req.hostname, detail: req.headers.host, body: req.body });
  next()
}
let validationToken = (req, res, next) => {
  try {
    let token, authHeader;
    authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, DBInfo.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.send({ status: 0, response: "User not authorized" });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } else if (!token) {
      res.send({ status: 0, response: "Token not provided" });
    } else {
      res.send({ status: 0, response: "Something went wrong" });
    }
  } catch (error) {
    res.send({ status: 0, response: "something went wrong" });
  }
};


var uploadFile = multer({
  storage: fileStore,
  limits: { fileSize: 1000000 },
});


imgUpload = [
  uploadFile.single("image"),
  (req, res, next) => {
    if (req.file) {
      let image = path.join(__dirname, "../", req.file.path);
      req.files = image;
      next();
    } else {
      res.status(400).send("Please upload a valid image");
    }
  },
];


imagesUpload = [
  uploadFile.array("file", 2),
  async (req, res, next) => {
    if (req.files.length) {
      let image, pdf;
      image = path.join(__dirname, "../", req.files[0].path);
      pdf = path.join(__dirname, "../", req.files[1].path);
      req.image = image
      req.pdf = pdf
      next();
    } else {
      res.status(400).send("Please upload a valid image");
    }
  },
];


module.exports = {
  generateOTP,
  imgUpload,
  pdfUpload,
  imagesUpload,
  validationToken,
  track
};

