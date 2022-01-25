const mongoose = require("mongoose");

const Transactions = new mongoose.Schema({
	user_id: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
        default: Date.now,
		required: true
	}
});

const TransactionDB = mongoose.model("Transactions", Transactions);

module.exports = TransactionDB;
