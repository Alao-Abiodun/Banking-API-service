const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../../middleware/validation");

const {
  createWallet,
  createWalletTransaction,
  createTransaction,
  updateWallet,
  fetchWallets,
  userWalletDetails,
  numberOfWallets,
  totalBalanceWallet,
} = require("../../controllers/wallet.controller");

router.get("/fetchAll", fetchWallets);
router.get("/userWalletDetail", userWalletDetails);
router.get("/walletAvailable", numberOfWallets);
router.get("/totalBalanceWallet", totalBalanceWallet);

router.post("/create", validateUserToken, createWallet);
router.post("/walletTransaction", createWalletTransaction);
router.post("createTransaction", createTransaction);

router.patch("/updateWallet", updateWallet);

module.exports = router;
