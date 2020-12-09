import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

//let [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
const useStyles = makeStyles((theme) => ({

}));

export default function UserInfo({ openUserInfoDialog, setOpenUserInfoDialog }) {
    const classes = useStyles();
    let closeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px' };
    return (
        <Dialog open={openUserInfoDialog}
            onClose={() => setOpenUserInfoDialog(false)} aria-labelledby="form-dialog-title"
        >
            <DialogTitle>Thông tin người chơi
            <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={() => { setOpenUserInfoDialog(false); }} />
            </DialogTitle>
            <DialogContent style={{display: 'flex', alignItems: 'flex-end'}}>
                <Avatar variant="square" src='/img/user-icon.jpg' style={{ width: 70, height: 70, marginRight: 30 }}></Avatar>
                <div>
                    <Typography className={classes.title} variant="p" component="p" style={{ fontWeight: 'bold' }} gutterBottom>
                        Display name
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'blue' }} variant="p" component="p" gutterBottom>
                        Elo: 1600
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'orange' }} variant="p" component="p" gutterBottom>
                        Coins: 0
                    </Typography>
                </div>
                {/* <DialogContentText>

                </DialogContentText> */}

            </DialogContent>
            <DialogActions>
            <Button onClick={() => { setOpenUserInfoDialog(false); }} color="primary">
                    Kết bạn
                </Button>
                <Button onClick={() => { setOpenUserInfoDialog(false); }} color="primary">
                    Nhắn tin
                </Button>
                <Button onClick={() => { setOpenUserInfoDialog(false); }} color="primary">
                    Ván đấu
                </Button>
                <Button onClick={() => { setOpenUserInfoDialog(false); }} color="primary">
                    Mời chơi
                </Button>
            </DialogActions>
        </Dialog>
    );
}