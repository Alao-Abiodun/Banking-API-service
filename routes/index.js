const express = require("express");
const router = express.Router();

// create version-one (v1) of the app
const v1 = require("./v1/index");

router.use("/v1", v1);

// create version-two (v2) of the app
// router.use("/v2", v2);

module.exports = router;
