const Wallet = require("../models/wallet.model");
const walletTransaction = require("../models/walletTransaction.model");
const Transaction = require("../models/transactions.model");
const Response = require("../lib/response");
const Error = require("../lib/error");

exports.sendMoney = async (req, res) => {};

exports.createWallet = async (req, res) => {
  try {
    const { _id } = req.decoded;
    const { name, min_balance, monthly_interest_rate } = req.body;
    // check if user have a wallet, else create wallet
    const userWallet = await Wallet.findOne({ owner: _id });

    if (userWallet) {
      throw Error("Wallet already exists", "BAD REQUEST", 400);
    }

    // if user does not have wallet, create a new one
    if (!userWallet) {
      const wallet = await Wallet.create({
        name,
        min_balance,
        owner: _id,
        monthly_interest_rate,
      });
      return Response(res).success({ wallet }, 201);
    }
    Response(res).success({ userWallet }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

// GET ALL USER DETAILS ALONE WITH USER WALLET AND TRANSACTION HISTORY
exports.userWalletDetails = async (req, res) => {
  try {
    const { name } = req.query;
    const userWalletDetails = await Wallet.find({ name }).populate("owner");
    Response(res).success({ userWalletDetails }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

exports.numberOfWallets = async (req, res) => {
  try {
    const numberOfWallets = await Wallet.countDocuments({});
    Response(res).success({ numberOfWallets }, 200);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.totalBalanceWallet = async (req, res) => {
  try {
    const overallWalletBalance = await Wallet.aggregate([
      {
        $group: {
          _id: { day: { $dayOfYear: "$createdAt" } },
          totalWalletBalance: {
            $sum: { $multiply: ["min_balance", "monthly_interest_rate"] },
          },
        },
      },
    ]);
    console.log(overallWalletBalance);
    // Response(res).success({ overallWalletBalance }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

exports.totalVolumeTransactions = async (req, res) => {
  try {
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.updateWallet = async (req, res, userId, amount) => {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true }
    );
    Response(res).success({ wallet }, 200);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

// GETS ALL WALLETS IN THE SYSTEM
exports.fetchWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({});
    Response(res).success({ wallets }, 200);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.createWalletTransaction = async (
  req,
  res,
  userId,
  status,
  currency,
  amount,
  paymentMethod
) => {
  try {
    const { amount, currency, status } = req.body;
    const { userId } = req.params;
    const walletTransaction = await walletTransaction.create({
      amount,
      userId,
      isInflow: true,
      currency,
      status,
      paymentMethod,
    });
    Response(res).success({ walletTransaction }, 201);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.createTransaction = async (
  req,
  res,
  userId,
  id,
  status,
  currency,
  amount,
  customer
) => {
  try {
    // const { id, status, currency, amount, customer} = req.body;
    // const { userId } = req.params;
    const transaction = await Transaction.create({
      userId,
      transactionId: id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone_number,
      amount,
      currency,
      paymentStatus: status,
      paymentGateway: "flutterwave",
    });
    Response(res).success({ transaction }, 201);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};
