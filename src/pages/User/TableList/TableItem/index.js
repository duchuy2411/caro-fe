import React, { useEffect, useState, useLocation } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectAllBoards,
    selectBoardById,
    selectBoardIds,
    fetchBoards,
    addNewBoard,
    selectBoardByRoom,
} from '../../../../store/slice/boardsSlice';

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

export default function TableItem({socket}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const boardStatus = useSelector((state) => state.boards.status);
    const board = useSelector((state) => selectBoardByRoom(state,window.location.pathname.split('/')[2]))[0];
    const [match, setMatch] = useState();
    const [hostPlayer, setHostPlayer] = useState();
    const [guestPlayer, setGuestPlayer] = useState();
    const [updateBoard, setUpdateBoard] = useState(board);
    const [openHistory, setOpenHistory] = useState(false);
    const [newSquare, setNewSquare] = useState(Array(400).fill(null));
    const [winLine, setWinLine] = useState(null);
    const [history, setHistory] = useState();
    const [message, setMessage] = useState("");
    const [readyStart, setReadyStart] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [isJoin, setIsJoin] = useState(false);
    const [duration, setDuration] = useState(-1);
    const [second, setSecond] = useState(-1);
    const [isTypePlay, setIsTypePlay] = useState(false);
    const [messageWin, setMessageWin] = useState();

    useEffect(() => {
        if (boardStatus === 'idle') {
            dispatch(fetchBoards());
        }
    }, [boardStatus, dispatch]);

    useEffect(() => {
        console.log(board);
        if (board && !isJoin && socket) {
            setIsHost(board.id_user1 == JSON.parse(sessionStorage.currentuser)._id);
            console.log('join');
            setTimeout(() => {
                socket.emit('join-room', [window.location.pathname.split('/')[2], JSON.parse(sessionStorage.currentuser)._id]);
            }, 1500);
            setIsJoin(true);
            setDuration(parseInt(board.time));
        }
    }, [board, socket]);

    useEffect(() => {
        if (socket) {
            socket.on('ready-start', function (board) {
                console.log('start');
                setReadyStart(true);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('ready-start', function () {
                })
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.on('new-match', function ([newMatch, updateBoard, user1, user2]) {
                setMatch(newMatch);
                setHostPlayer(user1);
                setGuestPlayer(user2);
                if (!isStart) setIsStart(true);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('new-match', function () {
                })
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.on("receive", function ([squares, msg]) {
                setMessage(msg);
                setNewSquare(squares);
                setSecond(duration);
                setIsTypePlay(false);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('receive', function () {
                })
            }
        }
    }, [socket, duration])

    useEffect(() => {
        if (socket) {
            socket.on("win-game", function ([line, msg]) {
                console.log('win game');
                setMessageWin(msg);
                setIsWin(true);
                if (line) {
                    setWinLine(line);
                }
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
       console.log('call countdown', isWin, second);
       let timer;
       if (isWin) {
           clearTimeout(timer);
       } else {
           if (second > 0 && !isTypePlay) {
               timer = setTimeout(() => {
                   setSecond(second -1);
               }, 1000);
           } else {
               if (!isTypePlay && second === 0) {
                   handleWinGame(null);
               }
               setSecond(-1);
           }
       }
       return () => {
           if (second === -1 && isTypePlay) {
               clearTimeout(timer);
           }
       }
   }, [second, isWin]);

    function handlePlayGame(squares) {
        const currentPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? hostPlayer.displayname :guestPlayer.displayname;
        const nextPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? guestPlayer.displayname : hostPlayer.displayname;
        const msg = currentPlayer +  ' đã đi -> Đến lượt ' + nextPlayer;
        socket.emit('play-caro', [match._id, squares, msg]);
        setSecond(-1);
        setIsTypePlay(true);
        setMessage(msg);
    }
    function handleWinGame(line) {
        let msg;
        const currentPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? hostPlayer.displayname :guestPlayer.displayname;
        const nextPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? guestPlayer.displayname : hostPlayer.displayname;
        if (line) {
            msg = currentPlayer + ' chiến thắng ' + nextPlayer;
        } else {
            msg = nextPlayer + ' chiến thắng ' + currentPlayer;
        }
        socket.emit('win-game', [match._id, JSON.parse(sessionStorage.currentuser)._id, line, msg]);
    }


    function renderHistoryList() {
        // axios.get('boards/gethistory/'+board.code)
        //     .then(res => {
        //         console.log(res);
        //         setHistory(res.data.data);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    function handleReplay() {

    }

    function startGame() {
        socket.emit('start-game');
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
                    {isHost ? (<Grid item xs={3}>
                        <Button onClick={() => {startGame(); setReadyStart(false)}} disabled={!readyStart} variant="contained" color="secondary">
                            Bắt đầu
                        </Button>
                    </Grid>) : null}
                    {/*<Grid item xs={3}>
                        <Button onClick={() => {
                            setReplay(true);
                            handlePlayGame(Array(board.size*board.size).fill(null));
                            setNewSquare(Array(board.size*board.size).fill(null));
                            setWinLine(null);
                        }}  variant="contained" color="primary"
                        disabled={replay}>
                            Chơi lại
                        </Button>
                    </Grid>*/}
                    <Grid item xs={3}>
                        <Button onClick={() => {
                            setOpenHistory(true);
                            renderHistoryList();
                        }}  variant="contained" color="primary">
                            Xem lịch sử
                        </Button>
                    </Grid>
                </Grid>
                {isWin ? (<Typography>{messageWin}</Typography>) :
                    (<React.Fragment>
                        <Typography>{message}</Typography>
                        {second === -1 ? (<Typography/>) : (<Typography>Thời gian: {second}s</Typography>)}
                    </React.Fragment>)}

            </div>
            <div className={classes.root} style={{width: 'max-content', alignItems: 'stretch', background: "#8f5f0e"}} >
                <div>
                    {isStart ? (<Game dimension={board? board.size : 0}
                                      handlePlayGame={(squares) =>handlePlayGame(squares)}
                                      handleWinGame={(line) => handleWinGame(line)}
                                      handleReplay={() => handleReplay()}
                                      newSquares={newSquare}
                                      newWinLine={winLine}
                                      isWin={isWin}
                    />): null}
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