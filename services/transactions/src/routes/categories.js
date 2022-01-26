const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/add", async (req, res) => {
	const category = req.body;

	if (category.user_id && category.name && category.color) {
        try {
            const newCategory = await db.category.addCategory(category);
            res.status(200).send(newCategory);
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
		const { categoryId } = req.body;
        if (categoryId) {
            let trans = await db.category.findById(categoryId);
            if (trans) {
                await db.category.delete(categoryId)
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
            const ret = await db.category.findByUser(user_id);
            res.status(200).send(ret);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;
