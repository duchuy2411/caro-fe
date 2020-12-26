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

//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "";

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
    let [tableList, setTableList] = useState([]);
    let [selectedTableTitleToView, setSelectedTableTitleToView] = useState("");
    let [openCreateTableDialog, setOpenCreateTableDialog] = useState(false);
    const [dimension, setDimension] = useState(10);
    const [openFindRoom, setOpenFindRoom] = useState(false);
    const [notFound, setNoFound] = useState(false);

    // let [selectedBoardToEditOrDelete, setSelectedBoardToEditOrDelete] = useState({
    //     id: 0,
    //     title: "",
    //     description: ""
    // });

    useEffect(() => {
        axios.get('boards')
            .then(res => {
                setTableList(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    // function getTableList() {
    //     setTableList([{ id: "1", title: "Tên bàn 1", description: "Đang chơi" },
    //     { id: "2", title: "Tên bàn 2", description: "Đang chờ" },
    //     { id: "3", title: "Tên bàn 3", description: "Đang chơi" },
    //     { id: "4", title: "Tên bàn 4", description: "Đang chơi" },
    //     { id: "5", title: "Tên bàn 5", description: "Đang chờ" },
    //     { id: "6", title: "Tên bàn 6", description: "Đang chơi" }]);
    //     // fetch(URL + "/api/board/username/" + username)
    //     //     .then(res => res.json())
    //     //     .then(res => setTableList(res))
    //     //     .catch(err => err);
    // }

    function renderTableItem(tableId, title, description) {
        const path = '/play/' + tableId;
        return (
            <GridListTile key={tableId}>
                <Card variant="outlined" className={classes.cardStyle}>
                    <CardContent>
                        <Link to={{pathname: path, state: {idBoard: tableId}}}>
                            <Avatar variant="square" className={classes.tableImage} src='/img/waiting-table.png' ></Avatar>
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
        tableList.map((tableItem) => result.push(renderTableItem(tableItem.code, tableItem.title, tableItem.description)));
        return result;
    }

    function createNewTable() {
        let newTitle = document.getElementById('title-add').value;
        let newDescription = document.getElementById('description-add').value;
        //tableList.push({id: "4", title: newTitle, description: newDescription});
        // fetch(URL + '/api/add-board/username/' + username + '/title/' + title + '/description/' + description)
        //     .then(res => res.json())
        //     .then(res => { if (res) alert('Add new board successfully'); else alert('Add new board unsuccessfully') })
        //     .catch(err => err);
        axios.post('boards', {
            user: JSON.parse(sessionStorage.currentuser)._id,
            title: newTitle,
            description: newDescription,
            width: dimension,
            height: dimension,
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
