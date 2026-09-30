const dotenv = require('dotenv');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const express = require('express');
const mongoose = require('mongoose');
const { IdMapping } = require('../db/schemas');
const cors = require('cors');
const app = express();
const { connect } = require('./../db/connection');
const router = express.Router();
router.use(express.json());
app.use(cors());
let gridfsBucket;
const gfs = Grid(mongoose.connection, mongoose.mongo);
gfs.collection('media');
const storage = new GridFsStorage({
	url: `${process.env.CONNECTIONSTRING}`,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			return resolve({
				bucketName: 'media',
			});
		});
	},
});
const upload = multer({ storage });
router.route('/get-video/:apiId/:option?').get(async (req, res) => {
	// console.log(req.params.apiId);
	const map = await IdMapping.findOne(
		{ apiId: req.params['apiId'] },
		{ uploadedId: 1, _id: 0 }
	);
	if (map) {
		const uploadedId = new mongoose.Types.ObjectId(map.uploadedId);
		// console.log(uploadedId);
		const file = await gfs.files.findOne({
			// filename: 'fe61b47179fa4fb576bd02a42fe1a421',
			_id: uploadedId,
		});
		if (req.params['option'] == 'download') {
			const readStream = gridfsBucket.openDownloadStream(file._id);
			res.set({
				'Content-Disposition': 'attachment; filename=test.mp4',
				'Content-Type': 'video/mp4',
				'Content-Length': file.length,
			});
			readStream.pipe(res);
			readStream.on('finish', () => {
				return res.end('downloaded successfully');
			});
			// res.pipe(readStream);
		} else {
			// Set appropriate headers for video streaming
			res.setHeader('Content-Type', 'video/mp4');
			res.setHeader('Accept-Ranges', 'bytes'); // Indicate that the server supports range requests
			const fileSize = file.length;

			// Parse the range header
			const rangeHeader = req.headers.range;
			if (rangeHeader) {
				const parts = rangeHeader.replace(/bytes=/, '').split('-');
				const start = parseInt(parts[0], 10);
				let end = Math.min(file.chunkSize + start, fileSize - 1);

				// Calculate the chunk size
				const chunkSize = end - start + 1;

				// Set response headers for partial content
				res.status(206); // Partial Content
				res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
				res.setHeader('Content-Length', chunkSize);
				// Create a readable stream for the specified range
				end++;
				const readStream = gridfsBucket.openDownloadStream(file._id, {
					start,
					end,
				});
				readStream.pipe(res);
			} else {
				// No range header, serve the entire video
				const readStream = gridfsBucket.openDownloadStream(file._id);
				readStream.on('end', () => console.log('ended'));
				readStream.pipe(res);
			}
		}
	} else return res.status(404).end('not found');
});
router
	.route('/upload-video/:id')
	.post(upload.single('video'), async (req, res) => {
		// const actualObjectId = new mongoose.Types.ObjectId(req.file.id);
		// console.log(req.file.id.toString());
		// console.log(req);
		const uploadedId = req.file.id.toString();
		const apiId = req.params['id'];
		try {
			const old_mapping = await IdMapping.find({ apiId });
			for (let oldMapping of old_mapping) {
				// await gridfsBucket.delete({
				// 	_id: oldMapping.uploadedId,
				// });
				mongoose.connection.db.collection('media.files').deleteMany({
					_id: new mongoose.Types.ObjectId(oldMapping.uploadedId),
				});
				mongoose.connection.db.collection('media.chunks').deleteMany({
					files_id: new mongoose.Types.ObjectId(oldMapping.uploadedId),
				});
				// await gfs.collection('media.chunks').deleteMany({
				// 	files_id: new mongoose.Types.ObjectId(oldMapping.uploadedId),
				// });
			}
		} catch (e) {
			console.log(e);
		}
		await IdMapping.deleteMany({ apiId });
		await IdMapping.insertMany([{ apiId, uploadedId }]);
		return res.status(200).end('uploaded successfully');
	});
(async () => {
	console.log(process.env.CONNECTIONSTRING);
	const conn = await mongoose.connect(process.env.CONNECTIONSTRING);
	gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
		bucketName: 'media',
	});
	console.log('upload');
})();
module.exports.router = router;
