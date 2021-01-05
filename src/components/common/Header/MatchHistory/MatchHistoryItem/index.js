import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { selectMatchHistoryItem } from '../../../../../store/slice/matchHistoryItemSlice';
import { useSelector } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import HistoryGame from './HistoryGame';
import HistoryChat from './HistoryChat';
import { fetchUserInfoDialog } from '../../../../../store/slice/userInfoDialogSlice';

import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    navigationStyle: {
        backgroundColor: 'aqua',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    playingUserInfoStyle: {
        width: 150, 
        height: 150, 
        justifyContent: 'center', 
        borderWidth: 3
    },
    title: {
        color: 'blue',
        display: 'flex',
        justifyContent: 'center'
    }
}));

export default function MatchHistoryItem(){
    const classes = useStyles();
    const dispatch = useDispatch();
    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };
    const matchHistoryItem = useSelector(selectMatchHistoryItem);
    const [userInfoView, setUserInfoView] = useState([]);
    const [moveListView, setMoveListView] = useState([]);
    const [squares, setSquares] = useState(matchHistoryItem.step[0].squares);
    const [message, setMessage] = useState("Game start");

    let oldMoveListButton;

    useEffect(() => {
        renderUserInfoViews();
        renderMoveList();
    }, [matchHistoryItem.step.length]);


    function renderUserInfoViews() {
        let result = [];
        result.push(renderUserInfoView(matchHistoryItem.id_user1, matchHistoryItem.displayname_user1));
        result.push(renderUserInfoView(matchHistoryItem.id_user2, matchHistoryItem.displayname_user2));
        setUserInfoView(result);
    }

    function renderMoveList() {
        const moves = matchHistoryItem.step.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            const bg = move ?
                'blue' : 'red';
            return (
              <li key={move} >
                <button id={move} style={{background: bg, color: 'white'}} onClick={(e) => selectMove(move, e)}>{desc}</button>
              </li>
            );
        });
        setMoveListView(moves);
    }

    function renderUserInfoView(iduser, displayname) {
        return (
            <ListItem key={iduser}>
                <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                    <CardContent>
                        <div>
                            <Button onClick={() => displayUserInfoDialog(iduser)}>
                                <Avatar variant="square"  src='/img/user-icon.jpg' style={{width: 50, height: 50}}></Avatar>
                            </Button>
                        </div>
                        <Typography className={classes.title} variant="p" component="p" style={{fontWeight: 'bold'}} gutterBottom>
                            {displayname}
                        </Typography>
                        {/* <Typography className={classes.title} style={{color: 'blue'}} variant="p" component="p" gutterBottom>
                            Elo: 1600
                        </Typography> */}
                    </CardContent>
                </Card>
            </ListItem>
        )
    }

    function selectMove(move, e) {
        jumpTo(move); 
        if (move) {
            document.getElementById("0").style.background = 'blue';
        }
        if (oldMoveListButton) {
            oldMoveListButton.style.background = 'blue';
        }
        oldMoveListButton = e.currentTarget;
        e.currentTarget.style.background = 'red';
    }

    function jumpTo(move) {
        setSquares(matchHistoryItem.step[move].squares);
        setMessage(matchHistoryItem.step[move].message);
    }

    async function displayUserInfoDialog(iduser) {
        await dispatch(fetchUserInfoDialog({iduser}));
    }

    return (
        <div  style={{width: 'max-content', margin: 'auto', marginTop: '30px'}} >
            <div>
                <Typography className={classes.title} variant='h5' component='h6'>
                    Tường thuật trận đấu giữa {matchHistoryItem.displayname_user1} và {matchHistoryItem.displayname_user2}
                </Typography >
                <Typography className={classes.title} variant='h5' component='h6'>
                    Diễn ra vào {matchHistoryItem.createdAt}
                </Typography >
                <Typography className={classes.title} variant='h5' component='h6'>
                    Người thắng: {matchHistoryItem.win}
                </Typography >
                <Typography className={classes.title} variant='h5' component='h6'>
                    Số nước đi: {matchHistoryItem.step.length}
                </Typography >
            </div>
            <div className={classes.root}>
                <div>
                    <HistoryGame className={classes.root} squares={squares}/>
                </div>
                <div style={{background: '#0ace5b'}}>
                    <div>
                        <List style={{ width: 200 }}>
                            {userInfoView}
                        </List>
                    </div>
                    <Typography variant="p" component="p" style={{fontWeight: 'bold', color: 'red', width: '150px', height:'80px', margin: 'auto'}} gutterBottom>
                        {message}
                    </Typography>
                    <Typography className={classes.title} variant="p" component="p" style={{fontWeight: 'bold'}} gutterBottom>
                        Move List
                    </Typography>
                    <div style={{overflowX: 'hidden', height: '120px'}}>
                        <ul style={{listStyleType: 'none'}}>
                            {moveListView}
                        </ul>
                    </div>
                </div>
                <div>
                    <HistoryChat id_match={matchHistoryItem.id_match} />
                </div>
            </div>
                
                {/* <div>
                    <Chat socket={socket}/>
                </div> */}
            </div>
    )
}