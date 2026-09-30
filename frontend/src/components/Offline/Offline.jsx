import React from 'react';

export default function Offline() {

  return (

    <div style={{"backgroundColor":"rgb(61, 18, 1)","position":"relative","display":"flex","flexWrap":"wrap","justifyContent":"center"}}>
    <div style={{"display":"grid","gridTemplateRows":"1fr","gridTemplateColumns":"600px 600px","alignItems":"center","height":"35rem","justifyItems":"end"}}>
        <div style={{"zIndex":"1","position":"relative"}}>
              <span style={{"fontSize":"100px","color":"#000","fontWeight":"930","whiteSpace":"pre-line","lineHeight":"1","letterSpacing":"9px"}}>
               Offline ! ! !
              </span>
          <p style={{fontSize:'20px'}}>Please Connect to the internet.</p>
     
     </div>
      <div class="img">
           {/* <img src="https://drive.google.com/uc?export=view&id=1GRb9IdgxcaSaTmJ9wGXSWtwhAvDQn5qG" /> */}
     </div>
  </div>
</div> 

  )
}
