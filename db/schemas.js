const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema({
	movieId: String,
	movie: Buffer,
});
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	moviewatchlist: {
		type: [String],
		require: false,
		default: null,
	},
	tvwatchlist: {
		type: [String],
		require: false,
		default: null,
	},
});
const TestSchema = new mongoose.Schema({
	image: {
		type: Buffer,
		default: null,
	},
});
const IdMappingSchema = new mongoose.Schema({
	apiId: String,
	uploadedId: String,
});
const User = mongoose.model('User', UserSchema);
const Movie = mongoose.model('Movie', MovieSchema);
const Test = mongoose.model('Test', TestSchema);
const IdMapping = mongoose.model('IdMapping', IdMappingSchema);
module.exports = { User, Movie, Test, IdMapping };
