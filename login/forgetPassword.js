const express = require('express');
const app = express();
const router = express.Router();
router.use(express.json());
router.route('/').post((req, res) => {
	// console.log(req.body);
	res.send('forget');
});
module.exports.router = router;
