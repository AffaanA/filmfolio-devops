const express = require('express');
const { User } = require('../db/schemas');
const app = express();
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
router.use(express.json());
router.route('/').post(async (req, res) => {
	console.log(req.body);

	let token;
	try {
		const data = await User.find({
			username: req.body.username,
		});
		if (data.length == 0) {
			res.statusCode = 404;
			res.end('username not found');
		}
		 else if (bcrypt.compareSync(req.body.password,data[0].password)) {
			req.session.username = req.body.username;
			res.statusCode = 200;
			
			token = jwt.sign(
				{ username: data[0].username},
				process.env.JWT_SECRET,
				{ expiresIn: "2h" }
			  );
			// localStorage.setItem('username',req.session.username);
			// setTimeout(()=>{res.end(`hello ${req.body.username}`);},1000);

			res.status(200).json({ 
				username: data[0].username,
				password :data[0].password,
				token: token,});
			
			
		} else {
			
			res.statusCode = 404;
			res.end('incorrect password');
		}
		// //console.log(req.session);
	} catch (error) {
		res.statusCode = 404;
		res.end(`error: ${error}`);
	}
});
module.exports.router = router;
