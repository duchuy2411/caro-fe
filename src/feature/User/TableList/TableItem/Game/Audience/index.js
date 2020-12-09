import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({

}));

export default function Audience({openUserInfoDialog, setOpenUserInfoDialog}) {
    const classes = useStyles();
    let [audienceList, setAudienceList] = useState([]);

    function getAudienceList() {
        setAudienceList([{ iduser: "1", displayname: "Player 1" },
        { iduser: "2", displayname: "Player 2" }]);
        // fetch(URL + "/api/board/username/" + username)
        //     .then(res => res.json())
        //     .then(res => setTableList(res))
        //     .catch(err => err);
    }

    useEffect(() => {
        getAudienceList();
    }, []);

    function renderAudienceItem(iduser, displayname) {
        return (
            <ListItem key={iduser} button>
                <Button onClick={() => setOpenUserInfoDialog(true)}>
                    <Avatar variant="circle" src='/img/user-icon.jpg' style={{width: 30, height: 30, marginRight: 10}}></Avatar>
                    <ListItemText primary={displayname} />
                </Button>
            </ListItem>
        )
    }

    function renderAudienceList() {
        let result = [];
        audienceList.map((audienceItem) => result.push(renderAudienceItem(audienceItem.iduser, audienceItem.displayname)));
        return result;
    }

    return (
        <div style={{ width: 180 }}>
            <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                Khán giả
            </Typography>
            <List>
                {renderAudienceList()}
            </List>
        </div>
    )
}