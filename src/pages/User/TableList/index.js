import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import TableItem from './TableItem/index';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Avatar from '@material-ui/core/Avatar';

import axios from '../../../utils/axios';
import socketio from 'socket.io-client';
import history from "../../../utils/history";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import {useDispatch, useSelector} from 'react-redux';
import {
    selectAllBoards,
    selectBoardById,
    selectBoardIds,
    fetchBoards,
    addNewBoard,
    selectBoardByRoom,
} from '../../../store/slice/boardsSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1280,
        backgroundColor: theme.palette.background.paper
    },
    tableImage: {
        width: '100px',
        height: '100px',
        marginLeft: 22
        
    },
    gridList: {
        alignContent: 'center',
        marginTop: 0
    },
    cardStyle: {
        width: 180, 
        height: 200, 
        textAlign: 'center',
        margin: 5,
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")'
    }
}));

export default function TableList({ openUserInfoDialog, setOpenUserInfoDialog, socket}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const boardStatus = useSelector((state) => state.boards.status);
    const boards = useSelector(selectAllBoards);
    let [tableList, setTableList] = useState([]);
    let [selectedTableTitleToView, setSelectedTableTitleToView] = useState("");
    let [openCreateTableDialog, setOpenCreateTableDialog] = useState(false);
    const [time, setTime] = useState(15);
    const [openFindRoom, setOpenFindRoom] = useState(false);
    const [notFound, setNoFound] = useState(false);
    const [idRoom, setIdRoom] = useState(null);
    const [password, setPassword] = useState(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const board = useSelector((state) => selectBoardByRoom(state, idRoom));

    useEffect(() => {
        if (boardStatus === 'idle') {
            dispatch(fetchBoards());
        }
    }, [boardStatus, dispatch]);

    useEffect(() => {
        if (boardStatus === 'succeeded') {
            setTableList(boards);
        }
    }, [boardStatus])

    function renderTableItem(tableId, title, description) {
        const path = '/play/' + tableId;
        return (
            <GridListTile key={tableId}>
                <Card variant="outlined" className={classes.cardStyle}>
                    <CardContent>
                        {/*<Link to={{pathname: path, state: {idBoard: tableId}}}>
                            <Avatar variant="square" className={classes.tableImage} src='/img/waiting-table.png' ></Avatar>
                        </Link>*/}
                        <Avatar onClick={() => checkPassword(tableId)} variant="square" className={classes.tableImage} src='/img/waiting-table.png' />
                        <Typography variant="h6" component="h6" gutterBottom style={{color: 'white'}}>
                            {title}
                        </Typography>
                        <Typography variant="body2" component="p" style={{color: 'white'}}>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>
        );
    }

    function renderTableList() {
        let result = [];
        tableList.map((tableItem) => result.push(renderTableItem(tableItem.code, tableItem.title, tableItem.description)));
        return result;
    }

    async function createNewTable() {
        let newTitle = document.getElementById('title-add').value;
        let newDescription = document.getElementById('description-add').value;
        const newPassword = document.getElementById('password-add').value;

        await dispatch(
            addNewBoard(
                {
                    title: newTitle,
                    description: newDescription,
                    password: newPassword, time,
                    id_user1: JSON.parse(sessionStorage.currentuser)._id
                }));
        //tableList.push({id: "4", title: newTitle, description: newDescription});
        // fetch(URL + '/api/add-board/username/' + username + '/title/' + title + '/description/' + description)
        //     .then(res => res.json())
        //     .then(res => { if (res) alert('Add new board successfully'); else alert('Add new board unsuccessfully') })
        //     .catch(err => err);
        // axios.post('boards', {
        //     user: JSON.parse(sessionStorage.currentuser)._id,
        //     title: newTitle,
        //     description: newDescription,
        //     width: dimension,
        //     height: dimension,
        //     })
        //     .then(res => {
        //         console.log(res);
        //         history.push({
        //             pathname: '/play/' + res.data.data.code,
        //             state: {idBoard: res.data.data.code}
        //         });
        //         window.location.reload();
        //         // setTableList([...tableList, {id: res.data.data.code, title: res.data.data.title, description: res.data.data.description}]);
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }

    function changeTime(e) {
        setTime(e.target.value);
    }

    function findRoom() {
        if (!board[0]) {
            setNoFound(true);
            return;
        }
        if (board[0].password && idRoom) {
            // setOpenFindRoom(false);
            setNoFound(false);
            setOpenPasswordDialog(true);
        } else {
            redirectToRoom(board.code);
        }
    }

    function checkPassword(idBoard) {
        setNoFound(false);
        const newBoard = boards.filter(board => board.code == idBoard);
        if (newBoard[0].password) {
            setOpenPasswordDialog(true);
            setIdRoom(idBoard);
        } else {
            redirectToRoom(idBoard);
        }
    }

    function joinRoom() {
        let passwordBoard;
        if (openFindRoom) {
            passwordBoard = board[0].password;
        } else {
            passwordBoard = boards.filter(board => board.code == idRoom)[0].password;
        }
        if (passwordBoard !== password) {
            setNoFound(true);
            return;
        }
       redirectToRoom(board[0].code);
    }

    function redirectToRoom(idBoard) {
        history.push({
            pathname: '/play/' + idBoard,
            state: {idBoard}
        });
        window.location.reload();
        // socket.emit('join-room', [idBoard, JSON.parse(sessionStorage.currentuser)._id]);
    }

    return (
        <div style={{ marginLeft: 60, width: 'fit-content' }}>
            <Router>
                <Switch>
                    <Route exact path={`/play`}>
                        <Typography variant="h5" component="h2" gutterBottom color="primary">
                            Danh sách bàn chơi
                        </Typography>

                        <Button onClick={() => {setOpenFindRoom(true); setNoFound(false);}}>
                            <SearchIcon style={{width: 50, height: 50, color: 'red'}}/>
                            <Typography>
                                Tìm phòng
                            </Typography>
                        </Button>
                        
                        <Button style={{backgroundColor: 'blue', color: 'white', marginLeft: '100px'}}>
                            Chơi nhanh
                        </Button>

                        <GridList cellHeight={180} className={classes.gridList} cols={3}>
                            <GridListTile key="Subheader" >
                                <Card variant="outlined" className={classes.cardStyle}>
                                    
                                    <CardActions style={{ justifyContent: 'center' }} >
                                        <Button size="small" onClick={() => setOpenCreateTableDialog(true)}>
                                            <AddCircleIcon style={{width: 90, height: 90, color: 'violet'}} />
                                        </Button>
                                    </CardActions>

                                    <CardContent>
                                        <Typography variant="h5" component="p" color="error">
                                            Tạo bàn
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </GridListTile>

                            {renderTableList()}

                        </GridList>

                    </Route>
                    <Route path={`/play/:tableId`} >
                        <TableItem selectedTableTitleToView={selectedTableTitleToView} openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog} socket={socket}/>
                    </Route>

                </Switch>
            </Router>

            <Dialog open={openCreateTableDialog} onClose={() => setOpenCreateTableDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Tạo bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Để tạo bàn mới, hãy nhập thông tin bàn ở đây.
                    </DialogContentText>

                    <TextField autoFocus margin="dense" id="title-add" label="Tên" fullWidth />
                    <TextField margin="dense" id="description-add" label="Miêu tả" fullWidth />
                    <TextField margin="dense" id="password-add" label="Mật khẩu (optional)" fullWidth/>
                    <InputLabel id="demo-simple-select-label" style={{marginTop: '20px'}}>Thời gian cho một nước</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="time-play-add"
                        value={time}
                        onChange={changeTime}
                    >
                        <MenuItem value={15}>15s</MenuItem>
                        <MenuItem value={30}>30s</MenuItem>
                        <MenuItem value={45}>45s</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenCreateTableDialog(false); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { setOpenCreateTableDialog(false); createNewTable(); }} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFindRoom} onClose={() => setOpenFindRoom(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Tìm bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nhập id để tìm bàn
                    </DialogContentText>

                    <TextField onChange={e => setIdRoom(e.target.value)} error={notFound} helperText='Phòng không tồn tại' autoFocus margin="dense" id="id-room" label="ID" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenFindRoom(false); }} color="danger">
                        Huỷ
                    </Button>
                    <Button onClick={() => {  findRoom(); }} color="primary">
                        Tìm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPasswordDialog} onClose={() => {setOpenPasswordDialog(false); setNoFound(false);}} aria-labelledby="form-dialog-title">
                <DialogTitle>Nhập mật khẩu</DialogTitle>
                <DialogContent>
                   {/* <DialogContentText>
                        To edit board, please enter new title and description here.
                    </DialogContentText>*/}

                    <TextField onChange={e => setPassword(e.target.value)} autoFocus margin="dense" error={notFound} helperText='Sai mật khẩu' id="password-join" label="Title" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setNoFound(false); setOpenPasswordDialog(false); }} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={() => {joinRoom();}} color="primary">
                        Vào
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
