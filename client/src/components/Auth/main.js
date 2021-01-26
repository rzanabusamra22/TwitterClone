import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom";


import TextTitle from '../Text/title'
import { Twitter } from '../icons'
import Button from '../Button/Button'

import Dialog from './SignUpDialog'
import Dialog2 from './SignInDialog'

function Main() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

    return (
        <>
          <div class="container" class="main" >
             <div class="row">
                <div class="col"  >
                    <img src="https://i.imgur.com/Pfnb4uP.png"  style={{objectFit: "cover",width:"779px", height:"100%", marginTop:"5px"}}/>
               </div>

               <div class="col" id="right-side" >
                    <div className="auth-page__logo" style={{ marginRight: "390px"}}>
                        <Button icon><Twitter /></Button>
                    </div>
                    <TextTitle title style={{ fontSize: "30px", marginBottom: "70px" , marginTop: "10px" , marginLeft: "150px"}}><b>See what’s happening in <br></br> the world right now</b></TextTitle>
                    <TextTitle title style={{ fontSize: "16px", marginBottom: "15px" , marginLeft: "150px" }}><b>Join Twitter today.</b></TextTitle>
                    
                    {/* SignUp Dialog */}
                   <Dialog />

                   <Dialog2 />
                   
               </div>
            </div>
         </div>
        </>
    )
}

export default Main
