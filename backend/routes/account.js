const express = require("express");

const router = express.Router();

const z = require("zod");

router.use("/account", router);

module.exports = router;
