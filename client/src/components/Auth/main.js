import React, { useContext, useState } from 'react'
import { toast } from "react-toastify";

import ThemeButton from '../ThemeButton/ThemeButton'
import TextBody from '../Text/body'
import TextTitle from '../Text/title'
import { Twitter } from '../icons'
import Button from '../Button/Button'

import { UserContext } from "../../context/UserContext";
import { client } from '../../utils'

function Main() {

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
                    
                    {/* <ThemeButton full size="large" primary type="button" onClick={setAuth}></ThemeButton> */}
                    <ThemeButton full size="large" primary type="button" style={{ marginBottom: "15px" , marginLeft: "150px", width:"60%" }}>
                    Sign up
                   </ThemeButton>

                   <ThemeButton full size="large" type="submit" style={{ marginBottom: "15px" , marginLeft: "150px", width:"60%" }}>
                    Log in
                   </ThemeButton>
               </div>
            </div>
         </div>
        </>
    )
}

export default Main
