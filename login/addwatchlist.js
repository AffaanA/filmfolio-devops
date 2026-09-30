const express = require('express');
const { User } = require('../db/schemas');
const app = express();
const router = express.Router();

router.use(express.json());

router.get('/movie/:username',(req,res)=>{
	const {username}=req.params;
	User.findOne({
		username: username,
	}).then((user)=>{
		if(user.moviewatchlist){
			res.json(user.moviewatchlist);
		}		
	});
});
router.get('/tv/:username',(req,res)=>{
	const {username}=req.params;
	User.findOne({
		username: username,
	}).then((user)=>{
		if(user.tvwatchlist){
			res.json(user.tvwatchlist);
		}		
	});
});

router.post('/del', (req,res)=>{
	// const {type}=req.body;
	
	const userData = req.body;
	// //console.log(userData);
	User.findOne({
		username: userData.username,
	}).then((user)=>{		
	
		// //console.log("8888888888888888888");
		if(userData.type=='movie'){
			if(user.moviewatchlist.includes(userData.movieid)){
				const index = user.moviewatchlist.findIndex((id)=>{return id == userData.movieid});
				user.moviewatchlist.splice(index,1);
				user.save();
			}
			else{
				res.send("not present in list");
			}
		}
		else{
			if(user.tvwatchlist.includes(userData.movieid)){
				const index = user.tvwatchlist.findIndex((id)=>{return id == userData.movieid});
				user.tvwatchlist.splice(index,1);
				user.save();
			}
			else{
				res.send("not present in list");
			}
		}
	}
	);

});

router.post('/:movieid',(req,res)=>{
	const {movieid}=req.params;
	const userData = req.body;
	// //console.log(userData);
	User.findOne({
		username: userData.username,
	}).then((user)=>{		
		if(userData.type=='movie'){
			if(user.moviewatchlist.includes(movieid)){
				res.send("already added");
			}
			else{
				user.moviewatchlist.push(movieid);
				user.save();
				res.send("added succesfully");
			}
		}
		else{
			if(user.tvwatchlist.includes(movieid)){
				res.send("already added");
			}
			else{
				user.tvwatchlist.push(movieid);
				user.save();
				res.send("added succesfully");
			}
		}
		
		
	});
})
// router.route('/:movieid').post((req, res) => {
// 	//console.log("7t77777777777777777777777777");
//     // localStorage.setItem("username","deep");
//     const id=req.params['movieid'];
// 	try {
//         // const userData = JSON.parse(localStorage.getItem('username'))
        
// 		const data = User.find({
// 			username: userData,
// 		});
// 		//console.log(req);
//         //console.lof(data);
//         //console.log("---");
//         //console.log(id);
//         // //console.log(data);
// 		// if (data.length == 0) {
// 		// 	res.statusCode = 404;
// 		// 	res.end('please Login');
// 		// } else if (data[0].password == req.body.password) {
// 		// 	req.session.username = req.body.username;
// 		// 	res.statusCode = 200;
// 		// 	res.end(`hello ${req.body.username}`);
// 		// } else {
// 		// 	res.statusCode = 404;
// 		// 	res.end('incorrect password');
// 		// }
// 	} catch (error) {
// 		res.statusCode = 404;
// 		res.end(`error: ${error}`);
// 	}
// });

module.exports.router = router;
