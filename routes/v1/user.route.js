const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../../middleware/validation");

const { login, deposit } = require("../../controllers/user.controller");

// USER

// login
router.post("/login", validateUserToken, login);
// deposit
router.post("/deposit", validateUserToken, deposit);

module.exports = router;
