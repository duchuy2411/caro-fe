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
                <Avatar variant="square" src='/img/user-icon.jpg' style={{ width: 90, height: 90, marginRight: 30 }}></Avatar>
                <div>
                    <Typography className={classes.title} variant="p" component="p" style={{ fontWeight: 'bold' }} gutterBottom>
                        Display name
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'black' }} variant="p" component="p" gutterBottom>
                        Join Date: 01/01/2021
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'blue' }} variant="p" component="p" gutterBottom>
                        Statistic: Đã chơi 10, thắng 5, hòa 4, thua 1, tỷ lệ thắng 80%
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'red' }} variant="p" component="p" gutterBottom>
                        Level: Kỳ thánh
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