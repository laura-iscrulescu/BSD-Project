const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("It works!");
});

router.use("/transactions", require("./transaction"));

module.exports = router;
