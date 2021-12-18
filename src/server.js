const express = require("express");
const db = require("./db/index");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const app = express();

const main = async () => {
	// init env vars
	dotenv.config({ path: path.join(__dirname, ".env") });

	const { MONGO_URI, MONGO_USER, MONGO_PASSWORD } = process.env;

	if (MONGO_URI && MONGO_USER && MONGO_PASSWORD) {
		const options = {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
			auth: {
				user: MONGO_USER,
				password: MONGO_PASSWORD
			},
			dbName: "bsdDB"
		};
		await db.connect(MONGO_URI, options);
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
