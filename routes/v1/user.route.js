const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../../middleware/validation");

const {
  register,
  login,
  fetchUsers,
  userCount,
} = require("../../controllers/user.controller");

router.get("/fetch", fetchUsers);
router.get("/count", userCount);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
