const express = require("express");
const router = express.Router();
// const { validateAdmin } = require("../../middleware/validation");

const {
  register,
  removeUser,
  reverseTransfer,
} = require("../../controllers/admin.controller");

// ADMIN
router.post("/register", register);

router.delete("/delete/:id", removeUser);

router.put("/transfer/reverse", reverseTransfer);

module.exports = router;
