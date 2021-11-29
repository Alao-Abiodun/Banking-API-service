const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");
const walletRoute = require("./wallet.route");

router.use("/user", userRoute);
router.use("/wallet", walletRoute);

module.exports = router;
