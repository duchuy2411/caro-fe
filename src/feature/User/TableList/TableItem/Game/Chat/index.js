import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../../../../axios';
import io from "socket.io-client"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({

}));

const socket = io('http://localhost:8000');

export default function Chat() {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));

    let [itemChatList, setItemChatList] = useState([<li></li>]);
    let url = window.location.href;
    let idRoom = url.slice(url.lastIndexOf('/') + 1);

    function getItemChatList() {
        axios.get('messages/' + idRoom)
        .then(res => {
            let messageList = res.data.data;
            let currentItemChatList = [];
            messageList.map((messageItem) => {
                let itemChatContent = messageItem.fromDisplayName + ": " + messageItem.content;
                currentItemChatList.push(renderItemChat(itemChatContent));
            })
            setItemChatList(currentItemChatList);
        })
        .catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        getItemChatList();
        
    }, []);

    function renderItemChat(itemChatContent) {
        return (<li>{itemChatContent}</li>)
    }

    function submitChat() {
        let content = document.getElementById("content").value;
        if (!content) {
            alert('Vui lòng nhập nội dung chat');
            return;
        }
        if (!currentUser) {
            alert('Vui lòng đăng nhập để chat');
            return;
        }
        document.getElementById("content").value = "";
        socket.emit('send-message', {fromUsername: currentUser.username, fromDisplayName: currentUser.displayname, fromBoardId: idRoom, content: content});
        
    }
    socket.on('update-area-chat', function (data) {
        getItemChatList();
        let newItemChatContent = data.fromDisplayName + ": " + data.content;
        let currentItemChatList = itemChatList.slice();
        currentItemChatList.push(renderItemChat(newItemChatContent));
        setItemChatList(currentItemChatList);
    });

    return (
        <div style={{width: 250, background: 'white'}}>
            <div style={{height: 50, color: 'red'}}>
                <h1>Chat</h1>
            </div>
            <div  style={{borderWidth: 'thin', borderStyle: 'solid', borderColor: 'black', height: 400}}>
                <ul id="chatAreaContent" style={{textAlign: 'left', listStyleType: 'none', display: 'inline'}}>
                    {itemChatList}
                </ul>
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <textarea id="content" name="content" placeholder="Nhập tin nhắn..." style={{width: 200, marginTop: 5}}></textarea>
                <input type="submit" value="Gửi" style={{width: 35, marginLeft: 5, marginTop: 10}} onClick={() =>  submitChat()}></input>
            </div>
        </div>
    )
}