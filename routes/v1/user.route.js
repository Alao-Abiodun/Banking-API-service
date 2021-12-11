const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../../middleware/validation");

const {
  login,
  deposit,
  withdraw,
} = require("../../controllers/user.controller");

// USER

// login
router.post("/login", login);
// deposit
router.post("/deposit", validateUserToken, deposit);

router.post("/withdraw", validateUserToken, withdraw);

module.exports = router;
