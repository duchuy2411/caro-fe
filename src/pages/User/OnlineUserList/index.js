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

}));

//const socket = io('http://localhost:8000');

export default function OnlineUserList({onlineUserList, openUserInfoDialog, setOpenUserInfoDialog}) {
    const classes = useStyles();

    useEffect(() => {
    }, []);

    function renderOnlineUserItem(iduser, displayname) {
        return (
            <ListItem key={iduser} button>
                <Button onClick={() => setOpenUserInfoDialog(true)}>
                    <Avatar variant="circle" src='/img/user-icon.jpg' style={{width: 30, height: 30, marginRight: 10}}></Avatar>
                    <ListItemText primary={displayname} />
                </Button>
            </ListItem>
        )
    }

    function renderOnlineUserList() {
        let result = [];
        onlineUserList.map((onlineUserItem) => result.push(renderOnlineUserItem(onlineUserItem.iduser, onlineUserItem.displayname)));
        return result;
    }

    return (
        <div style={{ background: 'pink', width: 250, marginLeft: 20, marginRight: 10 }}>
            <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                Danh sách người chơi
            </Typography>
            <List>
                {renderOnlineUserList()}
            </List>
        </div>
    )
}