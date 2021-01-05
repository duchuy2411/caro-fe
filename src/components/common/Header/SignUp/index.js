import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
import '../../../../utils/axios';
import axios from '../../../../utils/axios';
import { Redirect } from 'react-router-dom';
//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "http://localhost:8000";

export default function SignUp() {
    const path = URL + "/api/users";
    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
    useEffect(() => {

    }, []);

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const specialChars = "<>@!#$%^&*+{}?:;|()[]'\"\\,/~`= ";
    function checkForSpecialChar(string) {
    for(var i = 0; i < specialChars.length; i++) {
        if(string.indexOf(specialChars[i]) > -1) {
            return false
        }
    }
        return true;
    }

    async function signUp() {
        const username = document.getElementsByName("username")[0].value;
        const password = document.getElementsByName("password")[0].value;
        const retypePassword = document.getElementsByName("retypePassword")[0].value;
        const displayname = document.getElementsByName("displayname")[0].value;
        const email = document.getElementsByName("email")[0].value;
        if (password != retypePassword) {
            alert("Nhập lại mật khẩu không đúng");
            return;
        }
        if (username.length < 5 || username.length > 50 || displayname.length < 5 || displayname.length > 50) {
            alert("Username hoặc display name phải từ 5 đến 50 kí tự");
            return;
        }
        if (!checkForSpecialChar(username)) {
            alert("Username không được chứa kí tự đặc biệt và khoảng trắng");
            return;
        }
        if (password.length < 6) {
            alert("Password phải từ 6 kí tự trở lên");
            return;
        }
        if (!validateEmail(email)) {
            alert("Email không đúng định dạng");
            return;
        }
        const api = await axios.post("api/users", {displayname, username, password, email});
        alert(api.data.message);
        if (api.data.data) {
            setIsSignUpSuccess(true);
            
        }
    }
    if (isSignUpSuccess)
        return (<Redirect to="/sign-in"/>);

    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px'}}>
            <form onSubmit={(e) => {e.preventDefault(); signUp(); }} class="left">
                <h1>SIGN UP</h1>

                <input type="text" name="username" placeholder="Username" required/>
                <input type="password" name="password" placeholder="Password" required/>
                <input type="password" name="retypePassword" placeholder="Retype password" required/>
                <input type="text" name="displayname" placeholder="Display name" required/>
                <input type="text" name="email" placeholder="E-mail" required/>

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
}