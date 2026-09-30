import React from 'react';
// import './ErrorElement.css';
import { useNavigate } from 'react-router-dom';
export default function ErrorElement() {
    const navigate=useNavigate();
    function fun(){
        navigate('/');
    }
  return (

    <div style={{"backgroundColor":"rgb(61, 18, 1)","position":"relative","display":"flex","flexWrap":"wrap","justifyContent":"center"}}>
    <div style={{"display":"grid","gridTemplateRows":"1fr","gridTemplateColumns":"600px 600px","alignItems":"center","height":"35rem","justifyItems":"end"}}>
        <div style={{"zIndex":"1","position":"relative"}}>
              <span style={{"fontSize":"100px","color":"#3a4c82","fontWeight":"930","whiteSpace":"pre-line","lineHeight":"1","letterSpacing":"9px","textShadow":"1px 7px 1px #fff"}}>
               error
              </span>
          <p style={{fontSize:'20px'}}>Something went Wrong<br/>
         Please Return to homepage.</p>
        <button onClick={fun}>Home</button>
     </div>
      <div class="img">
           {/* <img src="https://drive.google.com/uc?export=view&id=1GRb9IdgxcaSaTmJ9wGXSWtwhAvDQn5qG" /> */}
     </div>
  </div>
</div> 

  )
}
