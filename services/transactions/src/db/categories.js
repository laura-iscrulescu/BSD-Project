const mongoose = require("mongoose");
const Category = require("./models/Categories");

const CATEGORY = {
	async addCategory (category) {
		console.log(category);
        if (!category._id) {
            category._id = mongoose.Types.ObjectId();
		}
		console.log(category);
		const ret = await Category.findOneAndUpdate({ _id: category._id }, category, {
			upsert: true,
			new: true,
			fields: {
				_id: true,
				user_id: true,
				name: true,
				color: true
			}
		}).exec();

		return ret;
	},
	async findByUser (userId) {
		const ret = await Category.find({
			user_id: userId
		}, {
			_id: true,
			user_id: true,
			name: true,
			color: true
		});

		return ret;
	},
	async findById (id) {
		const ret = await Category.findById({
			_id: id
		}, {
			_id: true,
			user_id: true,
			name: true,
			color: true
		}).exec();

		return ret;
	},
	async delete (id) {
		const ret = await Category.deleteOne({ _id: id }).exec();
		return ret;
	},
};

module.exports = CATEGORY;
