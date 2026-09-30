import React, { useEffect, useState } from 'react';
import '../App.css';
import './home.css';
import Tmdb from './Tmdb';
import MovieRow from './MovieRow/MovieRow';
import FeatureMovie from './FeaturedMovie/FeatureMovie';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
	// const [query, setQuery] = useState('');
	const state = useLocation().state;
	const username = state?.username
		? state?.username
		: localStorage.getItem('username');
	// console.log(username);
	const [hoveredItem, setHoveredItem] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const [search, setSearch] = useState(false);
	const [movieList, setMovieList] = useState([]);
	const [featureData, setfeatureData] = useState(null);
	const [blackHeader, setBlackHeader] = useState(false);
	const [iswatchlist,setiswatchlist]=useState(false);
	const [movieSwitch, setMovieSwitch] = useState(
		localStorage.getItem('movieSwitch')
			? localStorage.getItem('movieSwitch')
			: 'movie'
	); // for switching movie and tv shows page
	const hoverHandler = (item) => {
		if (item.info) setHoveredItem(item);
	};

	const fun = async ()=>{
		
	}

	const delwatchlist=(item)=>{
		// console.log(item);
		let type;
		if (item.first_air_date) {
			type='tv';
		}
		else{
			type="movie";
		}
		const username = localStorage.getItem('username');
		// //console.log(type);
		// //console.log(username);
		if(type=='tv'){
			//console.log("00000");
			const listt=[...movieList];
			//console.log(listt);
			//console.log("-----");
			const index=listt[1].items.results.findIndex((i)=>{return i.id==item.id});
			listt[1].items.results.splice(index,1);
			//console.log("00000");
			//console.log(listt);
			setMovieList(listt);
		}
		else{
			//console.log("00000");
			
			const listt=[...movieList];
			//console.log(listt);
			//console.log("-----");
			const index=listt[0].items.results.findIndex((i)=>{return i.id==item.id});
			//console.log(listt[0].items.results[index]);
			listt[0].items.results.splice(index,1);
			//console.log("00000");
			// //console.log(listt);
			setMovieList(listt);
			//console.log(movieList);
		}
		axios.post(`${process.env.REACT_APP_BACKEND}/addwatchlist/del`,{"username":username,"type":type,"movieid":item.id},{
			"username":localStorage.getItem('username'),
			"token":localStorage.getItem('token'),
		}).then(()=>{

		});
		
		
		// setMovieSwitch('watchlist');
		
		
		
		// const list=[{slug:"movie watchlist",title:"movie watchlist",items:{results:[]}},{slug:"tv watchlist",title:"tv watchlist",items:{results:[]}}]
		// const datas =await axios.get(`http://127.0.0.1:3000/addwatchlist/movie/${username}`);
		// // let watchlist =datas.data;
		// for(let i=0;i<datas.data.length;i++){
		// 	let infos = await Tmdb.getMovieInfo(datas.data[i],'movie');
		// 	list[0].items.results.push(infos.info);
		// }
		// const datas2 =await axios.get(`http://127.0.0.1:3000/addwatchlist/tv/${username}`);
		// // let watchlist =datas.data;
		// for(let i=0;i<datas2.data.length;i++){
		// 	let infos = await Tmdb.getMovieInfo(datas2.data[i],'tv');
		// 	list[1].items.results.push(infos.info);
		// }
		// setMovieList(list);
		// fun();
	}
	const movieSwitchHandler = (movieSwitch) => {
		localStorage.setItem('movieSwitch', movieSwitch);
		setMovieSwitch(movieSwitch);
		setIsLoading(true);
	};
	const searchHandler = (setOrReset) => setSearch(setOrReset);
	const queryHandler = (data) => {
		setIsLoading(false);
		setSearchResult([data]);
	};
	useEffect(()=>{

	},[movieList]);
	useEffect(() => {
		const loadAllMovies = async () => {
			const link = await Tmdb.getTrailer();
			//console.log(link);
			let list = await Tmdb.getMovieHomeList();
			setMovieList(list);
			//console.log(list);
			let trending = list.filter((i) => i.slug === 'trending');
			while (true) {
				let randomChosen = Math.floor(
					Math.random() * (trending[0].items.results.length - 1)
				);
				let chosen = trending[0].items.results[randomChosen];
				let { info, trailer } = await Tmdb.getMovieInfo(
					chosen.id,
					'movie'
				);
				if (info) {
					setfeatureData({ info, trailer });
					break;
				}
			}
		};
		const loadWatchlist =async ()=>{
			const username=localStorage.getItem('username');
			//console.log("-----------");
			//console.log(username);
			const list=[{slug:"movie watchlist",title:"movie watchlist",items:{results:[]}},{slug:"tv watchlist",title:"tv watchlist",items:{results:[]}}]
			const datas =await axios.get(`${process.env.REACT_APP_BACKEND}/addwatchlist/movie/${username}`,{
				"username":localStorage.getItem('username'),
				"token":localStorage.getItem('token'),
			});
			// let watchlist =datas.data;
			for(let i=0;i<datas.data.length;i++){
				let infos = await Tmdb.getMovieInfo(datas.data[i],'movie');
				list[0].items.results.push(infos.info);
			}
			const datas2 =await axios.get(`${process.env.REACT_APP_BACKEND}/addwatchlist/tv/${username}`,{
				"username":localStorage.getItem('username'),
				"token":localStorage.getItem('token'),
			});
			// let watchlist =datas.data;
			for(let i=0;i<datas2.data.length;i++){
				let infos = await Tmdb.getMovieInfo(datas2.data[i],'tv');
				list[1].items.results.push(infos.info);
			}
			//console.log(list);
			setMovieList(list);

		}
		const loadAllTvShows = async () => {
			// setMovieList([]);
			let list = await Tmdb.getTvShowList();
			// //console.log(list);
			setMovieList(list);
			let trending = list.filter((i) => i.slug === 'trending');
			while (true) {
				let randomChosen = Math.floor(
					Math.random() * (trending[0].items.results.length - 1)
				);
				let chosen = trending[0].items.results[randomChosen];
				let { info, trailer } = await Tmdb.getMovieInfo(
					chosen.id,
					'tv'
				);
				if (info) {
					setfeatureData({ info, trailer });
					break;
				}
			}
		};
		// const loadSearchResults = async () => {
		// 	// const data = await Tmdb.getSearchResults(query);
		// 	// //console.log(data);
		// };
		if (movieSwitch == 'movie') {
			// Tmdb.getTrailer()
			// //console.log();
			setiswatchlist(false);
			setIsLoading(true);
			loadAllMovies().then(() => setIsLoading(false));
		} else if (movieSwitch == 'tvshow') {
			setiswatchlist(false);
			setIsLoading(true);
			loadAllTvShows().then(() => setIsLoading(false));
		}
		else if(movieSwitch == 'watchlist'){
			
			setiswatchlist(true);
			setIsLoading(true);
			loadWatchlist().then(()=> setIsLoading(false));
		}
		// if (search == true) {
		// 	loadSearchResults();
		// }
		// return () => clearInterval(id);
	}, [movieSwitch]);
	useEffect(() => {
		const scrollListener = () => {
			if (window.scrollY > 10) {
				setBlackHeader(true);
			} else {
				setBlackHeader(false);
			}
		};

		window.addEventListener('scroll', scrollListener);

		return () => {
			window.removeEventListener('scroll', scrollListener);
		};
	}, []);
	
	// //console.log(localStorage.getItem('username'));
	return (
		<div className='page'>
			
			<Header
				setIsLoading={setIsLoading}
				searchHandler={searchHandler}
				queryHandler={queryHandler}
				black={blackHeader}
				// setLoading={setIsLoading}
				movieSwitch={movieSwitch}
				movieSwitchHandler={movieSwitchHandler}
			/>
			
			{!iswatchlist?!hoveredItem && featureData  && <FeatureMovie item={featureData} />:""}
			{!iswatchlist ? hoveredItem && <FeatureMovie item={hoveredItem} />:""}
			{iswatchlist?<div style={{minHeight:"300px"}}></div>:""}
			<section className='lists'>
				{!search &&
					movieList.length &&
					movieList.map((item, key) => (
						<MovieRow
							hoverHandler={hoverHandler}
							key={key}
							title={item.title}
							items={item.items}
							delwatchlist={delwatchlist}
							iswatchlist={iswatchlist}
						/>
					))}
				{!movieList.length ? <div style={{fontSize:"1222",position:"relative"}}>list is empty</div>:''}	
				{search &&
					searchResult?.length &&
					searchResult.map((item, key) => (
						<MovieRow
							hoverHandler={hoverHandler}
							key={key}
							title={item.title}
							items={item.items}

						/>
					))}
			</section>

			{/* <Footer /> */}

			{isLoading && (
				<div className='loading'>
					<img
						src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif'
						alt='Loading...'
					/>
				</div>
			)}
			<Footer />
		</div>
	);
}
