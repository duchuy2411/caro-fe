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


import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Avatar from '@material-ui/core/Avatar';

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
        backgroundColor: theme.palette.background.paper,
    },
    tableImage: {
        width: '100px',
        height: '100px'
    },
    gridList: {
        width: 900,
        height: 450,
        alignContent: 'center',
        marginLeft: 100
    }
}));

export default function TableList({ openUserInfoDialog, setOpenUserInfoDialog }) {
    const classes = useStyles();
    let [tableList, setTableList] = useState([]);
    let [selectedTableTitleToView, setSelectedTableTitleToView] = useState("");
    let [openCreateTableDialog, setOpenCreateTableDialog] = useState(false);
    

    // let [selectedBoardToEditOrDelete, setSelectedBoardToEditOrDelete] = useState({
    //     id: 0,
    //     title: "",
    //     description: ""
    // });

    function getTableList() {
        setTableList([{ id: "1", title: "Tên bàn 1", description: "Đang chơi" },
        { id: "2", title: "Tên bàn 2", description: "Đang chờ" },
        { id: "3", title: "Tên bàn 3", description: "Đang chơi" },
        { id: "4", title: "Tên bàn 4", description: "Đang chơi" },
        { id: "5", title: "Tên bàn 5", description: "Đang chờ" },
        { id: "6", title: "Tên bàn 6", description: "Đang chơi" }]);
        // fetch(URL + "/api/board/username/" + username)
        //     .then(res => res.json())
        //     .then(res => setTableList(res))
        //     .catch(err => err);
    }

    useEffect(() => {
        getTableList();
    }, []);

    function renderTableItem(tableId, title, description) {
        const path = '/play/' + tableId;
        return (
            <GridListTile key={tableId}>
                <Card variant="outlined" style={{ width: 150, height: 150, justifyContent: 'center' }}>
                    <CardContent>
                        <Link to={path}>
                            <Avatar variant="square" className={classes.tableImage} src='/img/table.png' ></Avatar>
                        </Link>
                        <Typography className={classes.title} variant="h5" component="h2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" component="p">
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
        tableList.map((tableItem) => result.push(renderTableItem(tableItem.id, tableItem.title, tableItem.description)));
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
        <div style={{ margin: 5, width: 950 }}>
            <Router>
                <Switch>
                    <Route exact path={`/play`}>
                        <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                            Danh sách bàn chơi
                        </Typography>

                        <GridList cellHeight={180} className={classes.gridList} cols={5}>
                            <GridListTile key="Subheader" >
                                <Card variant="outlined" style={{ width: 150, height: 150, justifyContent: 'center' }}>
                                    
                                    <CardActions style={{ justifyContent: 'center' }} >
                                        <Button size="small" onClick={() => setOpenCreateTableDialog(true)}>
                                            <AddCircleIcon style={{width: 70, height: 70, color: 'violet'}} />
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
                        <TableItem selectedTableTitleToView={selectedTableTitleToView} openUserInfoDialog={openUserInfoDialog} setOpenUserInfoDialog={setOpenUserInfoDialog}/>
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
