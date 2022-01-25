const mongoose = require("mongoose");
const Transaction = require("./models/Transactions");

const TRANSACTION = {
	async addTransaction (transaction) {
        if (!transaction._id) {
            transaction._id = mongoose.Types.ObjectId();
		}
		const ret = await Transaction.findOneAndUpdate({ _id: transaction._id }, transaction, {
			upsert: true,
			new: true,
			fields: {
				_id: true,
				user_id: true,
				value: true,
                currency: true,
                category: true,
                date: true
			}
		}).exec();

		return ret;
	},
	async findByUser (userId) {
		const ret = await Transaction.find({
			user_id: userId
		}, {
			_id: true,
			user_id: true,
            value: true,
            currency: true,
            category: true,
            date: true
		});

		return ret;
	},
	async findById (id) {
		const ret = await Transaction.findById({
			_id: id
		}, {
			_id: true,
            user_id: true,
            value: true,
            currency: true,
            category: true,
            date: true
		}).exec();

		return ret;
	},
	async delete (id) {
		const ret = await Transaction.deleteOne({ _id: id }).exec();
		return ret;
	},
	async findByDates (user_id, old_date, new_date) {
        const ret = await Transaction.find({
            user_id: user_id,
            date: {
                $gte: old_date, 
                $lt: new_date
            }
        }, {
			_id: true,
            user_id: true,
            value: true,
            currency: true,
            category: true,
            date: true
		}).exec();

		return ret;
	}
};

module.exports = TRANSACTION;
