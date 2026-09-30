import { Link, useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from 'react-social-login-buttons';
import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useAuth } from '../provider/authProvider';
export default function SignInForm({ isLogged, setIsLogged }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [valerror, setvalerror] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const Navigate = useNavigate();
	const { setToken } = useAuth();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (username == '') {
			setvalerror('please enter a username');
		} else if (password == '') {
			setvalerror('please enter a password');
		} else {
			setIsLoading(true);
			axios
				.post(`${process.env.REACT_APP_BACKEND}/login/`, {
					username,
					password,
				})
				.then((res) => {
					localStorage.setItem('username', username);
					localStorage.setItem('token', res.data.token);
					setToken(res.data.token);
					// console.log('----------');
					// console.log(res);
					// setIsLogged(true);
					Navigate('/home', {
						state: {
							username,
						},
					});
					setIsLoading(false);
				})
				.catch((res) => {
					setvalerror(res.response.data);
					setIsLoading(false);
				});
		}
	};
	// const [name, setName] = useState("");
	//     // const [email, setEmail] = useState("");

	//     // const handleOnSubmit = async (e) => {
	//     //     e.preventDefault();
	//     //     // const { name, email, password, reEnterPassword } = user
	//     //     // //console.log(user);
	//     //     // //console.log(email);
	//     //     if( name && email){
	//     //         axios.post("http://localhost:5000/register", { name, email })
	//     //         .then( res => {
	//     //             alert(res.data.message)
	//     //             setEmail("");
	//     //         setName("");
	//     //         })
	//     //     } else {
	//     //         alert("invlid input")
	//     //     }
	//     // }
	//     return (
	//         // <>
	//         //     <h1>This is React WebApp </h1>
	//         //     <form action="">
	//         //         <input type="text" placeholder="name"
	//         //         value={name} onChange={(e) => setName(e.target.value)} />
	//         //         <input type="email" placeholder="email"
	//         //         value={email} onChange={(e) => setEmail(e.target.value)} />
	//         //         <button type="submit"
	//         //         onClick={handleOnSubmit}>submit</button>
	//         //     </form>

	//         // </>
	//
	//     );
	// }

	// export default App;
	// useEffect(()=>{console.log("dddddddddddddd");console.log(isLogged);})
	return (
		<>
			{isLoading && (
				<div className='loading'>
					<img
						src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif'
						alt='Loading...'
					/>
				</div>
			)}
			{!isLoading && (
				<div>
					{valerror != '' ? (
						<div className='valerror'>{valerror}</div>
					) : (
						<div className='valnoerror'></div>
					)}

					<div className='formCenter'>
						<form className='formFields'>
							<div className='formField'>
								<label
									className='formFieldLabel'
									htmlFor='text'
								>
									username
								</label>
								<input
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									type='text'
									id='username'
									className='formFieldInput'
									placeholder='Enter your username'
									name='username'
									// value={this.state.email}
									// onChange={this.handleChange}
								/>
							</div>

							<div className='formField'>
								<label
									className='formFieldLabel'
									htmlFor='password'
								>
									Password
								</label>
								<input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									type='password'
									id='password'
									className='formFieldInput'
									placeholder='Enter your password'
									name='password'
									// value={this.state.password}
									// onChange={this.handleChange}
								/>
							</div>

							<div className='formField'>
								<button
									className='formFieldButton'
									onClick={handleSubmit}
								>
									Sign In
								</button>{' '}
								<Link
									to='/'
									className='formFieldLink'
								>
									Create an account
								</Link>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
