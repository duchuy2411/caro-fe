import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "http://localhost:8000";

export default function SignIn() {

    const signInWithUsernameAndPasswordPath = URL + "/api/users/login";
    const signInWithGooglePath = URL + "/auth/google";
    const signInWithFacebookPath = URL + "/auth/facebook";
    useEffect(() => {
        //fetch(URL + "/sign-in");
    }, []);

    const responseGoogle = (response) => {
        fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + response.tokenId)
        .then(res => res.text())
        .then(res => {
            alert(res);
        })
        .catch(err => err); 
    }

    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px'}}>
            <form action={signInWithUsernameAndPasswordPath} method="post" class="left">
                <h1>SIGN IN</h1>

                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <input type="submit" name="signup_submit" value="SIGN IN" />
                <br/><br/>
                <a style={{color: 'blue'}} href="/forget-password">Quên mật khẩu</a>
            </form>
            

            <div class="right">
                <span class="loginwith" style={{color: 'black'}}>Sign in with<br />social network</span>

                <button class="social-signin facebook">
                    <a href={signInWithFacebookPath}>Sign in with facebook</a>
                </button>
                <button class="social-signin twitter">Sign in with Twitter</button>
                <button class="social-signin google"> 
                    <a href={signInWithGooglePath}>Sign in with Google+</a>
                </button>
            </div>
            <div class="or">OR</div>
        </div>
    );


    // return (
        
    //     <form action={path} method="post">
    //         <div>
    //             <label>Username:</label>
    //             <input type="text" name="username" />
    //         </div>
    //         <div>
    //             <label>Password:</label>
    //             <input type="password" name="password" />
    //         </div>
    //         <div>
    //             <input type="submit" value="Sign In" />
    //         </div>
    //     </form>
    // );
}