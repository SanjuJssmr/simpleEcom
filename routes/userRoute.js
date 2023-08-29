const express = require("express");

const {
  valCheck,
  checkIfUserExist,
  checkIfUserExistWithToken,
  emailValCheck
} = require("../validation/validate");
const {
  userRegistration,
  userLogin,
  userUpdate,
  resetPass,
  deleteUser,
  forgotPassword,
  newPass,
  regiVerify,
  aggregateData,
  getAllInfo,
  userLogout,
  forceLogin,
} = require("../controllers/userController.js");
const { validationToken, imgUpload } = require("../middlewares/middlewares");


let userRouter = express.Router();

userRouter.get('/specificUser', getAllInfo)
userRouter.post("/register", imgUpload, valCheck, userRegistration);
userRouter.post("/verification/:id", regiVerify);
userRouter.post("/login", emailValCheck, checkIfUserExist, userLogin);
userRouter.post(
  "/updateusers",
  emailValCheck,
  validationToken,
  checkIfUserExistWithToken,
  userUpdate
);
userRouter.get("/forceLogin",emailValCheck, checkIfUserExist,forceLogin)
userRouter.get("/logout", userLogout)

userRouter.post(
  "/resetpass",
  emailValCheck,
  validationToken,
  checkIfUserExistWithToken,
  resetPass
);
userRouter.post(
  "/removeuser",
  emailValCheck,
  validationToken,
  checkIfUserExistWithToken,
  deleteUser
);
userRouter.post(
  "/forgotpass",
  emailValCheck,
  validationToken,
  checkIfUserExistWithToken,
  forgotPassword
);
userRouter.post("/reset-password", emailValCheck, checkIfUserExist, newPass);
userRouter.get('/combinedData', aggregateData)


module.exports = userRouter;
