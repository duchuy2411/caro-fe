import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import UserInfoDialog from '../UserInfoDialog/index.js';
import io from "socket.io-client";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    title: {
        color: '#87CEFA',
        display: 'flex',
        justifyContent: 'center'
    },
}));

//const socket = io('http://localhost:8000');

export default function OnlineUserList({onlineUserList, openUserInfoDialog, setOpenUserInfoDialog, openOnlineUserList, setOpenOnlineUserList}) {
    const classes = useStyles();

    useEffect(() => {
    }, []);

    function renderOnlineUserItem(iduser, displayname) {
        return (
            <ListItem key={iduser} button>
                <Button onClick={() => setOpenUserInfoDialog(true)}>
                    <Avatar variant="circle" src='/img/user-icon.jpg' style={{width: 30, height: 30, marginRight: 10}}></Avatar>
                    <ListItemText style={{color: 'greenyellow'}} primary={displayname} />
                </Button>
            </ListItem>
        )
    }

    function renderOnlineUserList() {
        let result = [];
        onlineUserList.map((onlineUserItem) => result.push(renderOnlineUserItem(onlineUserItem.iduser, onlineUserItem.displayname)));
        return result;
    }
    let minimizeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',  };
    let maximizeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',  };
    return (
        <div style={{marginLeft: -110, height: 500}}>
            <div hidden={!openOnlineUserList} style={{ backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")', width: 200 }}>
                <img src='https://aux.iconspalace.com/uploads/2024895475923021781.png' style={minimizeImg} onClick={() => { setOpenOnlineUserList(false) }} />
                <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                    Kỳ thủ
                </Typography>
                <List>
                    {renderOnlineUserList()}
                </List>
            </div>
            <div hidden={openOnlineUserList} style={{ backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")', width: 200 }}>
                <img src='https://cdn3.iconfinder.com/data/icons/cosmo-color-player-2/40/window_fullscreen_1-512.png' style={maximizeImg} onClick={() => { setOpenOnlineUserList(true) }} />
                <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                    Kỳ thủ
                </Typography>
            </div>
        </div>
    )
}