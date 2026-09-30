import React, { useEffect, useState } from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	NavLink,
} from 'react-router-dom';
import Home from './components/Home';
import Login from './page/Login';
import User from './components/User/User';
import Player from './components/Player/Player';
import Routes from '../src/components/Routes';
import AuthProvider from "./provider/authProvider";
import Offline from '../src/components/Offline/Offline';

function App() {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const handleOnlineStatus = () => {
		setIsOnline(navigator.onLine);
	};

	useEffect(() => {
		window.addEventListener('online', handleOnlineStatus);
		window.addEventListener('offline', handleOnlineStatus);
		return () => {
			window.removeEventListener('online', handleOnlineStatus);
			window.removeEventListener('offline', handleOnlineStatus);
		};
	}, []);
	return isOnline ? (
		// <Router>
		// 	<Routes>
		// 		<Route
		// 			path='/home'
		// 			element={<Home />}
		// 		/>
		// 		<Route
		// 			path='/user'
		// 			element={<User />}
		// 		/>
		// 		<Route
		// 			path='/player/:movieid'
		// 			element={<Player />}
		// 		/>
		// 		<Route
		// 			path='/*'
		// 			element={<Login />}
		// 		/>
		// 	</Routes>
		// </Router>
		<AuthProvider>
		<Routes />
	  	</AuthProvider>
	) : (
		<Offline />
		// <div>you are offline</div>
	);
}

export default App;
