const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("It works!");
});

router.use("/transactions", require("./transaction"));
router.use("/categories", require("./categories"));

module.exports = router;
