const express = require("express");
const db = require("./db/index");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const app = express();

const main = async () => {
	// init env vars
	dotenv.config({ path: path.join(__dirname, ".env") });

	const options = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		auth: {
			user: "root",
			password: "example"
		},
		useUnifiedTopology: true,
		dbName: "bsdDB"
	};

	if (process.env.MONGO_HOST) {
		await db.connect(`mongodb://${process.env.MONGO_HOST}`, options);
	} else {
		console.log("No MONGO_HOST has been initialized");
	}

	app.use(cors());

	app.use(express.json());

	app.use("/api/v1", require("./routes"));
	// handles 404 errors
	app.use(function (req, res, next) {
		res.sendStatus(404);
	});

	const PORT = parseInt(process.argv[2]) || 3000;
	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
	});
};

main();
