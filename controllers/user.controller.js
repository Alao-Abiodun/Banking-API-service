const User = require("../models/user.model");
const Deposit = require("../models/deposit.model");
const Withdraw = require("../models/withdraw.model");
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
        401
      );
    }
    const newDeposit = new Deposit({
      amount_deposited: amount,
      payment_status: "successful",
      userId: _id,
    });
    newDeposit.save();
    userExist.acctBalance += newDeposit.amount_deposited;
    await User.findOneAndUpdate(
      { _id: _id },
      { acctBalance: userExist.acctBalance },
      { new: true, upsert: true }
    );
    const newTransaction = new Transaction({
      user_deposited: newDeposit._id,
    });
    newTransaction.save();
    return res.status(201).json({
      message: "User deposited successfully",
    });
    // return Response(res).success({ userExist, newTransaction }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { _id } = req.decoded;
    const { email } = req.query;
    const { amountToWithdraw } = req.body;
    const user = await User.findOne({ email }).select(["acctBalance"]);
    if (!user) {
      throw Error("User Not Found", "BAD REQUEST", 401);
    }
    user.acctBalance -= amountToWithdraw;
    const newWithdraw = new Withdraw({
      amount_withdrawn: amountToWithdraw,
      payment_status: "successful",
      userId: _id,
    });
    newWithdraw.save();
    const userBalance = await User.findOneAndUpdate(
      { email },
      { acctBalance: user.acctBalance },
      { new: true, upsert: true }
    );
    const newTransaction = new Transaction({
      user_withdrawn: newWithdraw._id,
    });
    newTransaction.save();
    return res.status(200).json({
      message: `user withdraw ${amountToWithdraw} successfully`,
      data: userBalance,
    });
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.fetchTransactions = async (req, res) => {
  try {
    // const { _id } = req.decoded;
    const allTransactions = await Transaction.find({})
      .populate("user_deposited")
      .populate("user_withdrawn");
    return res
      .status(200)
      .json({ message: "Successful", data: allTransactions });
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.transferFunds = async (req, res) => {
  try {
    const { id } = req.query;
    const { _id } = req.decoded;
    const { amountTransferred } = req.body;
    const userToSendFunds = await User.findOne({ _id: _id }).select([
      "+firstname",
      "+lastname",
    ]);
    const userToRecieveFunds = await User.findOne({ _id: id }).select([
      "+firstname",
      "+lastname",
    ]);
    if (!userToSendFunds) {
      throw Error("User doest not exist", "BAD REQUEST", 401);
    }
    if (!userToRecieveFunds) {
      throw Error("User doest not exist", "BAD REQUEST", 401);
    }
    userToRecieveFunds.acctBalance += amountTransferred;
    userToSendFunds.acctBalance -= amountTransferred;
    const newTransaction = new Transaction({
      userSendFunds: _id,
      userRecieveFunds: id,
    });
    newTransaction.save();
    return res.status(200).json({
      message: "Transfer successful",
      userToSendFunds,
      userToRecieveFunds,
      amountTransferred,
    });
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};
