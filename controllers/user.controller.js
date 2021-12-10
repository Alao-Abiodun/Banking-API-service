const User = require("../models/user.model");
const Transaction = require("../models/transactions.model");
const Response = require("../lib/response");
const Error = require("../lib/error");
const bcrypt = require("bcrypt");
const { passwordCompare } = require("../lib/bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN } = process.env;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw Error("Please fill in the required field", "BAD REQUEST", 401);
    }

    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      (await passwordCompare(password, existingUser.password))
    ) {
      const token = await jwt.sign(
        { _id: existingUser._id, email: existingUser.email },
        TOKEN,
        { expiresIn: "2h" }
      );
      existingUser.token = token;
      // return Response(res).success({ existingUser, token }, 200);
      return res.status(200).json({ data: existingUser, token });
    }
    throw Error("Invalid Credentials", "BAD REQUEST", 401);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

exports.deposit = async (req, res) => {
  try {
    // check if user exist in the database before they can make a deposit
    const { _id } = req.decoded;
    const { email, amount } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw Error(
        "User does not have an account?, Please create an account",
        "BAD REQUEST",
        200
      );
    }
    const newTransaction = new Transaction({
      amount,
      payment_status: "successful",
      userId: _id,
    });
    newTransaction.save();
    userExist.acctBalance += newTransaction.amount;
    await User.findOneAndUpdate(
      { _id: _id },
      { acctBalance: userExist.acctBalance },
      { new: true, upsert: true }
    );
    return res.status(201).json({
      message: "User deposited successfully",
    });
    // return Response(res).success({ userExist, newTransaction }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};
