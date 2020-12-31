import React, { useEffect, useState, useLocation } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Game from '../../Game/index.js';

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
import PlayingUserInfo from '../../../../components/PlayingUserInfo/index.js';
import Audience from '../../../../components/Audience/index.js';
import Chat from '../../../../components/Chat/index.js';
import axios from "../../../../utils/axios";
import {Grid} from "@material-ui/core";
import socketio from 'socket.io-client';

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
    title: {
        color: 'indianred',
        display: 'flex',
        justifyContent: 'center'
    },
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

export default function TableItem({selectedBoardTitle, socket}) {
    const classes = useStyles();
    const [board, setBoard] = useState();
    const [openHistory, setOpenHistory] = useState(false);
    const [newSquare, setNewSquare] = useState(Array(100).fill(null));
    const [winLine, setWinLine] = useState(null);
    const [history, setHistory] = useState();
    const [displayJoinButton, setDisplayJoinButton] = useState(false);
    const [replay, setReplay] = useState(true);

    let boardId;

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };

    useEffect(() => {
        setReplay(true);
        // const io = socketio('http://localhost:8000',
        //     { query: `iduser=${JSON.parse(sessionStorage.currentuser)._id}&displayname=${JSON.parse(sessionStorage.currentuser).displayname}`} );
        // setSocket(io);
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on("receive", function (squares) {
                setNewSquare(squares);
                if (squares.every(el => !el)) {
                    setReplay(true);
                }
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('receive', function () {
                })
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.on("win-game", function (line) {
                setWinLine(line);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('win-game', function () {
                })
            }
        }
    }, [socket])

    useEffect(() => {
        boardId = window.location.pathname.split('/')[2];
        axios.get('boards/'+boardId)
            .then(res => {
                setBoard(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
        // if (socket) {
        //     console.log('emit');
        //     socket.emit('join-room', [1,2]);
        // }
    }, [selectedBoardTitle]);
    

    function handlePlayGame(squares) {
        socket.emit('play-caro', squares);
    }

    function handleWinGame(line) {
        socket.emit('win-game', line);
        axios.post('boards/addhistory/'+board.code, {
            winner: {
                    _id: JSON.parse(sessionStorage.currentuser)._id,
                    displayname: JSON.parse(sessionStorage.currentuser).displayname}
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    function renderHistoryList() {
        axios.get('boards/gethistory/'+board.code)
            .then(res => {
                console.log(res);
                setHistory(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    function handleReplay() {
        setReplay(false);
    }

    

    return (
        <React.Fragment>
            <div style={{flexGrow: 1}}>
                <Typography className={classes.title} variant='h5' component='h6'>
                    Tên phòng: {board? board.title: 'XO'}
                </Typography >
                <Typography className={classes.title} variant='h6' component='h6'>
                    Miêu tả: {board? board.description: 'etc'}
                </Typography>
                <Grid container spacing={3} style={{justifyContent: 'center', marginBottom: '10px'}}>
                    <Grid item xs={3}>
                        <Button disabled={board? !board.id_user2 : false} variant="contained" color="secondary">
                            Bắt đầu
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            socket.emit('join-room', [board._id, JSON.parse(sessionStorage.currentuser)._id]);
                            setDisplayJoinButton(true);
                        }}  variant="contained" color="primary"
                        disabled={displayJoinButton}>
                            Vào phòng
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            setReplay(true);
                            handlePlayGame(Array(board.size_width*board.size_width).fill(null));
                            setNewSquare(Array(board.size_width*board.size_width).fill(null));
                            setWinLine(null);
                            console.log('aa');
                        }}  variant="contained" color="primary"
                        disabled={replay}>
                            Chơi lại
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            setOpenHistory(true);
                            renderHistoryList();
                        }}  variant="contained" color="primary">
                            Xem lịch sử
                        </Button>
                    </Grid>
                </Grid>
                <Typography>O đi trước</Typography>
            </div>
            <div className={classes.root} style={{width: 'max-content', alignItems: 'stretch', background: "#8f5f0e"}} >
                <div>
                    <Game dimension={board? board.size_width : 0}
                          handlePlayGame={(squares) =>handlePlayGame(squares)}
                          handleWinGame={(line) => handleWinGame(line)}
                          handleReplay={() => handleReplay()}
                            newSquares={newSquare}
                            newWinLine={winLine}/>
                </div>
                <div style={{background: '#0ace5b'}}>
                    <div>
                        <PlayingUserInfo />
                    </div>
                    <div>
                        <Audience />
                    </div>
                </div>
                <div>
                    <Chat socket={socket}/>
                </div>
            </div>

            <Dialog open={openHistory} onClose={() => setOpenHistory(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Lịch sử chơi game</DialogTitle>
                <DialogContent>
                    <List>
                        {
                            history? history.map(el => (
                                <ListItem>
                                    {/*<ListItemText*/}
                                    {/*    primary={`${el.date} - ${el.winner.displayname} win`}*/}
                                    {/*/>*/}
                                    <Typography style={{color: 'blue'}}>{`${el.date} | "${el.winner.displayname}" THẮNG`}</Typography>
                                </ListItem>
                            )) : null
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenHistory(false); }} color="danger">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}