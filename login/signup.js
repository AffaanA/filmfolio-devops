const express = require('express');
const app = express();
const { User } = require('../db/schemas');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();
router.use(express.json());
router.route('/').post(async (req, res) => {
	// console.log(User);
	// const data = JSON.parse(req.body);
	// console.log(req.body);
	const username = req.body.username;
	let password = req.body.password;
	const email = req.body.email;
	const data = await User.find();
	try {
		let temp = (user = await User.findOne({ username }));
		if (user) {
			return res.status(400).json({ msg: 'Email already exists' });
		}

		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);

		await User.insertMany([{ username, password, email }]);

		return res.status(200).end('signup');
	} catch (error) {
		console.log(error);
		return res.status(405).end(`error: ${error}`);
	}
	// console.log(req.body);
});
module.exports.router = router;
