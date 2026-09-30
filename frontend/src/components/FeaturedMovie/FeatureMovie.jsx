import React, { useEffect, useState } from 'react';
import './FeatureMovie.css';
import ReactPlayer from 'react-player';
import Tmdb from '../Tmdb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function FeatureMovie({ item: { info, trailer } }) {
	trailer = `https://www.youtube-nocookie.com/embed/${
		trailer?.split('?')[1].split('=')[1]
	}?rel=0&loop=1&autoplay=1`;
	// //console.log(trailer);
	const [videoState, setVideoState] = useState(false);
	let time;
	// //console.log(info.in_production);
	if (info?.release_date) {
		time = new Date(info?.release_date).getFullYear().toString();
	} else if (info?.first_air_date && info?.last_air_date) {
		time =
			new Date(info?.first_air_date).getFullYear().toString() +
			(info.in_production == false
				? ` - ${new Date(info?.last_air_date).getFullYear().toString()}`
				: '');
	} else if (info?.first_air_date) {
		time = new Date(info?.first_air_date).getFullYear().toString();
	}
	const Navigate = useNavigate();
	const playButtonHandler = (e) => {
		e.preventDefault();
		Navigate(`/player/${info.id}`, {
			state: { item: info },
		});
		//console.log(info);
	};
	useEffect(() => setVideoState(false), []);
	// let firstDate = new Date(info?.first_air_date);
	// let firstDate = new Date(
	// 	info?.release_date
	// 		? info?.release_date
	// 		: info?.last_air_date
	// 		? info?.last_air_date
	// 		: info?.first_air_date
	// );
	let genres = [];
	for (let i in info?.genres) {
		genres.push(info?.genres[i].name);
	}
	// //console.log(info?.name, '+++++++++++++++++++++++++++++===');
	let description = info?.overview;
	// if (description.length > 200) {
	// 	description = description.substring(0, 200) + '...';
	// }
	const watchlistHandler = () => {
		//console.log('hiwatchlistahandler');
		const username = localStorage.getItem('username');
		//console.log(info);
		//console.log("[[[[[[[[[[");
		let type;
		if (info.first_air_date) {
			type='tv';
		}
		else{
			type="movie";
		}
		axios.post(`${process.env.REACT_APP_BACKEND}/addwatchlist/${info.id}`,{"name":"abc",
	"username":username,"type":type},{
		"username":localStorage.getItem('username'),
		"token":localStorage.getItem('token'),
	});
	};

	useEffect(() => {
		setVideoState(false);
	}, [trailer]);
	return (
		<section
			className='featured'
			style={{
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundImage:
					!videoState || !trailer
						? info?.backdrop_path
							? `url(http://image.tmdb.org/t/p/original${info?.backdrop_path})`
							: `url(https://cdn-icons-png.flaticon.com/512/3163/3163508.png)`
						: '',
			}}
		>
			{trailer ? (
				<ReactPlayer
					showBuffering={false}
					loop
					onStart={() => setVideoState(true)}
					className='background-video'
					url={`${trailer}`}
					muted
					controls={false} // Show video controls
					playing={true} // Auto-play (change to true if you want it to auto-play)
					width='100%'
					height='100%'
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
				/>
			) : (
				''
			)}
			{/* <Youtube
				onPlay={() => setVideoState(true)}
				videoId={trailer?.split('?')[1].split('=')[1]}
				opts={{
					height: '100%', // Set the height to 100% to cover the container's height
					width: '100%', // Set the width to 100% to cover the container's width
					playerVars: {
						autoplay: 1,
						mute: 1,
						controls: 0,
						disablekb: 1,
						modestbranding: 1,
						rel: 0,
						loop: 1,
						poster: info?.backdrop_path
							? `url(http://image.tmdb.org/t/p/original${info?.backdrop_path})`
							: `url(https://cdn-icons-png.flaticon.com/512/3163/3163508.png)`,
					},
				}}
				className='background-video' // Add a class for styling if needed
			/> */}

			{/* <Youtube
				videoId={trailer.split('?')[1].split('=')[1]}
				opts={{
					playerVars: {
						autoplay: 1,
						mute: 1,
						controls: 0,
						modestbranding: 1,
						rel: 0,
					},
				}}
			/> */}
			{/* <video
				// autoPlay
				loop
				// muted
				style={{
					objectFit: 'cover',
					width: '100%',
					height: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 1,
				}}
			>
				<source
					src={`${trailer}`}
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video> */}
			<div className='featured--vertical'>
				<div className='featured--horizontal'>
					<div className='featured--name'>
						{info?.original_title
							? info?.original_title
							: info?.name}
					</div>
					<div className='featured--info'>
						<div className='featured--points'>
							{info?.vote_average} Rated
						</div>
						<div className='featured--year'>{time}</div>
						<div className='featured--seasons'>
							{info?.seasons?.length
								? 'seasons ' + info?.seasons.length
								: ''}
						</div>
						<div className='featured--episodes'>
							{info?.number_of_episodes
								? 'episodes ' + info?.number_of_episodes
								: ''}
						</div>

						{/* { if}
                        <div className="featured--seasons">{info?.number_of_seasons} seasons{info?.number_of_seasons !== 1 ? 's' : ''}</div> */}
					</div>
					<div
						style={{
							minBlockSize: '50px',
							minHeight: '50px',
							height: '120px',
							overflow: 'hidden',
						}}
					>
						<div
							className='featured--description'
							style={{
								overflow: 'hidden',
								display: '-webkit-box',
								WebkitLineClamp: 3,
								WebkitBoxOrient: 'vertical',
							}}
						>
							{description}
						</div>
					</div>
					<div className='featured--buttons'>
						<a
							className='featured--watchbutton'
							onClick={playButtonHandler}
							// href={'/player'}
							style={{ cursor: 'pointer' }}
						>
							▶ play
						</a>
						<a
							className='featured--mylistbutton'
							onClick={watchlistHandler}
							style={{ cursor: 'pointer' }}
						>
							+Add
						</a>
					</div>
					<div className='featured--genres'>
						{' '}
						<strong>Genres</strong> {genres.join(', ')}
					</div>
				</div>
			</div>
		</section>
	);
}
