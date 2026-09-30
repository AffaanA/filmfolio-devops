import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

export default function SignUpForm() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [valerror, setvalerror] = useState('');
	const [hasAgreed, sethasAgreed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const Navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (username == '') {
			setvalerror('please enter a username');
		} else if (email == '') {
			setvalerror('please enter a email');
		} else if (password == '') {
			setvalerror('please enter a password');
		} else if (hasAgreed == false) {
			setvalerror('please agree with our t&c');
		} else {
			setIsLoading(true);
			axios
				.post(`${process.env.REACT_APP_BACKEND}/signup/`, {
					username,
					email,
					password,
				})
				.then(() => {
					Navigate('/sign-in');
					setIsLoading(false);
				})
				.catch((res) => {
					setvalerror(res.response.data);
					setIsLoading(false);
				});
		}
	};
	const handleChangeAgree = () => {
		if (hasAgreed == true) {
			sethasAgreed(false);
		} else {
			sethasAgreed(true);
			setvalerror('');
		}
	};
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
					<div
						className='formCenter'
						style={{ marginBottom: '30px' }}
					>
						<form
							// onSubmit={handleSubmit}
							className='formFields'
							// method='post'
						>
							<div className='formField'>
								<label
									className='formFieldLabel'
									htmlFor='username'
								>
									username
								</label>
								<input
									type='text'
									id='username'
									className='formFieldInput'
									placeholder='Enter your username'
									name='username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
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
									type='password'
									id='password'
									className='formFieldInput'
									placeholder='Enter your password'
									name='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className='formField'>
								<label
									className='formFieldLabel'
									htmlFor='email'
								>
									E-Mail Address
								</label>
								<input
									type='email'
									id='email'
									className='formFieldInput'
									placeholder='Enter your email'
									name='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className='formField'>
								<label className='formFieldCheckboxLabel'>
									<input
										className='formFieldCheckbox'
										type='checkbox'
										name='hasAgreed'
										value={hasAgreed}
										onChange={handleChangeAgree}
									/>{' '}
									I agree all statements in{' '}
									<a
										href='null'
										className='formFieldTermsLink'
									>
										terms of service
									</a>
								</label>
							</div>

							<div
								className='formField'
								style={{ marginBottom: '0px' }}
							>
								<button
									className='formFieldButton'
									onClick={handleSubmit}
									style={{ marginBottom: '0px' }}
								>
									Sign Up
								</button>{' '}
								<Link
									to='/sign-in'
									className='formFieldLink'
									style={{ marginBottom: '0px' }}
								>
									I'm already member
								</Link>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
