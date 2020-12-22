import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    playingUserInfoStyle: {
        width: 150, 
        height: 150, 
        justifyContent: 'center', 
        borderWidth: 3
    }

}));

export default function PlayingUserInfo({openUserInfoDialog, setOpenUserInfoDialog}) {
    const classes = useStyles();

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };
    let [playingUsers, setPlayingUsers] = useState([]);

    function getPlayingUsers() {
        //get api
        let iduser = ["1", "2"], displayname = ["Người chơi 1", "Người chơi 2"];
        setPlayingUsers([{ iduser: iduser[0], displayname: displayname[0], score: "0" },
        { iduser: iduser[1], displayname: displayname[1], score: "0" }]);
    }

    useEffect(() => {
        getPlayingUsers();
    }, []);

    function renderPlayingUser(playingUser) {
        return (
            <ListItem key={playingUser.iduser}>
                <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                    <CardContent>
                        <div style={flexContainer}>
                            <Button onClick={() => setOpenUserInfoDialog(true)}>
                                <Avatar variant="square"  src='/img/user-icon.jpg' style={{width: 50, height: 50}}></Avatar>
                            </Button>
                            <div style={{marginLeft: 30}}>
                                <Typography className={classes.title} variant="h6" component="h6" style={{color: 'red', margin: 0}} gutterBottom>
                                    {playingUser.score}
                                </Typography>
                                <Typography className={classes.title} variant="p" component="p" gutterBottom>
                                    01:00
                                </Typography>
                            </div>
                        </div>
                        <Typography className={classes.title} variant="p" component="p" style={{fontWeight: 'bold'}} gutterBottom>
                            {playingUser.displayname}
                        </Typography>
                        <Typography className={classes.title} style={{color: 'blue'}} variant="p" component="p" gutterBottom>
                            Elo: 1600
                        </Typography>
                        <Typography className={classes.title} style={{color: 'orange'}} variant="p" component="p" gutterBottom>
                            Coins: 0
                        </Typography>
                    </CardContent>
                </Card>
            </ListItem>
        )
    }

    function renderPlayingUsers() {
        let result = [];
        
        playingUsers.map((playingUser) => result.push(renderPlayingUser(playingUser)));
        return result;
    }

    return (
        <List style={{ width: 200 }}>
            {renderPlayingUsers()}
        </List>
    )
}