// import axios from "axios";

const API_KEY = 'a529c88c4b88bffb7c515f794e2c8ff1';

const base = 'https://api.themoviedb.org/3/';
// import axios from "axios";
const get_popular = async (type, cat) => {
	axios
		.get(`${base}${type}/${cat}?language=en-US&page=1`)
		.then((res) => {
			const result = res.json();
			// //console.log(result);
		})
		.catch((err) => console.log(err));
};
get_popular();
