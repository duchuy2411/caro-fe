import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({

}));

export default function Chat() {
    const classes = useStyles();
    useEffect(() => {
    }, []);

    return (
        <div style={{width: 250, background: 'white'}}>
            <div style={{height: 50, color: 'red'}}>
                <h1>Chat</h1>
            </div>
            <div style={{borderWidth: 'thin', borderStyle: 'solid', borderColor: 'black', height: 400}}>
                <pre style={{textAlign: 'left'}}>
                    Player 1: Hello world<br/>
                    Player 2: Hi
                </pre>
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <textarea id="inputString" name="w3review" placeholder="Nhập tin nhắn..." style={{width: 200, marginTop: 5}}></textarea>
                <input type="submit" value="Gửi" style={{width: 35, marginLeft: 5, marginTop: 10}}></input>
            </div>
        </div>
    )
}