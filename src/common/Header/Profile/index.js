import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useLocation } from 'react';
//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "";

const useStyles = makeStyles((theme) => ({
    infoLineStyle: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end'
    },
    labelStyle: {
        marginTop: 7,
        marginRight: 20,
        textAlign: 'left'
    }
}));
export default function Profile() {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));
    let [username, setUsername] = useState(currentUser.username);
    let [displayName, setDisplayName] = useState(currentUser.displayname);
    let [sex, setSex] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [email, setEmail] = useState(currentUser.email);
    let [password, setPassword] = useState(currentUser.password);

    //let [userList, setUserList] = useState([]);
    // let [username, setUsername] = useState(sessionStorage.getItem('currentusername'));
    // let [displayName, setDisplayName] = useState("");
    // let [sex, setSex] = useState("");
    // let [phoneNumber, setPhoneNumber] = useState("");
    // let [email, setEmail] = useState("");
    // let password;
    let inputMale, inputFemale;
    // function getUserList(username) {
    //     setUserList([{displayName: "player 1", _password: "123", sex: "Nữ", phonenumber: "0123456789", email: "dth@gmail.com"}]);
    //     // fetch(URL + "/api/user/username/" + username)
    //     //     .then(res => res.json())
    //     //     .then(res => setUserList(res))
    //     //     .catch(err => err);
    // }
    // function onTodoChange(value) {
    //     setDisplayName(value);
    // }

    const path = URL + "/update-profile";
    useEffect(() => {
        //getUserList(username);
    }, [username, displayName, sex, phoneNumber, email]);
    // userList.map((userItem) => {
    //     password = userItem._password;
    //     displayName = userItem.displayName;
    //     sex = userItem.sex;
    //     phoneNumber = userItem.phonenumber;
    //     email = userItem.email;
        if (sex == 'Nam') {
            inputMale = <input type="radio" name="sex" value="Nam" defaultChecked="true"/>;
            inputFemale = <input type="radio" name="sex" value="Nữ"/>;
        }
        else if (sex == 'Nữ') {
            inputMale = <input type="radio" name="sex" value="Nam"/>;
            inputFemale = <input type="radio" name="sex" value="Nữ" defaultChecked="true"/>;
        }
        else {
            inputMale = <input type="radio" name="sex" value="Nam"/>;
            inputFemale = <input type="radio" name="sex" value="Nữ"/>;
        }
    //});
    return (
        <div id="login-box" style={{background: 'lavender', height: 650}}>
            <form action={path} method="post" class="left" style={{margin: 120}}>
                <h1 style={{textAlign: 'center'}}>PROFILE</h1>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Username</label>
                    <input  type="text" name="username" value={username}/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>DisplayName</label>
                    <input type="text" name="displayName" defaultValue={displayName} />
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Sex</label>
                    <div style={{marginTop: 5, marginBottom: 15}}>
                        <label class="radio">
                            {inputMale}
                                Nam
                        </label>
                        <label class="radio" style={{marginLeft: 80}}>
                            {inputFemale}
                                Nữ
                        </label>
                    </div>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Phone</label>
                    <input type="text" name="phoneNumber" defaultValue={phoneNumber} />
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Email</label>
                    <input type="text" name="email" defaultValue={email} />
                </div>
                <input type="password" name="password" placeholder="Type new password if you need"/>
                <input type="password" name="retypePassword" placeholder="Retype new password" />

                <input type="submit" name="signup_submit" value="UPDATE PROFILE" />
            </form>
        </div>
    );
}