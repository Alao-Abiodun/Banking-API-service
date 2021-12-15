const express = require("express");
const router = express.Router();
// const { validateAdmin } = require("../../middleware/validation");

const {
  register,
  removeUser,
  reverseTransfer,
  disableUserAccount,
} = require("../../controllers/admin.controller");

// ADMIN
router.post("/register", register);

router.delete("/delete/:id", removeUser);

router.put("/transfer/reverse", reverseTransfer);

router.delete("/revoke", disableUserAccount);

module.exports = router;
