import socketio from "socket.io-client"
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


function User() {
    const classes = useStyles();

    const [socket, setSocket] = useState();
    let [currentUser, setCurrentUser] = useState(null);
    let [onlineUserList, setOnlineUserList] = useState([]);

    let [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const api = await axios.get("http://localhost:8000/api/users");
                const data = api.data.data;
                sessionStorage.setItem('currentuser', JSON.stringify(data.user));
                setCurrentUser(data.user);
                if (data.user) {
                    // Kết nối socket truyền vào iduser : _id và displayname là displayname
                    const io = socketio('http://localhost:8000',
                    { query: `iduser=${data.user._id}&displayname=${data.user.displayname}`} );

                    // Gán state socket = io để gọi lại ở useEffect bên dưới
                    setSocket(io);
                }
              
            } catch (error) {
              console.log(error);
            }
        }
        fetchData();
    }, [])

    // luôn lắng nghe khi có người khác đăng nhập
    // trả về 1 mảng đang online trong database
    useEffect(() => {

        if (socket) {
            socket.on('list-online', function (listOnline) {
                setOnlineUserList(listOnline);
            });
        }

        return () => {
            if (socket) {
                // nghe xong sự kiện list-online thì xóa
                socket.removeAllListeners('list-online', () => { })
            }
        }
    }, [socket]);



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
        
        const data = await axios.get("http://localhost:8000/api/users/logout");
        //setOnlineUserList(data.data.data.userList);

        //socket.emit('disconnect', null);
        socket.disconnect();
        setOnlineUserList([]);
        // socket.on('disconnected', function (listOnline) {
        //     setOnlineUserList(listOnline);
        // });


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
                            <TableList openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} socket={socket}/>
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
