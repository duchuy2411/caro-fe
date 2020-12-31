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
    let [joinDate, setJoinDate] = useState(currentUser.join_date);
    let [totalMatch, setTotalMatch] = useState(currentUser.total_match);
    let [winMatch, setWinMatch] = useState(currentUser.win_match);
    let [winPercent, setWinPercent] = useState(currentUser.win_percent);
    let [cup, setCup] = useState(currentUser.cup);
    let [email, setEmail] = useState(currentUser.email);
    let [password, setPassword] = useState(currentUser.password);
    let [statistic, setStatistic] = useState("Đã chơi " + totalMatch + ", thắng " + winMatch + ", tỉ lệ " + winPercent + "%");
    
    let inputMale, inputFemale;
    const inputSize = 250;
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
        setStatistic("Đã chơi " + totalMatch + ", thắng " + winMatch + ", tỉ lệ " + winPercent + "%");
    }, [username, displayName, joinDate, totalMatch, winMatch, winPercent, cup, email]);
    
    
    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px', height: '600px'}}>
            <form action={path} method="post" class="left" style={{marginLeft: '50px'}}>
                <h1 style={{alignmentBaseline: 'central'}}>PROFILE</h1>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Username</label>
                    <input type="text" name="username" value={username} size={inputSize} style={{marginRight: '10px'}}/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>DisplayName</label>
                    <input type="text" name="displayName" defaultValue={displayName} size={inputSize}/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>JoinDate</label>
                    <input type="text" name="joinDate" defaultValue={joinDate} size={inputSize} disabled="true"/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Statistic</label>
                    <input type="text" name="matchStatistic" defaultValue={statistic} size={inputSize} disabled="true"/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Cup</label>
                    <input type="text" name="matchStatistic" defaultValue={cup} size={inputSize} disabled="true"/>
                </div>
                <div className={classes.infoLineStyle}>
                    <label className={classes.labelStyle}>Email</label>
                    <input type="text" name="email" defaultValue={email} size={inputSize}/>
                </div>
                <input type="password" name="password" placeholder="Type new password if you need" size={inputSize}/>
                <input type="password" name="retypePassword" placeholder="Retype new password" size={inputSize}/>

                <input type="submit" name="signup_submit" value="UPDATE PROFILE" style={{width: '150px'}}/>
            </form>
        </div>
    );
}