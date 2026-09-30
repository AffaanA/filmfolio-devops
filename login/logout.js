const express = require('express');
const app = express();
const router = express.Router();
router.use(express.json());
router.route('/').all((req, res) => {
	// //console.log(req.body);
	// req.session.destroy();
	req.session.destroy(function (err) {
		console.log('Destroyed session');
	});
	// res.redirect('/');
	res.end('logout');
});
exports.router = router;
