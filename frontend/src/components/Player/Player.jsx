import React, { useState, useEffect } from 'react';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import videojs from 'video.js';
import Tmdb from '../Tmdb/index';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import { useRef } from 'react';
import 'video.js/dist/video-js.min.css';
import './Player.css';
import logo from '../../assets/logo2.png';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Header from '../Header/Header';
export default function Player() {
	// getting id from my current locations
	const uploadRef = useRef(null);
	const formRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [apiId, setApiId] = useState(null);
	const id = useLocation().pathname.split('/')[2];
	const [list, setList] = useState(null);
	const [data, setData] = useState(null);
	const [trailer, setTrailer] = useState(null);
	const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
	const Navigate = useNavigate();
	const [poster, setPoster] = useState('');
	const item = useLocation().state;
	const player = useRef(null);
	const [showUploaded, setShowUploaded] = useState(false);
	const [showDownloaded, setShowDownloaded] = useState(false);
	const [showAdded,setShowAdded]=useState(false);
	const [addMessage,setAddMessage]=useState('');
	const uploadToastRef = useRef(null);
	const downloadToastRef = useRef(null);
	const watchlistToastRef = useRef(null);

	const getList = async () => {
		if (item.item.first_air_date) {
			let query = '';
			const main = [];
			const data = await Tmdb.getMovieInfo(item.item.id, 'tv');
			let start = 1;
			// //console.log(data.info, '())()))())()()');
			for (let i = 1; i <= data.info.number_of_seasons; i++) {
				query += `season/${i},`;
				if (i % 20 === 0 || i == data.info.number_of_seasons) {
					const res = await Tmdb.getEpisodes(item.item.id, query);
					let myeps = [];
					for (let j = start; j <= i; j++) {
						if (res) {
							myeps.push(res[`season/${j}`].episodes);
						} else break;
					}
					main.push(myeps);
					start = i + 1;
					query = '';
				}
			}
			// //console.log(main);
			setTrailer(data?.trailer);
			setList(main);
			setData(data.info);
			return null;
		} else {
			const data = await Tmdb.getMovieInfo(item.item.id, 'movie');
			// setApiId(
			// 	item.item.name + '-' + item.item.id + '-' + item.item.media_type
			// );
			setApiId(data.info.original_title + '-' + data.info.id + '-movie');
			setTrailer(data?.trailer);
			setData(data.info);
			return data.info.original_title + '-' + data.info.id + '-movie';
		}
	};
	useEffect(() => {
		setIsLoading(true);
		getList().then((movieApiId) => {
			const videoPlayer = videojs(player.current, {
				controls: true,
				autoplay: false,
				fluid: true,
			});
			// videoPlayer.src(``);
			if (!isPlayerInitialized) {
				// Initialize the Video.js player
				const videoPlayer = videojs(player.current, {
					controls: true,
					autoplay: false,
					fluid: true,
				});
				// videoPlayer.src(
				// 	`http://127.0.0.1:3000/stream/get-video/${apiId}`
				// );
				!movieApiId
					? (player.current.src = `${process.env.REACT_APP_BACKEND}/stream/get-video/${apiId}`)
					: (player.current.src = `${process.env.REACT_APP_BACKEND}/stream/get-video/${movieApiId}`);
				setIsPlayerInitialized(true);
			}
			setIsLoading(false);
		});
	}, []);
	const handleFileUpload = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const formData = new FormData();
			formData.append('video', selectedFile);
			setIsLoading(true);
			axios.post(`${process.env.REACT_APP_BACKEND}/upload/upload-video/${apiId}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data;',
						},
						"username":localStorage.getItem('username'),
						"token":localStorage.getItem('token'),
						
					}
				)
				.then(function (response) {
					if (response.status == 200) {
						setIsLoading(false);
						setShowUploaded(true);
					}
					// //console.log(
					// 	response.data,
					// 	'dddddddddddddddddddddddddddddddd'
					// );
				})
				.catch(function (error) {
					// if (uploadToastRef.current) {
					// 	// Modify the content of the Toast directly
					// 	uploadToastRef.current.querySelector(
					// 		'.toast-body'
					// 	).textContent = 'uploading not successful';
					// }
					setIsLoading(false);
					// setShowUploaded(true);
					// //console.error(error, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
				});
		}
	};

	const uploadHandler = () => {
		uploadRef.current.click();
	};
	const downloadHandler = () => {
		setIsLoading(true);
		axios
			.get(`${process.env.REACT_APP_BACKEND}/stream/get-video/${apiId}/download`, {
				responseType: 'blob', // Set the response type to 'blob'
			},{
				username:localStorage.getItem('username'),
				token:localStorage.getItem('token'),
			})
			.then(function (response) {
				//console.log(response);
				if (response.status == 200) {
					fileDownload(response.data, 'test.mp4');
					setIsLoading(false);
					setShowDownloaded(true);
				} else {
					// if (downloadToastRef.current) {
					// 	// Modify the content of the Toast directly
					// 	downloadToastRef.current.querySelector(
					// 		'.toast-body'
					// 	).textContent = 'download not successful';
					// }
					setIsLoading(false);
					// setShowDownloaded(true);
				}
			})
			.catch(function (error) {
				setIsLoading(false);
			});
	};
	// const trailerHandler = () => {};
	const watchlistHandler = () => {
		//console.log('hiwatchlistahandler');
		const username = localStorage.getItem('username');
		//console.log(id);
		let type;
		if (item.item.first_air_date) {
			type='tv';
		}
		else{
			type="movie";
		}
		axios.post(`${process.env.REACT_APP_BACKEND}/addwatchlist/${id}`,{"name":"abc",
	"username":username,"type":type},{
		"username":localStorage.getItem('username'),
		"token":localStorage.getItem('token'),
	})
	.then((res)=>{
			setShowAdded(true);
			setAddMessage(res.data);
		});
	};

	return (
		<div>
			<header className='black'>
				<div className='header--logo' onClick={()=>{Navigate('/home')}}>
					
						<img
							src={logo}
							alt='logo'
						/>
					
				</div>
				<div>{item.item.name}</div>
				<div className='header--user'>
					{/* <a href='/user'>
						<img
							src='https://i.pinimg.com/originals/b6/77/cd/b677cd1cde292f261166533d6fe75872.png'
							alt=''
						/>
					</a> */}
				</div>
			</header>
			{isLoading && (
				<div className='loading'>
					<img
						src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif'
						alt='Loading...'
					/>
				</div>
			)}
			<div style={{ display: isLoading ? 'none' : 'block' }}>
				<Toast
					ref={uploadToastRef}
					style={{
						position: 'absolute',
						top: '9%',
						left: '3%',
						zIndex: '100',
					}}
					data-bs-theme='dark'
					bg='success'
					show={showUploaded}
					onClose={() => {
						setShowUploaded(false);
					}}
				>
					<Toast.Header>
						<strong className='me-auto'>FILMFOLIO</strong>
					</Toast.Header>
					<Toast.Body>
						Woohoo, video uploaded successfully! <br />
						Thank you for the contribution !
					</Toast.Body>
				</Toast>
				<Toast
					ref={downloadToastRef}
					style={{
						position: 'absolute',
						top: '9%',
						right: '3%',
						zIndex: '100',
					}}
					data-bs-theme='dark'
					bg='danger'
					show={showDownloaded}
					onClose={() => {
						setShowDownloaded(false);
					}}
				>
					<Toast.Header>
						<strong className='me-auto'>FILMFOLIO</strong>
					</Toast.Header>
					<Toast.Body>video downloaded successfully!</Toast.Body>
				</Toast>
				<Toast
					ref={watchlistToastRef}
					style={{
						position: 'absolute',
						top: '10%',
						right: '50%',
						left : '50%',
						zIndex: '100',
					}}
					// position='top-center'
					data-bs-theme='dark'
					bg='Secondary'
					show={showAdded}
					onClose={() => {
						setShowAdded(false);
						setAddMessage('');
					}}
				>
					<Toast.Header>
						<strong className='me-auto'>FILMFOLIO</strong>
					</Toast.Header>
					<Toast.Body>{addMessage}</Toast.Body>
				</Toast>
				<div
					data-vjs-player='true'
					data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2] }'
					// poster='http://content.bitsontherun.com/thumbs/3XnJSIm4-480.jpg'
					style={{
						marginTop: '7vh',
					}}
				>
					<video
						src={`${process.env.REACT_APP_BACKEND}/stream/get-video/${apiId}`}
						ref={player}
						className='video-js vjs-default-skin'
						width='640px'
						height='267px'
						controls
						preload='none'
						poster={
							item.item.backdrop_path
								? `https://image.tmdb.org/t/p/w1280${item.item.backdrop_path}`
								: 'https://cdn-icons-png.flaticon.com/512/3163/3163508.png'
						}
						data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2] }'
					></video>
				</div>
				<div
					style={{
						marginLeft: '5vw',
						marginRight: '5vw',
						width: '90vw',
						display: 'flex',
						justifyContent: 'space-between', // Aligns items at the start and end of the row
					}}
				>
					<div>
						<Button
							style={{ color: 'white', border: 'none' }}
							variant='outline-danger'
							className='p-2 m-4'
							onClick={uploadHandler}
							onMouseOver={(e) =>
								(e.currentTarget.style.color = 'black')
							}
							onMouseOut={(e) =>
								(e.currentTarget.style.color = 'white')
							}
						>
							upload{' '}
							<img
								height={'32px'}
								width={'32px'}
								src='https://cdn1.iconfinder.com/data/icons/web-seo-5/91/SEODevelopment__Marketing_063-512.png'
								alt=''
							/>
						</Button>
						{/* getting input field to get file */}
						{/* <form
							ref={formRef}
							style={{ display: 'none' }}
							method='post'
							encType='multipart/form-data'
							action='http://127.0.0.1:3000/upload/upload-video'
						> */}
						<input
							ref={uploadRef}
							type='file'
							accept='video/*'
							style={{ display: 'none' }}
							onChange={handleFileUpload}
						/>
						{/* </form> */}
						<Button
							style={{ color: 'white', border: 'none' }}
							variant='outline-danger'
							className='p-2 m-4'
							onClick={downloadHandler}
							onMouseOver={(e) =>
								(e.currentTarget.style.color = 'black')
							}
							onMouseOut={(e) =>
								(e.currentTarget.style.color = 'white')
							}
						>
							download{' '}
							<img
								height={'32px'}
								width={'32px'}
								src='https://cdn4.iconfinder.com/data/icons/e-learning-color/64/download-video-material-512.png'
								alt=''
							/>
						</Button>
						<Button
							style={{ color: 'white', border: 'none' }}
							variant='outline-danger'
							className='p-2 m-4'
							onClick={watchlistHandler}
							onMouseOver={(e) =>
								(e.currentTarget.style.color = 'black')
							}
							onMouseOut={(e) =>
								(e.currentTarget.style.color = 'white')
							}
						>
							add to watchlist{' '}
							<img
								height={'32px'}
								width={'32px'}
								src='https://cdn0.iconfinder.com/data/icons/video-player-4/100/video_movie_clip_player-09-512.png'
								alt=''
							/>
						</Button>
					</div>
					<a
						href={trailer}
						target='_blank'
					>
						<Button
							// className='mr-2'
							className='p-2 m-4'
							style={{ border: 'none' }}
							variant='outline-light'
							// onClick={trailerHandler}
							onMouseOver={(e) =>
								(e.currentTarget.style.color = 'black')
							}
							onMouseOut={(e) =>
								(e.currentTarget.style.color = 'white')
							}
						>
							<img
								height={'32px'}
								width={'32px'}
								src='https://cdn4.iconfinder.com/data/icons/cinema-157/496/movie-player-video-media-watch-512.png'
								alt=''
							/>{' '}
							watch trailer
						</Button>
					</a>
				</div>
				{list &&
					list.map((part, i) => {
						return (
							<Accordion
								data-bs-theme='dark'
								key={i}
							>
								{part.map((season) => {
									return !season.length ? (
										<></>
									) : (
										<Accordion.Item
											style={{ marginTop: '0.7vh' }}
											eventKey={
												season[0]
													? `${season[0].season_number}`
													: new Date().toString()
											}
										>
											<Accordion.Header>
												Season{' '}
												{season[0]
													? `${season[0].season_number}`
													: new Date().toString()}
											</Accordion.Header>

											<Accordion.Body
												key={
													season[0]
														? `${season[0].season_number}`
														: new Date().toString()
												}
											>
												<ListGroup>
													{season.map(
														(episode, i) => {
															// //console.log(epis);
															return (
																<ListGroup.Item
																	variant='dark'
																	action
																	onClick={() => {
																		setApiId(
																			item
																				.item
																				.name +
																				'-' +
																				item
																					.item
																					.id +
																				'-' +
																				item
																					.item
																					.media_type +
																				'-' +
																				episode.id
																		);
																	}}
																	key={
																		season[0]
																			.season_number
																			? `${season[0].season_number}-${episode.episode_number}`
																			: new Date.toString()
																	}
																>
																	<h4>
																		Episode
																		{` ${
																			i +
																			1
																		}`}
																		:{' '}
																		{
																			episode.name
																		}
																	</h4>
																	<span>
																		episode:
																		{` ${episode.episode_number}`}
																	</span>
																	{episode.runtime ? (
																		<div>
																			runtime:
																			{` ${episode.runtime} minutes`}
																		</div>
																	) : (
																		''
																	)}
																	{episode.overview ? (
																		<div>
																			overview:
																			{` ${episode.overview}`}
																		</div>
																	) : (
																		''
																	)}
																	{episode.vote_average ? (
																		<div>
																			rating:
																			{` ${episode.vote_average} ⭐`}
																		</div>
																	) : (
																		''
																	)}
																	{episode.air_date ? (
																		<div>
																			aired
																			on:{' '}
																			{` ${episode.air_date}`}
																		</div>
																	) : (
																		''
																	)}
																</ListGroup.Item>
															);
														}
													)}
												</ListGroup>
											</Accordion.Body>
										</Accordion.Item>
									);
								})}
							</Accordion>
						);
					})}
				{data && (
					<div style={{ marginTop: '0.7vh' }}>
						<h1> {data.original_title}</h1>
						<span> {data.tagline}</span>
						<p>Overview: {data.overview}</p>
						<span>duration: {data.runtime} minutes</span>
					</div>
				)}
			</div>
		</div>
	);
}
{
	/* <ReactPlayer
				controls
				url={`https://www.youtube-nocookie.com/embed/${
					trailer?.split('?')[1].split('=')[1]
				}?rel=0&loop=1&autoplay=1`}
				muted
				playing={true}
				config={{
					youtube: {
						playerVars: {
							modestbranding: 1,
							controls: 0,
							showinfo: 0,
							rel: 0,
						},
					},
				}}
			/> */
}
{
	/* <div class='background'>
				<div class='videoWrapper'>
					<header class='cover'></header>
					<iframe
						width='1920'
						height='1080'
						src={`https://www.youtube-nocookie.com/embed/${
							trailer?.split('?')[1].split('=')[1]
						}?rel=0&loop=1&autoplay=1`}
						frameborder='0'
						allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
						allowfullscreen
					></iframe>

					<footer class='cover'></footer>
				</div>
			</div> */
}
{
	/* <div>Player</div> */
}
{
	/* <div data-vjs-player> */
}
{
	/* <div
				className='video-container'
				data-vjs
			>
				<video
					className='video-js'
					poster={`https://image.tmdb.org/t/p/w500${item.item.backdrop_path}`}
					controls
					src={trailer}
					// src={`http://127.0.0.1:3000/stream/get-video/${id}`}
				></video>
			</div> */
}

// import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.min.css';
// import './Player.css';

// export default function Player() {
// 	const videoRef = useRef(null);

// 	useEffect(() => {
// 		// Check if the video element is present in the DOM
// 		if (videoRef.current) {
// 			const player = videojs(videoRef.current, {
// 				controls: true,
// 				autoplay: false,
// 				fluid: true,
// 			});
// 			player.src('https://vjs.zencdn.net/v/oceans.mp4');
// 		}
// 	}, [videoRef]);

// 	return (
// 		<div>
// 			<video
// 				ref={videoRef}
// 				className='video-js vjs-default-skin'
// 				id='my_video_1'
// 				// className='video-js vjs-default-skin'
// 				width='640px'
// 				height='267px'
// 				controls
// 				preload='none'
// 				poster='http://content.bitsontherun.com/thumbs/3XnJSIm4-480.jpg'
// 				data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2] }'
// 			></video>
// 		</div>
// 	);
// }
