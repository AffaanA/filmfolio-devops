import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo2.png';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import SearchBar from '../SearchBar/SearchBar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
// 	width: 70,
// 	height: 32,
// 	padding: 9,
// 	'& .MuiSwitch-switchBase': {
// 		margin: 1,
// 		padding: 0,
// 		transform: 'translateX(6px)',
// 		'&.Mui-checked': {
// 			color: '#fff',
// 			transform: 'translateX(30px)',
// 			'& .MuiSwitch-thumb:before': {
// 				backgroundImage: `url('https://emoji.aranja.com/static/emoji-data/img-google-136/1f4fa.png')`,
// 			},
// 			'& + .MuiSwitch-track': {
// 				opacity: 1,
// 				backgroundColor:
// 					theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
// 			},
// 		},
// 	},
// 	'& .MuiSwitch-thumb': {
// 		backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
// 		width: 32,
// 		height: 32,
// 		'&:before': {
// 			content: "''",
// 			position: 'absolute',
// 			width: '100%',
// 			height: '100%',
// 			left: 0,
// 			top: 0,
// 			backgroundRepeat: 'no-repeat',
// 			backgroundPosition: 'center',
// 			backgroundImage: `url('https://emoji.aranja.com/static/emoji-data/img-google-136/1f3a5.png')`,
// 			backgroundSize: '20px 20px',
// 		},
// 	},
// 	'& .MuiSwitch-track': {
// 		opacity: 1,
// 		backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
// 		borderRadius: 20 / 2,
// 	},
// }));
export default function Header({
	black,
	movieSwitch,
	movieSwitchHandler,
	queryHandler,
	searchHandler,
	setIsLoading,
}) {
	const Navigate = useNavigate();
	const { setToken } = useAuth();
	const logout = (e) => {
		e.preventDefault();
		setIsLoading(true);
		axios
			.post(`${process.env.REACT_APP_BACKEND}/logout/`)
			.then(() => {
				localStorage.removeItem('username');

				setToken();
				Navigate('/', { replace: true });
				Navigate('/sign-in');
				setIsLoading(false);
			})
			.catch((err) => {
				localStorage.removeItem('username');

				setToken();
				Navigate('/', { replace: true });
				Navigate('/sign-in');
				setIsLoading(false);
			});
	};
	// //console.log(movieSwitch);
	return (
		// <h1>hi</h1>
		<header className={black ? 'black' : ''}>
			<div className='header--logo'>
				<a href='/home'>
					<img
						src={logo}
						alt='logo'
					/>
				</a>
			</div>
			<Navbar
				bg='transparent'
				variant='dark'
				expand='lg'
				style={{ marginRight: 'auto' }}
			>
				<Container>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='me-auto'>
							<Nav.Link
								active={movieSwitch == 'movie' ? true : false}
								onClick={() =>
									movieSwitch != 'movie' ? movieSwitchHandler('movie') : null
								}
							>
								Movies{' '}
								{/* {movieSwitch == 'movie' ? (
									<img
										src='https://cdn3.iconfinder.com/data/icons/netflix-6/64/25_Documentary_camera_video_movie_film-256.png'
										alt='Movie Icon'
										style={{
											width: '30px',
											height: '28px',
											marginTop: '-4px',
											transition: 'all 3s', // Add a transition for all properties
										}} // Adjust the size as needed
									/>
								) : (
									''
								)} */}
							</Nav.Link>
							<Nav.Link
								active={movieSwitch == 'tvshow' ? true : false}
								onClick={() =>
									movieSwitch != 'tvshow' ? movieSwitchHandler('tvshow') : null
								}
							>
								Tv Shows{' '}
								{/* {movieSwitch == 'tvshow' ? (
									<img
										src='https://cdn3.iconfinder.com/data/icons/netflix-6/64/17_Tv_Show_television_old_classic-64.png'
										alt='Tvshow Icon'
										style={{
											width: '30px',
											height: '28px',
											marginTop: '-4px',
											transition: 'all 3s', // Add a transition for all properties
										}} // Adjust the size as needed
									/>
								) : (
									''
								)} */}
							</Nav.Link>
							<Nav.Link
								active={movieSwitch == 'watchlist' ? true : false}
								onClick={() =>
									movieSwitch != 'watchlist'
										? movieSwitchHandler('watchlist')
										: null
								}
							>
								Watchlist
								{/* {movieSwitch == 'watchlist' ? (
									<img
										src='https://cdn3.iconfinder.com/data/icons/netflix-5/64/26_3D_Animation_glasses_movie_film-256.png'
										alt='Watchlist Icon'
										style={{
											width: '30px',
											height: '28px',
											marginTop: '-4px',
											transition: 'all 3s', // Add a transition for all properties
										}} // Adjust the size as needed
									/>
								) : (
									''
								)} */}
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<SearchBar
				searchHandler={searchHandler}
				queryHandler={queryHandler}
				setIsLoading={setIsLoading}
			/>
			<Dropdown
				className='d-inline mx-2'
				variant='dark'
				// style={{ visibility: 'hidden' }}
			>
				<Dropdown.Toggle
					id='dropdown-autoclose-true'
					className='header--user'
					style={{ background: 'transparent', border: 'none' }}
				>
					<img
						src='https://i.pinimg.com/originals/b6/77/cd/b677cd1cde292f261166533d6fe75872.png'
						alt=''
					/>
				</Dropdown.Toggle>
				<Dropdown.Menu variant='dark'>
					<Dropdown.Item onClick={logout}>logout</Dropdown.Item>
					{/* <Dropdown.Item href='#'>Menu Item</Dropdown.Item> */}
					{/* <Dropdown.Item href='#'>Menu Item</Dropdown.Item> */}
				</Dropdown.Menu>
			</Dropdown>
			{localStorage.getItem('username')}
		</header>
	);
}
