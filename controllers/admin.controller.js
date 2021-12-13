const User = require("../models/user.model");
const Response = require("../lib/response");
const Error = require("../lib/error");
// const bcrypt = require("bcrypt");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN } = process.env;

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!(firstname && lastname && email && password)) {
      throw Error("All field is required", "BAD REQUEST", 401);
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      throw Error("User already exists", "BAD REQUEST", 401);
    }
    const hashPassword = await passwordHash(password);
    const newUser = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashPassword,
    });
    const token = await jwt.sign(
      { _id: newUser._id, email: newUser.email, role: newUser.role },
      TOKEN,
      { expiresIn: "2h" }
    );
    newUser.token = token;
    // Response(res).success({ newUser, token }, 201);
    return res.status(201).json({ data: newUser, token });
  } catch (error) {
    console.log(error);
    Response(res).error(error, error.code);
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw Error("Id Not Found!", "BAD REQUEST", 400);
    }
    await User.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.log(error);
    Response(res).error(error, error.code);
  }
};

// exports.reverseTransfer = async (req, res) => {
//   try {
//     const { sender, reciever } = req.params;
//     const userToSendFunds = await User.findOne({ _id: sender }).select([
//       "+firstname",
//       "+lastname",
//     ]);
//     const userToRecieveFunds = await User.findOne({ _id: reciever }).select([
//       "+firstname",
//       "+lastname",
//     ]);
//     if (!userToSendFunds) {
//       throw Error("User doest not exist", "BAD REQUEST", 401);
//     }
//     if (!userToRecieveFunds) {
//       throw Error("User doest not exist", "BAD REQUEST", 401);
//     }
//     userToRecieveFunds.acctBalance -= amountTransferred;
//     userToSendFunds.acctBalance += amountTransferred;
//     const newTransaction = new Transaction({
//       userSendFunds: _id,
//       userRecieveFunds: id,
//     });
//     newTransaction.save();
//     return res.status(200).json({
//       message: "Transfer Revoked",
//       userToSendFunds,
//       userToRecieveFunds,
//       amountTransferred,
//     });
//   } catch (error) {
//     Response(res).error(error, error.code);
//   }
// };

exports.disableUserAccount = async (req, res) => {};
