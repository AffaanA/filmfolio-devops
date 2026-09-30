import React, { useEffect, useRef, useState } from 'react';
import './SearchBar.css';
import Tmdb from '../Tmdb';
export default function SearchBar({
	queryHandler,
	searchHandler,
	setIsLoading,
}) {
	const [query, setQuery] = useState('');
	const [isInputVisible, setIsInputVisible] = useState(false);
	const inputRef = useRef(null);
	useEffect(() => {
		//console.log(inputRef);
		if (query.length != 0) {
			searchHandler(true);
			setIsLoading(true);
			Tmdb.getSearchResults(query).then((data) => queryHandler(data));
		} else {
			setTimeout(() => {
				// if(query.length==0)
				setIsInputVisible(false);
				// }
			}, 3000);
			searchHandler(false);
		}
	}, [query]);
	return (
		<div className='search-bar-container'>
			<button
				className='search-btn'
				onClick={() => {
					if (!isInputVisible) {
						setTimeout(() => {
							inputRef.current.focus();
						}, 1000);
						// //console.log(inputRef.current.focus());
						setIsInputVisible(!isInputVisible);
					}
				}}
			></button>
			<input
				ref={inputRef}
				value={query}
				onChange={(e) => {
					setIsInputVisible(true);
					setQuery(e.target.value);
				}}
				className={`search-bar${isInputVisible ? ' visible' : ''}`}
				type='text'
			/>
		</div>
	);
}
