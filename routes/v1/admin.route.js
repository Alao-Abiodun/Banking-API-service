const express = require("express");
const router = express.Router();
// const { validateAdmin } = require("../../middleware/validation");

const { register, removeUser } = require("../../controllers/admin.controller");

// ADMIN
router.post("/register", register);

router.delete("/delete/:id", removeUser);

module.exports = router;
