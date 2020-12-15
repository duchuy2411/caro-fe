import io from "socket.io-client"
import axios from "axios"
import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import SignIn from '../../common/Header/SignIn';
import SignUp from '../../common/Header/SignUp';
import Profile from '../../common/Header/Profile';
import TableList from './TableList';
import OnlineUserList from './OnlineUserList';
import UserInfoDialog from './UserInfoDialog';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    navigationStyle: {
        backgroundColor: 'aqua',
    }
}));

const socket = io('http://localhost:8000');

function User() {
    const classes = useStyles();

    let [currentUser, setCurrentUser] = useState(null);
    let [onlineUserList, setOnlineUserList] = useState([]);

    let [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
              const data = await axios.get("http://localhost:8000/api/users/login");
              
              if (data.data.data.user) {
                  sessionStorage.setItem('currentuser', JSON.stringify(data.data.data.user));
                  setCurrentUser(data.data.data.user);
                  //socket.emit('login', { iduser: currentUser._id, displayname: currentUser.displayname });
                  
                  
              }
              //alert(data.data.data.user);
              //alert(sessionStorage.getItem('currentuser'));
              //alert(data.data.message);
              
              
            } catch (error) {
              console.log(error);
            }
        }
        fetchData();
        // socket.emit("hello-server", "vì một câu nói");

        // setOnlineUserList([{ iduser: "1", displayname: "Player 1" },
        // { iduser: "2", displayname: "Player 2" },
        // { iduser: "3", displayname: "Player 3" },
        // { iduser: "4", displayname: "Player 4" },
        // { iduser: "5", displayname: "Player 5" },
        // { iduser: "6", displayname: "Player 6" }]);

        
        socket.on('list-online', function (listOnline) {
            setOnlineUserList(listOnline);
        });

        //getCurrentUsername();

    }, [])

    //function getCurrentUsername() {
      //  sessionStorage.setItem('currentusername', '');
        // fetch(URL + "/api/currentuser/info")
        //   .then(res => res.text())
        //   .then(res => {  
        //     sessionStorage.setItem('currentusername', res.replace(/^"|"$/g, ''));
        //     setCurrentUsername(sessionStorage.getItem('currentusername'));
        //   })
        //   .catch(err => err);
    //}

    

    async function signOut() {
        sessionStorage.setItem('currentuser', '');
        setCurrentUser(null);
        
        //const data = await axios.get("http://localhost:8000/api/users/logout");
        //setOnlineUserList(data.data.data.userList);

        socket.emit('disconnect', null);
        socket.on('list-online', function (listOnline) {
            setOnlineUserList(listOnline);
        });


        //socket.emit('disconnect', { iduser: currentUser._id, displayname: currentUser.displayname });
        //fetch(URL + "/api/sign-out");
    }

    function checkSignInStatus() {
        if (currentUser) {
            return (
                <Redirect to="/play" />
            );
        }
    }

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };
    //checkSignInStatus();

    return (
        <body style={{ margin: 0 }}>
            <Router>
                <Switch>
                    <Route exact path={'/'}>
                        {checkSignInStatus()}
                        <Link to={'/'}>
                            <Button size="large" className={classes.navigationStyle}>HOME</Button>
                        </Link>
                        <Link to={'/play'}>
                            <Button size="large" className={classes.navigationStyle}>PLAY</Button>
                        </Link>
                        <Link to={'/sign-in'}>
                            <Button size="large" className={classes.navigationStyle}>SIGN IN</Button>
                        </Link>
                        <Link to={'/sign-up'}>
                            <Button size="large" className={classes.navigationStyle}>SIGN UP</Button>
                        </Link>
                    </Route>
                    <Route path={'/sign-in'} >
                        <Link to={'/'}>
                            <Button size="large" className={classes.navigationStyle}>HOME</Button>
                        </Link>
                        <Link to={'/play'}>
                            <Button size="large" className={classes.navigationStyle}>PLAY</Button>
                        </Link>
                        <SignIn />
                    </Route>
                    <Route path={'/sign-up'} >
                        <Link to={'/'}>
                            <Button size="large" className={classes.navigationStyle}>HOME</Button>
                        </Link>
                        <Link to={'/play'}>
                            <Button size="large" className={classes.navigationStyle}>PLAY</Button>
                        </Link>
                        <SignUp />
                    </Route>

                    <Route path={'/play'} >
                        <Link to={'/'}>
                            <Button size="large" className={classes.navigationStyle}>HOME</Button>
                        </Link>
                        <Link to={'/play'}>
                            <Button size="large" className={classes.navigationStyle}>PLAY</Button>
                        </Link>
                        <Link to={'/profile'} hidden={!currentUser}>
                            <Button size="large" className={classes.navigationStyle}>PROFILE</Button>
                        </Link>
                        <Link to={'/'} hidden={!currentUser}>
                            <Button size="large" className={classes.navigationStyle} onClick={() => signOut()} >SIGN OUT</Button>
                        </Link>
                        <div style={flexContainer}>
                            <TableList openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
                            <OnlineUserList onlineUserList={onlineUserList} openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
                        </div>
                        <UserInfoDialog openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
                    </Route>

                    <Route path={`/profile`}>
                        <Link to={'/play'}>
                            <Button size="large" className={classes.navigationStyle}>PLAY</Button>
                        </Link>
                        <Link to={'/profile'}>
                            <Button size="large" className={classes.navigationStyle}>PROFILE</Button>
                        </Link>
                        <Link to={'/'}>
                            <Button size="large" className={classes.navigationStyle} onClick={() => signOut()} >SIGN OUT</Button>
                        </Link>
                        <Profile />
                    </Route>

                </Switch>
            </Router>
        </body>
    );
}

export default User;
