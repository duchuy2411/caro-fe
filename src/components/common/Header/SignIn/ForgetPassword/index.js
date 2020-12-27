import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "http://localhost:8000";

export default function ForgetPassword() {

    const signInWithUsernameAndPasswordPath = URL + "/api/users/login";
    const signInWithGooglePath = URL + "/auth/google";
    const signInWithFacebookPath = URL + "/auth/facebook";
    useEffect(() => {
        //fetch(URL + "/sign-in");
    }, []);


    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px'}}>
            <form method="post" class="left">
                <h1>LẤY LẠI MẬT KHẨU</h1>
                <input type="text" name="username" placeholder="Nhập username" />
                <input type="submit" name="signup_submit" value="THỰC HIỆN" onClick={() => alert('Link reset mật khẩu đã được gửi qua email của bạn, vui lòng click vào để xác nhận!')}/>
            </form>
            
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