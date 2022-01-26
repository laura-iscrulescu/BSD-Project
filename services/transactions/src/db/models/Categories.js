const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
	user_id: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	color: {
		type: {
			r: {
				type: Number,
				required: true
			},
			g: {
				type: Number,
				required: true
			},
			b: {
				type: Number,
				required: true
			},
		},
		required: true
	}
});

const CategoriesDB = mongoose.model("Categories", Categories);

module.exports = CategoriesDB;
