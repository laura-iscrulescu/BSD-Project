const mongoose = require("mongoose");
const CATEGORY = require("./categories");
const TRANSACTION = require("./transaction");

async function connect (URI, options) {
	try {
		await mongoose.connect(URI, options);
		console.log("MongoDB Connected...");
	} catch (err) {
		console.error(err);
	}
}

const DB = {
	connect,
	transaction: TRANSACTION,
	category: CATEGORY
};

module.exports = DB;
