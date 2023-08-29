const Users = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { configMail, DBInfo } = require("../config/db.js");
const { generateOTP } = require("../middlewares/middlewares.js");
const Session = require('../models/session.js')

const userRegistration = async (req, res) => {
  try {
    let { username, email, password, designation, admin } = req.body,
      existedEmail,
      passHash,
      otp,
      newUser,
      link,
      mailOptions;

    existedEmail = await Users.findOne({ email: email });
    if (existedEmail) {
      return res.send({ status: 0, response: "user already exist" });
    }

    passHash = await bcrypt.hash(password, 10);
    otp = generateOTP();

    newUser = await Users.create({
      username: username,
      email: email,
      password: passHash,
      designation: designation,
      otp: otp,
      image: req.files,
      admin: admin
    });

    if (newUser) {
      link = `http://localhost:5000/users/verification/${newUser._id}`;
      mailOptions = {
        from: configMail.fromSmtp,
        to: newUser.email,
        subject: "Verification OTP",
        html: `<b>Your otp:<strong>${newUser.otp}</strong>,<br> Click here to verify :\n<a href=${link}>clickhere</small></p>`,
      };

      configMail.setUp.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.send({ status: 0, response: "Can't send OTP" });
        } else {
          return res.send({
            status: 1,
            response: `Verification email send to ${newUser.email}`,
            Link: link,
          });
        }
      });
    } else {
      return res.send({ status: 0, response: "can't registered" });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};


const regiVerify = async (req, res) => {
  let { id } = req.params,
    OTP,
    dbOTP;
  OTP = req.body.OTP;
  try {
    if (!id) {
      return res.send({ status: 0, response: "User not registered" });
    } else {
      dbOTP = await Users.findById({ _id: id });
      if (dbOTP.verified == false) {
        if (OTP === dbOTP.otp) {
          await Users.findByIdAndUpdate({ _id: id }, { verified: true });
          return res.send({
            status: 1,
            response: "User verified successfully",
          });
        } else {
          return res.send({ status: 0, response: "OTP doesn't match" });
        }
      } else {
        return res.send({ status: 0, response: "User already verified" });
      }
    }
  } catch (error) {
    return res.send({ status: 0, response: "Server error" });
  }
};


const userLogin = async (req, res) => {
  try {
    let { password } = req.body,
      matchPass,
      token;

    matchPass = await bcrypt.compare(password, userDBData.password);
    if (matchPass) {
      if (userDBData.verified == true) {
        token = jwt.sign(
          {
            user: {
              username: userDBData.username,
              email: userDBData.email,
              admin: userDBData.admin
            },
          },
          DBInfo.JWT_SECRET,
          { expiresIn: "2h" }
        );

        let checkIfLogged = await Session.findOne({ userId: userDBData._id })
        if (!checkIfLogged) {
          await Session.create({ userId: userDBData._id, token: token })
          return res.send({
            status: 1,
            response: "Login successfull",
            token: token,
          });
        }
        else {
          return res.send({ status: 0, response: "user already loggedIn" })
        }

      } else {
        return res.send({
          status: 0,
          response: "You need to verify inOrder to login",
        });
      }
    } else {
      return res.send({ status: 0, response: "Wrong credentials can't login" });
    }
  } catch (error) {
    return res.send(error);
  }
};

const userLogout = async (req, res) => {
  try {
    let {id}= req.body;
    await Session.deleteOne({ userId: id })
    return res.send({ status: 1, response: "User logged out successfully" })
  } catch (error) {
    return res.send({ status: 0, response: error.message })
  }
}

const forceLogin = async (req, res) => {
  try {
    let { password } = req.body,
      matchPass,
      token;
    matchPass = await bcrypt.compare(password, userDBData.password);
    if (matchPass) {
      if (userDBData.verified == true) {
        let checkIfLogged = await Session.findOne({ userId: userDBData._id })
        if (checkIfLogged) {
          await Session.deleteOne({ userId: userDBData._id })
          token = jwt.sign(
            {
              user: {
                username: userDBData.username,
                email: userDBData.email,
                admin: userDBData.admin
              },
            },
            DBInfo.JWT_SECRET,
            { expiresIn: "2h" }
          );
          await Session.create({ userId: userDBData._id, token: token })
          return res.send({
            status: 1,
            response: "Login successfull",
            token: token,
          });
        }
        else {
          return res.send({ status: 0, response: "No force loggin" })
        }
      } else {
        return res.send({
          status: 0,
          response: "You need to verify inOrder to login",
        });
      }
    } else {
      return res.send({ status: 0, response: "Wrong credentials can't login" });
    }
  } catch (error) {
    return res.send(error);
  }
}


