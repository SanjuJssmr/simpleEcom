const { check, validationResult } = require("express-validator");
const Users = require("../models/users");

let valCheck, emailValCheck, checkIfUserExist, checkIfUserExistWithToken, checKIfAdmin;

valCheck = [

  check("username").notEmpty().withMessage("Username cannot be empty"),
  check("email").notEmpty().withMessage("Email cannot be empty"),
  check("password").notEmpty().withMessage("Password cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.send({ status: 0, response: errors[0].msg });
    } else {
      return next();
    }
  },
];


emailValCheck = [
  check("email").notEmpty().withMessage("Email cannot be empty"),
  check("email").isEmail().withMessage("Invalid email Id"),
  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.send({ status: 0, response: errors[0].msg });
    } else {
      return next();
    }
  },
];


checkIfUserExist = async (req, res, next) => {
  let userExist = await Users.findOne({ email: req.body.email });
  if (!userExist) {
    return res.send({ status: 0, response: "User Not Found" });
  } else {
    userDBData = userExist;
    next();
  }
};


checkIfUserExistWithToken = async (req, res, next) => {
  let userExist = await Users.findOne({ email: req.body.email });
  if (!userExist) {
    return res.send({ status: 0, response: "User Not Found" });
  }
  if (userExist.email !== req.user.email) {
    return res.send({
      status: 0,
      response: "Not authorized to perform the request",
    });
  } else {
    userDBData = userExist;
    next();
  }
};


checKIfAdmin = async (req, res, next) => {
  try {
    if (req.user.admin !== true) {
      return res.send({
        status: 0,
        response: "You're not an admin",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message })
  }
}


module.exports = {
  valCheck,
  emailValCheck,
  checkIfUserExist,
  checkIfUserExistWithToken,
  checKIfAdmin
};
