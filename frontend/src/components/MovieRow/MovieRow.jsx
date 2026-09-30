import React, { useRef, useState } from 'react';
import './MovieRow.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RowItem from '../RowItem/RowItem';

//;;;;

export default function MovieRow({ title, items, hoverHandler,delwatchlist,iswatchlist}) {
	const [scrollX, setScrollX] = useState(0);
	const handleLeftArrow = () => {
		let x = scrollX + Math.round(window.innerWidth / 4);
		if (x > 0) {
			x = 0;
		}
		setScrollX(x);
	};

	const handleRightArrow = () => {
		let x = scrollX - Math.round(window.innerWidth / 4);
		let listW = items.results.length * 150;
		if (window.innerWidth - listW > x) {
			x = window.innerWidth - listW - 60;
		}
		setScrollX(x);
	};
	const handleScroll = (event) => {
		// Check if deltaX or deltaY is positive/negative to determine the scroll direction
		const isScrollingLeft = event.deltaX < 0;
		const isScrollingRight = event.deltaX > 0;

		if (isScrollingLeft) {
			let x = scrollX + Math.round(window.innerWidth / 84);
			// Clamp the left scroll to prevent going out of range
			// let listW = items.results.length * 122;
			x = Math.min(x, 0);
			// x=Math.max(x, window.innerWidth + listW - 60);
			setScrollX(x);
		} else if (isScrollingRight) {
			let x = scrollX - Math.round(window.innerWidth / 84);
			let listW = items.results.length * 122;
			// Clamp the right scroll to prevent going out of range
			x = Math.max(x, window.innerWidth - listW - 60);
			setScrollX(x);
		}
	};
	// const handleScroll = (event) => {
	// 	setScrollX(scrollX - event.deltaX);
	// };

	return (
		
		<div
			className='movieRow'
			onWheel={handleScroll}
		>
			<h2>{title}</h2>

			<div
				className='movieRow--left'
				onClick={handleLeftArrow}
			>
				<NavigateBeforeIcon style={{ fontSize: 50 }} />
			</div>

			<div
				className='movieRow--right'
				onClick={handleRightArrow}
			>
				<NavigateNextIcon style={{ fontSize: 50 }} />
			</div>
			<div className='movieRow--listarea'>
				<div
					className='movieRow--list'
					style={{
						marginLeft: scrollX,
						width: items.results.length * 150,
						transform: `translateX(${scrollX}px)`,
						display: 'flex',
						transition: 'transform 0.4s ease',
					}}
				>
					
					{items.results.length > 0 &&
						items.results
							.filter((item) => item?.media_type !== 'person')
							.map((item, key) => (
								// <div key={key} className="movieRow--item">
								//     {/* <div  style={{borderRadius:"18px"}}> */}
								//     <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.original_title} style={{borderRadius:"18px"}}/>

								// </div>
								// <div>
								<RowItem
									// changing id value from key to item.id
									// info for now contains the whole item object
									hoverHandler={hoverHandler}
									info={item}
									id={item.id}
									key={key}
									src={
										item.poster_path
											? `https://image.tmdb.org/t/p/w300${item.poster_path}`
											: null
									}
									delwatchlist={delwatchlist}
									iswatchlist={iswatchlist}
									alt={
										item.original_title
											? item.original_title
											: item.name
									}

								/>
								// </div>
							))}
				</div>
			</div>
		</div>
	);
}
