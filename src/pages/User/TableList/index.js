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
    fetchBoards,
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


export default function TableList({socket}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const boardStatus = useSelector((state) => state.boards.status);
    const boards = useSelector(selectAllBoards);
    let [tableList, setTableList] = useState([]);
    let [selectedTableTitleToView, setSelectedTableTitleToView] = useState("");
    let [openCreateTableDialog, setOpenCreateTableDialog] = useState(false);
    const [dimension, setDimension] = useState(10);
    const [openFindRoom, setOpenFindRoom] = useState(false);
    const [notFound, setNoFound] = useState(false);
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));
    
    const [openLoading, setOpenLoading] = useState(false);
    const [openInvitationBox, setOpenInvitationBox] = useState(false);
    const [invitationBoxMessage, setInvitationBoxMessage] = useState("");
    const [boardCodeInvited, setBoardCodeInvited] = useState(null);
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

    useEffect(() => {
        if (socket) {
            socket.on('join-room-quick-play', function (data) {
                if (currentUser._id === data[0]) {
                    setOpenLoading(false);
                    window.location.href = '/play/' + data[1];
                }
            });
        }

        return () => {
            if (socket) {
                socket.removeAllListeners('join-room-quick-play', () => { })
            }
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('send-invitation', function (data) {
                if (currentUser._id === data[1]) {
                    setBoardCodeInvited(data[2]);
                    setInvitationBoxMessage("Người chơi " + data[0] + " muốn mời bạn vào phòng " + data[2]);
                    setOpenInvitationBox(true);
                }
            });
        }

        return () => {
            if (socket) {
                socket.removeAllListeners('send-invitation', () => { })
            }
        }
    }, [socket]);

    function renderTableItem(tableId, title, description, state) {
        const path = '/play/' + tableId;
        let avatar;
        if (state == -1)
            return;
        if (state == 1)
            avatar = <Avatar variant="square" className={classes.tableImage} src='/img/waiting-table.png' ></Avatar>;
        else
            avatar = <Avatar variant="square" className={classes.tableImage} src='/img/playing-table.png' ></Avatar>;
        return (
            <GridListTile key={tableId}>
                <Card variant="outlined" className={classes.cardStyle}>
                    <CardContent>
                        <Link to={{pathname: path, state: {idBoard: tableId}}}>
                            {avatar}
                        </Link>
                        <Typography variant="h6" component="h6" gutterBottom style={{color: 'white'}}>
                            {title}
                        </Typography>
                        <Typography variant="body2" component="p" style={{color: 'white'}}>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>



            // <ListItem>
            //     <Card variant="outlined">
            //         <CardContent>
            //             <Link to={path}>
            //                 <Avatar variant="square" className={classes.tableImage} src='/img/table.png' ></Avatar>
            //             </Link>
            //             <Typography className={classes.title} variant="h5" component="h2" gutterBottom>
            //                 {title}
            //             </Typography>
            //             <Typography variant="body2" component="p">
            //                 {description}
            //             </Typography>
            //         </CardContent>
            //         {/* <CardActions >
            //         <Link to={path}>
            //             <Button size="small" onClick={() => setSelectedBoardTitleToView(title)}>VIEW</Button>
            //         </Link>
            //         <Button size="small" id={boardId} onClick={(e) => {  updateSelectedBoardToEditOrDelete(e); setOpenEditBoardDialog(true); }}>EDIT</Button>
            //         <Button size="small" onClick={(e) => { updateSelectedBoardToEditOrDelete(e); deleteBoard(); }}>DELETE </Button>
            //         </CardActions> */}
            //     </Card>
            // </ListItem>
        );
    }

    function renderTableList() {
        let result = [];
        tableList.map((tableItem) => result.push(renderTableItem(tableItem.code, tableItem.title, tableItem.description, tableItem.state)));
        return result;
    }

    async function createNewTable(newTitle, newDescription) {
        //let newTitle = document.getElementById('title-add').value;
        //let newDescription = document.getElementById('description-add').value;
        //tableList.push({id: "4", title: newTitle, description: newDescription});
        // fetch(URL + '/api/add-board/username/' + username + '/title/' + title + '/description/' + description)
        //     .then(res => res.json())
        //     .then(res => { if (res) alert('Add new board successfully'); else alert('Add new board unsuccessfully') })
        //     .catch(err => err);
        await axios.post('boards', {
            id_user1: JSON.parse(sessionStorage.currentuser)._id,
            title: newTitle,
            description: newDescription,
            size: 20,
            password: "",
            state: 1
            })
            .then(res => {
                console.log(res);
                history.push({
                    pathname: '/play/' + res.data.data.code,
                    state: {idBoard: res.data.data.code}
                });

                window.location.reload();
                // setTableList([...tableList, {id: res.data.data.code, title: res.data.data.title, description: res.data.data.description}]);
            })
            .catch(err => {
                console.log(err)
            })
    }

    function changeDimension(e) {
        setDimension(e.target.value);
    }

    function findRoom() {
        const idRoom = document.getElementById('id-room').value;
        axios.get('boards/' + idRoom)
            .then(res => {
                setOpenFindRoom(false);
                history.push('/play/' + idRoom);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                setNoFound(true);
            })
    }

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function findUser() {
        const api = await axios.get('boards/quickPlay');
        if (api.data.data) {
            let listIdUser = JSON.stringify(api.data.data).slice(2, JSON.stringify(api.data.data).length - 2).split('","');
            let remainingIdUser;
            if (currentUser._id === listIdUser[0])
                remainingIdUser = listIdUser[1];
            else
                remainingIdUser = listIdUser[0];
            await createNewTable(currentUser.displayname, "Chơi thật vui!");
            await socket.emit("invite-user-clicked-quick-play", [currentUser._id, remainingIdUser]);
            await setOpenLoading(false);
            //alert(listIdUser[0] + "+" + listIdUser[1]);
        }
    }

    async function quickPlay() {
        await axios.post('boards/quickPlay', {iduser: currentUser._id, cup: currentUser.cup})
            .then(async res => {
                await setOpenLoading(true);
            })
            .catch(err => {

            })
        await findUser();
    }

    async function deleteQuickPlay() {
        await axios.post('boards/deleteQuickPlay', {iduser: currentUser._id});
        await setOpenLoading(false);
        await alert("Không tìm thấy người chơi phù hợp");
    }

    function acceptInvitation() {
        window.location.href = '/play/' + boardCodeInvited;
    }

    // function updateSelectedBoardToEditOrDelete(e) {
    //     if (e.currentTarget.textContent === "EDIT")
    //         selectedBoardToEditOrDelete.id = e.currentTarget.id;
    //     else
    //         selectedBoardToEditOrDelete.id = e.currentTarget.previousSibling.id;
    //     for (var i = 0; i < boardList.length; i++) {
    //         if (boardList[i].id == selectedBoardToEditOrDelete.id) {
    //             setSelectedBoardToEditOrDelete({id: boardList[i].id, title: boardList[i].title, description: boardList[i].description});
    //             //selectedBoard.description = boardList[i].description;
    //             break;
    //         }
    //     }

    //     //document.getElementById('title-edit').textContent = selectedBoard.title;
    //     //document.getElementById('description-edit').textContent = selectedBoard.description;
    //     //alert(selectedBoard.title);
    // }

    // function editBoard() {
    //     let title = document.getElementById('title-edit').value;
    //     let description = document.getElementById('description-edit').value;
    //     fetch(URL + '/api/edit-board/username/' + username + '/id/' + selectedBoardToEditOrDelete.id + '/new-title/' + title + '/new-description/' + description)
    //         .then(res => res.json())
    //         .then(res => { if (res) alert('Edit board successfully'); else alert('Edit board unsuccessfully') })
    //         .catch(err => err);
    // }

    // function deleteBoard() {
    //     fetch(URL + '/api/delete-board/username/' + username + '/id/' + selectedBoardToEditOrDelete.id)
    //         .then(res => res.json())
    //         .then(res => { if (res) alert('Delete board successfully'); else alert('Delete board unsuccessfully') })
    //         .catch(err => err);
    // }

    return (
        <div style={{ marginLeft: 60, width: '1000px' }}>
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
                        
                        <Button onClick={() => quickPlay()} style={{backgroundColor: 'blue', color: 'white', marginLeft: '100px'}}>
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
                        <TableItem selectedTableTitleToView={selectedTableTitleToView} socket={socket}/>
                    </Route>

                </Switch>
            </Router>

            <Dialog open={openCreateTableDialog} onClose={() => setOpenCreateTableDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Tạo bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Để tạo bàn mới, hãy nhập thông tin bàn ở đây.
                    </DialogContentText>

                    <TextField autoFocus margin="dense" id="title-add" label="Title" fullWidth />
                    <TextField autoFocus margin="dense" id="description-add" label="Description" fullWidth />
                    <InputLabel id="demo-simple-select-label" style={{marginTop: '20px'}}>Kích thước (n x x)</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="dimension-add"
                        value={dimension}
                        onChange={changeDimension}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenCreateTableDialog(false); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { setOpenCreateTableDialog(false); createNewTable(document.getElementById('title-add').value, document.getElementById('description-add').value); }} color="primary">
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

                    <TextField error={notFound} helperText='Phòng không tồn tại' autoFocus margin="dense" id="id-room" label="ID" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenFindRoom(false); }} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={() => {  findRoom(); }} color="primary">
                        Search
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openLoading} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <img src="https://appa.com.vn/images/default/loading.gif" />
                    <DialogContentText>
                        Đang tìm đối thủ, vui lòng đợi trong giây lát...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { deleteQuickPlay() }} color="danger">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInvitationBox} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        {invitationBoxMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenInvitationBox(false); }} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={() => { acceptInvitation(); setOpenInvitationBox(false); }} color="danger">
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Dialog open={openEditBoardDialog} onClose={() => setOpenEditBoardDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Edit board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To edit board, please enter new title and description here.
                    </DialogContentText>

                    <TextField autoFocus margin="dense" id="title-edit" label="Title" defaultValue={selectedBoardToEditOrDelete.title} fullWidth />
                    <TextField autoFocus margin="dense" id="description-edit" label="Description" defaultValue={selectedBoardToEditOrDelete.description} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenEditBoardDialog(false); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { setOpenEditBoardDialog(false); editBoard(); }} color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog> */}

        </div>
    );
}
