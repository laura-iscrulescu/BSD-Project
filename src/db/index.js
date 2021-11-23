const mongoose = require("mongoose");

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
};

module.exports = DB;
