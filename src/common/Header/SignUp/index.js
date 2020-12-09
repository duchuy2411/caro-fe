import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "";

export default function SignUp() {

    const path = URL + "/sign-up";
    useEffect(() => {
        //fetch(URL + "/sign-up");
    }, []);
    return (
        <div id="login-box" style={{background: 'lavender'}}>
            <form action={path} method="post" class="left">
                <h1>SIGN UP</h1>

                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" name="retypePassword" placeholder="Retype password" />
                <input type="text" name="displayName" placeholder="Display name" />

                <div style={{marginTop: 10, marginBottom: 10}}>
                    <label class="radio">
                        <input type="radio" name="sex" value="Nam"/>
                            Nam
                    </label>
                    <label class="radio" style={{marginLeft: 100}}>
                        <input type="radio" name="sex" value="Nữ" checked />
                            Nữ
                    </label>
                </div>

                <input type="text" name="phoneNumber" placeholder="Phone number" />
                <input type="text" name="email" placeholder="E-mail" />

                <input type="submit" name="signup_submit" value="SIGN UP" />
            </form>

            <div class="right">
                <span class="loginwith" style={{color: 'black'}}>Sign in with<br />social network</span>

                <button class="social-signin facebook">Sign in with facebook</button>
                <button class="social-signin twitter">Sign in with Twitter</button>
                <button class="social-signin google">Sign in with Google+</button>
            </div>
            <div class="or">OR</div>
        </div>
    );
    // return (

    //     <form action={path} method="post">
    //         <div>
    //             <label>Username:</label>
    //             <input type="text" name="username" required />
    //         </div>
    //         <div>
    //             <label>Password:</label>
    //             <input type="password" name="password" required />
    //         </div>
    //         <div>
    //             <label>Retype password:</label>
    //             <input type="password" name="retypePassword" required />
    //         </div>
    //         <div>
    //             <label>Full Name:</label>
    //             <input type="text" name="fullName" />
    //         </div>
    //         <div>
    //             <label>Sex:</label>
    //             <input type="text" name="sex" />
    //         </div>
    //         <div>
    //             <label>Phone number:</label>
    //             <input type="text" name="phoneNumber" />
    //         </div>
    //         <div>
    //             <label>Email:</label>
    //             <input type="text" name="email" />
    //         </div>
    //         <div>
    //             <input type="submit" value="Sign Up" />
    //         </div>
    //     </form>
    // );
}