const express = require("express");
const router = express.Router();
// const { validateAdmin } = require("../../middleware/validation");

const { register } = require("../../controllers/admin.controller");

// ADMIN
router.post("/register", register);

module.exports = router;
