// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './RoWItem.css';
// import Tmdb from '../Tmdb';
// export default function RowItem(props) {
// 	function fun(e) {
// 		Tmdb.getMovieInfo(props.info.id, props.info.media_type).then((data) =>
// 			props.hoverHandler(data)
// 		);
// 	}
// 	const Navigate = useNavigate();
// 	return (
// 		<div
// 			key={props.id}
// 			className='movieRow--item'
// 			onMouseOver={fun}
// 			onClick={() => {
// 				// adding movie id to next route
// 				Navigate(`/player/${props.id}`, {
// 					state: {
// 						// sending whole item to player
// 						item: props.info,
// 					},
// 				});
// 			}}
// 		>
// 			{/* <div  style={{borderRadius:"18px"}}> */}
// 			<img
// 				src={props.src ? props.src : null}
// 				alt={props.alt}
// 				style={{ borderRadius: '18px' }}
// 			/>
// 		</div>
// 	);
// }

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoWItem.css';
import Tmdb from '../Tmdb';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon from Material-UI

export default function RowItem(props) {
  let timeout = null;
  function fun(e) {
    timeout = setTimeout(() => {
      Tmdb.getMovieInfo(props.info.id, props.info.media_type).then((data) =>
        props.hoverHandler(data)
      );
    }, 600);
    
  }
  const Navigate = useNavigate();
  return (
    <div
      key={props.id}
      className='movieRow--item'
      onMouseOver={fun}
      onMouseOut={() => {
        clearTimeout(timeout);
      }}
      onClick={() => {
        // adding movie id to the next route
        Navigate(`/player/${props.id}`, {
          state: {
            // sending the whole item to the player
            item: props.info,
          },
        });
      }}
    >

      {props.iswatchlist?<div className='delete-icon-container' >
        <DeleteIcon onClick={(e)=>{
          e.stopPropagation();
          props.delwatchlist(props.info);}}></DeleteIcon>

      </div> :""}
     
      
      <img
        src={props.src ? props.src : null}
        alt={props.alt}
        style={{ borderRadius: '18px' }}
      />
    </div>
  );
}
