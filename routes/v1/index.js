const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");
const adminRoute = require("./admin.route");

router.use("/user", userRoute);
router.use("/admin", adminRoute);

module.exports = router;