const userUpdate = async (req, res) => {
  try {
    let { username, designation } = req.body,
      updatedData;
    updatedData = await Users.findOneAndUpdate(
      { email: userDBData.email },
      { $set: { username: username, designation: designation } },
      { new: true }
    );
    return res.send({
      status: 1,
      response: "Updated successfull",
      updatedInfo: {
        username: updatedData.username,
        designation: updatedData.designation,
      },
    });
  } catch (error) {
    return res.send({ status: 0, response: "server error" });
  }
};


const resetPass = async (req, res) => {
  try {
    let { currentPass, newPass, confirmPass } = req.body,
      curr,
      hashPass;
    curr = bcrypt.compare(currentPass, userDBData.password);
    if (curr && confirmPass === newPass) {
      hashPass = await bcrypt.hash(newPass, 10);
      await Users.findOneAndUpdate(
        { email: userDBData.email },
        { $set: { password: hashPass } }
      );
      return res.send({ status: 1, response: "Updated successfully" });
    }
  } catch (error) {
    return res.send({ status: 0, response: "server error" });
  }
};


const deleteUser = async (req, res) => {
  try {
    await Users.deleteOne({ email: userDBData.email }).then(
      res.send({ status: 1, response: "User deleted successfully" })
    );
  } catch (error) {
    return res.send({ status: 0, response: "server error" });
  }
};


const forgotPassword = async (req, res) => {
  try {
    let dbOTP, link, mailOptions;

    dbOTP = await Users.findOneAndUpdate(
      { email: userDBData.email },
      { otp: otp },
      { new: true }
    );

    link = `http://localhost:5000/users/reset-password`;

    mailOptions = {
      from: configMail.fromSmtp,
      to: userDBData.email,
      subject: "Password Reset",
      html: `<b>Your otp:<strong>${dbOTP.otp}</strong>,<br> Your reset link :\n<a href=${link}>clickhere</small></p>`,
    };

    configMail.setUp.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.send({ status: 0, response: "something went wrong" });
      } else {
        return res.send({
          status: 1,
          response: `Email send to ${userDBData.email}`,
          Link: link,
        });
      }
    });
  } catch (error) {
    return res.send({ status: 0, response: "server error", error: error });
  }
};


const newPass = async (req, res) => {
  try {
    let { password, confirmPassword, OTP } = req.body,
      dbOTP,
      encryptedPassword;
    if (password === confirmPassword) {
      dbOTP = await Users.findOne({ otp: userDBData.otp });
      if (OTP === dbOTP.otp) {
        encryptedPassword = await bcrypt.hash(password, 10);
        await Users.updateOne(
          {
            email: userDBData.email,
          },
          {
            $set: {
              password: encryptedPassword,
              otp: "rest"
            },
          }
        );

        return res.send({
          status: 1,
          email: userDBData.email,
          response: "verified",
        });
      } else {
        return res.send({ status: 0, response: "OTP is wrong" });
      }
    } else {
      res.send({ status: 0, response: "Password not matched" });
    }
  } catch (error) {
    return res.json({ status: "Something Went Wrong" });
  }
};


const aggregateData = async (req, res) => {
  try {
    const aggregated = await Users.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "userPosted",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.productName",
          totalQuantity: { $sum: "$productDetails.quantity" },
        },
      },
      {
        $project: {
          "productDetails.productName": 1,
          totalQuantity: 1,
          discount: {
            $cond: [{ $gte: ["$totalQuantity", 15] }, 50, 30],
          },
        },
      },
    ]);
    return res.send({ status: 1, reponse: aggregated });
  } catch (error) {
    return res.send({ status: 0, response: error });
  }
};


const getAllInfo = async (req, res) => {
  try {
    let id = req.body.id,
      usser,
      allInfo;

    usser = await Users.findById({ _id: id });
    allInfo = await Users.aggregate([
      { $match: { _id: usser._id } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "userPosted",
          as: "PostedProducts",
        },
      },
      { $project: { password: 0, otp: 0, designation: 0, } },
      {
        $lookup: {
          from: "sales",
          pipeline: [{ $match: { status: 2 } }],
          as: "userBuyed",
        },
      },
    ])

    let base = [];

    base.push(allInfo[0].image);
    base.push(allInfo[0].PostedProducts[0].image);
    base.push(allInfo[0].PostedProducts[0].pdf);

    let finalData = base.map((file) =>
      new Buffer.from(file).toString("base64")
    );

    return res.send({ status: 1, response: allInfo });
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};


module.exports = {
  userRegistration,
  getAllInfo,
  regiVerify,
  userLogin,
  userUpdate,
  userLogout,
  resetPass,
  deleteUser,
  forceLogin,
  forgotPassword,
  newPass,
  aggregateData,
};
