const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/add", async (req, res) => {
	const transaction = req.body;

	if (transaction.user_id && transaction.value && transaction.currency && transaction.category && transaction.date) {
        try {
            const newTransaction = await db.transaction.addTransaction(transaction);
            res.status(200).send(newTransaction);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
	} else {
		res.sendStatus(400);
	}
});

router.post("/delete", async (req, res) => {
	try {
		const { transactionId } = req.body;
        if (transactionId) {
            let trans = await db.transaction.findById(transactionId);
            if (trans) {
                await db.transaction.delete(transactionId)
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(400);
        }
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

router.post("/", async (req, res) => {
    const { user_id } = req.body;
    if (user_id) {
        try {
            const ret = await db.transaction.findByUser(user_id);
            res.status(200).send(ret);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
    }
});

router.post("/date", async (req, res) => {
    const { user_id, old_date, new_date } = req.body;
    if (user_id && old_date && new_date) {
        if (old_date > new_date) {
            res.sendStatus(400);
        } else {
            try {
                const ret = await db.transaction.findByDates(user_id, old_date, new_date);
                res.status(200).send(ret)
            } catch (err) {
                console.error(err);
                res.sendStatus(500);
            }    
        }
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;
