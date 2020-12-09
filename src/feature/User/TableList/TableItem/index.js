import React, { useEffect, useState, useLocation } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Game from './Game/index.js';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GridList from '@material-ui/core/GridList';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlayingUserInfo from './Game/PlayingUserInfo/index.js';
import Audience from './Game/Audience/index.js';
import Chat from './Game/Chat/index.js';

//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "";
var queryString = require('querystring');

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import InfoIcon from '@material-ui/icons/Info';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';

//import retroAPI from '../../../../TestAPI/routes/index';
//import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    list: {
        width: 400,
        height: 500,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    myStyle: {
        display: 'flex',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        flexDirection: 'row',
    }
}));

export default function TableItem({selectedBoardTitle, openUserInfoDialog, setOpenUserInfoDialog}) {
    const classes = useStyles();

    let boardId;

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };

    useEffect(() => {
        boardId = window.location.pathname.split('/')[2];
        
    }, [selectedBoardTitle]);

    return (
        <div className={classes.root} style={{width: 950, alignItems: 'stretch', background: "#8f5f0e"}} >
            <div>
                <Game/>
            </div>
            <div style={{background: '#0ace5b'}}>
                <div>
                    <PlayingUserInfo openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
                </div>
                <div>
                    <Audience openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} />
                </div>
            </div>
            <div>
                <Chat/>
            </div>
        </div>
    );
}