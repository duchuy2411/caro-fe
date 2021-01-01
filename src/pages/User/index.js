import socketio from "socket.io-client"
import axios from "axios"
import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import SignIn from '../../components/common/Header/SignIn';
import SignUp from '../../components/common/Header/SignUp';
import Profile from '../../components/common/Header/Profile';
import ForgetPassword from '../../components/common/Header/SignIn/ForgetPassword';
import MatchHistory from '../../components/common/Header/MatchHistory';
import RankingTable from '../../components/common/Header/RankingTable';
import TableList from './TableList';
import OnlineUserList from './OnlineUserList';
import UserInfoDialog from './UserInfoDialog';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Helmet from 'react-helmet';
import Header from '../../components/common/Header/index';
//import './index.css';
import useScript from '../../utils/hooks/useScript';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { onlineUserUpdated } from '../../store/slice/onlineUsersSlice';

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
    const dispatch = useDispatch();
    const [socket, setSocket] = useState();
    let [currentUser, setCurrentUser] = useState(null);

    useScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    useScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js');

    useEffect(() => {
        async function fetchData() {
            try {
                //let currentUsername = document.cookie.split('=')[1];
                let currentUsername = Cookies.get(['currentUsername']);
                if (currentUsername) {
                    const api = await axios.get("http://localhost:8000/api/users/" + currentUsername);
                    const data = api.data.data;
                    
                    // Kết nối socket truyền vào iduser : _id và displayname là displayname
                    const io = socketio('http://localhost:8000',
                        { query: `iduser=${data.user._id}&displayname=${data.user.displayname}` });

                    // Gán state socket = io để gọi lại ở useEffect bên dưới
                    setSocket(io);
                    sessionStorage.setItem('currentuser', JSON.stringify(data.user));
                    setCurrentUser(data.user);

                    
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
            socket.on('list-online', async function (listOnline) {
                await dispatch(onlineUserUpdated({listOnlineUser: listOnline}));
                //setOnlineUserList(listOnline);
            });
        }

        return () => {
            if (socket) {
                // nghe xong sự kiện list-online thì xóa
                socket.removeAllListeners('list-online', () => { })
            }
        }
    }, [socket]);


    async function signOut() {

        //document.cookie = 'currentUsername=';
        Cookies.remove('currentUsername');
        const data = await axios.get("http://localhost:8000/api/users/logout/" + currentUser._id);
        sessionStorage.setItem('currentuser', '');
        setCurrentUser(null);

        //setOnlineUserList(data.data.data.userList);
        
        socket.disconnect();
        await dispatch(onlineUserUpdated({listOnlineUser: []}));
        //setOnlineUserList([]);
        // socket.on('disconnected', function (listOnline) {
        //     setOnlineUserList(listOnline);
        // });

        //socket.emit('disconnect', { iduser: currentUser._id, displayname: currentUser.displayname });
        
    }

    

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };
    //checkSignInStatus();

    return (
        <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bitter:400,700"/>
            </head>
            <body style={{backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/000/133/727/original/WoodBackground54342.jpg")', backgroundRepeat: 'repeat'}}>    
                
                <Router>
                    <Switch>
                        <Route exact path={'/'}>
                            <Header currentUser={currentUser} signOut={signOut} />
                            <img src="https://zingplay.static.g6.zing.vn/images/modules/games/480x240/Cocaro.jpg" style={{width: '100%'}}/>
                        </Route>
                        <Route path={'/sign-in'}>
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div hidden={currentUser}>
                                <SignIn />
                            </div>
                        </Route>   
                        <Route path={'/sign-up'}>
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div hidden={currentUser}>
                                <SignUp />
                            </div>
                        </Route>   
                        <Route path={'/play'} >   
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div style={flexContainer}>
                                <TableList socket={socket}/>
                                <OnlineUserList/>
                            </div>
                            <UserInfoDialog socket={socket}/>
                        </Route>
                        <Route path={'/profile'} >
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div hidden={!currentUser}>
                                <Profile />
                            </div>
                        </Route>
                        <Route path={'/forget-password'} >
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div hidden={currentUser}>
                                <ForgetPassword/>
                            </div>
                        </Route>
                        <Route path={'/match-history'} >
                            <Header currentUser={currentUser} signOut={signOut} />
                            <div hidden={!currentUser}>
                                <MatchHistory />
                            </div>
                        </Route>
                        <Route path={'/ranking-table'} >
                            <Header currentUser={currentUser} signOut={signOut} />
                            <RankingTable />
                            <UserInfoDialog socket={socket}/>
                        </Route>
                        
                    </Switch>
                </Router>      
            </body>
        </html>

        // <body>
        //     <Router>
        //         <Switch>
        //             <Route exact path={'/'}>
        //                 {checkSignInStatus()}
        //                 <Link to={'/'}>
        //                     <Button size="large" className={classes.navigationStyle}>HOME</Button>
        //                 </Link>
        //                 <Link to={'/play'}>
        //                     <Button size="large" className={classes.navigationStyle}>PLAY</Button>
        //                 </Link>
        //                 <Link to={'/sign-in'}>
        //                     <Button size="large" className={classes.navigationStyle}>SIGN IN</Button>
        //                 </Link>
        //                 <Link to={'/sign-up'}>
        //                     <Button size="large" className={classes.navigationStyle}>SIGN UP</Button>
        //                 </Link>
        //             </Route>
        //             <Route path={'/sign-in'} >
        //                 <Link to={'/'}>
        //                     <Button size="large" className={classes.navigationStyle}>HOME</Button>
        //                 </Link>
        //                 <Link to={'/play'}>
        //                     <Button size="large" className={classes.navigationStyle}>PLAY</Button>
        //                 </Link>
        //                 <SignIn />
        //             </Route>
        //             <Route path={'/sign-up'} >
        //                 <Link to={'/'}>
        //                     <Button size="large" className={classes.navigationStyle}>HOME</Button>
        //                 </Link>
        //                 <Link to={'/play'}>
        //                     <Button size="large" className={classes.navigationStyle}>PLAY</Button>
        //                 </Link>
        //                 <SignUp />
        //             </Route>

        //             <Route path={'/play'} >
        //                 <Link to={'/'}>
        //                     <Button size="large" className={classes.navigationStyle}>HOME</Button>
        //                 </Link>
        //                 <Link to={'/play'}>
        //                     <Button size="large" className={classes.navigationStyle}>PLAY</Button>
        //                 </Link>
        //                 <Link to={'/profile'} hidden={!currentUser}>
        //                     <Button size="large" className={classes.navigationStyle}>PROFILE</Button>
        //                 </Link>
        //                 <Link to={'/'} hidden={!currentUser}>
        //                     <Button size="large" className={classes.navigationStyle} onClick={() => signOut()} >SIGN OUT</Button>
        //                 </Link>
        //                 <div style={flexContainer}>
        //                     <TableList openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} socket={socket}/>
        //                     <OnlineUserList onlineUserList={onlineUserList} openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
        //                 </div>
        //                 <UserInfoDialog openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
        //             </Route>

        //             <Route path={`/profile`}>
        //                 <Link to={'/play'}>
        //                     <Button size="large" className={classes.navigationStyle}>PLAY</Button>
        //                 </Link>
        //                 <Link to={'/profile'}>
        //                     <Button size="large" className={classes.navigationStyle}>PROFILE</Button>
        //                 </Link>
        //                 <Link to={'/'}>
        //                     <Button size="large" className={classes.navigationStyle} onClick={() => signOut()} >SIGN OUT</Button>
        //                 </Link>
        //                 <Profile />
        //             </Route>

        //         </Switch>
        //     </Router>
        // </body> */}
    );
}

export default User;
