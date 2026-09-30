const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const session = require('cookie-session');
const cors = require('cors');
const { connect } = require('./db/connection');

const loginRouter = require('./login/login').router;
const signupRouter = require('./login/signup').router;
const forgetRouter = require('./login/forgetPassword').router;
const logoutRouter = require('./login/logout').router;
const addWatchlistRouter = require('./login/addwatchlist').router;
const uploadAndStreamingRouter =
	require('./uploading_and_streaming/main').router;
// const { upload } = require('./test_upload/test');
const express = require('express');
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://filmfolio-nlmergv9o-dp-nothing.vercel.app'
    ],
    credentials: true
};
app.use(cors(corsOptions));

app.set('trust proxy', 1); // trust first proxy
app.use(express.json());
app.use(express.urlencoded());
app.use(
	session({
		name: `express-session`,
		secret: 'some-secret-example',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // This will only work if you have https enabled!
			maxAge: 120000, // 1 min
			// expires:new Date(Date.now()+3600000),
		},
	})
);

app.use('/login', loginRouter);
app.use('/forget', forgetRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/upload', uploadAndStreamingRouter);
app.use('/stream', uploadAndStreamingRouter);
app.use('/addwatchlist', addWatchlistRouter);
// verifying whether user is already logged in or not
// app.use((req, res, next) => {
// 	if (req.session.username) {
// 		next();
// 	} else res.end('please login 😅');
// });
app.all('/', (_, res) => {
	// console.log(_.session.username);
	res.end(`${_.session.username}`);
});
const fs = require('fs');
// const multer = require('multer');
const Grid = require('gridfs-stream');
// const { GridFsStorage } = require('multer-gridfs-storage');
// let gfs;
const { Test } = require('./db/schemas');
const path = require('path');
const mongoose = require('mongoose');
// let storage;
// let upload = multer({ storage });
app.all('/test', async (req, res) => {
	// gfs.
	// const connection = await connect();
	// // var grid = require("gridfs-stream");
	// // Grid.mongo = mongoose.mongo;
	// // console.log(mongoose.mongo);
	// // const gfs = Grid(process.env.CONNECTIONSTRING, mongoose.mongo);
	// // gfs.exist
	// // console.log(gfs.findOne(options, callback));
	// // gfs.files;
	// // var mongoose = require('mongoose');
	// var Grid = require('gridfs-stream');
	// connection.once('open', function () {
	// 	var gfs = Grid(connection.db, mongoose.mongo);
	// 	// console.log(gfs.collection().collectionName);
	// 	var writestream = gfs.createWriteStream({
	// 		filename: 'my_file.txt',
	// 	});
	// 	res.pipe(writeStream);
	// 	// all set!
	// });
	//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// var mongoose = require('mongoose');
	var Grid = require('gridfs-stream');

	var conn = await mongoose.connect(process.env.CONNECTIONSTRING);
	conn.once('open', function () {
		const gridfsBucket = new mongoose.mongo.GridFSBucket(
			mongoose.connection.db,
			{
				bucketName: 'bucket_name',
			}
		);
		var gfs = new Grid(mongoose.connection.db, mongoose.mongo);
		// gfs.collection('User').find();
		// gfs.collection('User').insertOne({ image: Buffer() });
		// console.log(gfs.collection('User').find());
		console.log('HELLO');
		var writestream = gridfsBucket.openUploadStream('myfile.txt');
		req.pipe(writestream);
		req.on('end', () => {
			console.log('ended on success');
		});
		// gfs.collection('bucket_name');
		// all set!
	});
	//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// res.pipe(writestream);
	// fs.createReadStream('/some/path').pipe(writestream);
	// req.on('data', (data) => {
	// 	// console.log(data instanceof Buffer);
	// });
	// req.on('end', () => {
	// 	console.log(
	// 		'-----------------################################################'
	// 	);
	// });
	// // console.log(upload);
	return res.end('testing...');
});
app.listen(process.env.PORT, async () => {
	const connection = await connect();
	console.log('connected');
	console.log(
		`server is up and running at http://127.0.0.1:${process.env.PORT}`
	);
	// storage = new GridFsStorage({
	// 	db: connection,
	// 	file: (req, file) => {
	// 		// if (file.mimetype === 'image/jpeg') {
	// 		return {
	// 			bucketName: 'photos',
	// 		};
	// 		// } else {
	// 		// return null;
	// 		// }
	// 	},
	// });
	// console.log(connection);
	// gfs = new mongoose.mongo.GridFSBucket(connection.db, {
	// 	bucketName: 'uploads',
	// });
	// upload = multer({ storage });
	// upload.single('image');
	// console.log(storage.db);
	// console.log(upload.single('image'));
	// gfs = Grid(connection, mongoose);
	// console.log('connected');
});
