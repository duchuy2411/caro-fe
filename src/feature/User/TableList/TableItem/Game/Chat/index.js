import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({

}));

//const socket = io('http://localhost:8000');

export default function Chat({socket}) {
    const classes = useStyles();
    
    const [inp, setInp] = useState("");
    const [newMess, setNewMess] = useState();
    const [arrayMessage, setArrayMessage] = useState([]);

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));

    let [itemChatList, setItemChatList] = useState([<li></li>]);
    let url = window.location.href;
    let idRoom = url.slice(url.lastIndexOf('/') + 1);

    function getItemChatList() {
        axios.get('http://localhost:8000/messages/' + idRoom)
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
    // useEffect(() => {
    // }, []);

    
  useEffect(() => {
    getItemChatList();
    
  }, [itemChatList.length])

  // Lắng nge khi trong room có người chat
  useEffect(() => {
    if (socket) {
        // nghe tin nhắn từ room
        socket.on('update-area-chat', function(data) {
          // console.log("room message:", data);
          // setNewMess(data);
          // let newArr = [...arrayMessage];
          // newArr.push(data);
          // // cập nhật giao diện
          // setArrayMessage(newArr);
  
          //getItemChatList();
          let newItemChatList = itemChatList.slice();
          let newItemChatContent = data.fromDisplayName + ": " + data.content;
          newItemChatList.push(renderItemChat(newItemChatContent));
          setItemChatList(newItemChatList);
          
        })
      }
      return () => {
        if(socket){
          // nghe xong xóa
          socket.removeAllListeners('update-area-chat', function(){ })
        }
      }
      // chỉ kích hoạt lại khi socket thay đổi
  }, [socket])

    function renderItemChat(itemChatContent) {
        return (<li>{itemChatContent}</li>)
    }

    function submitChat(e) {
        e.preventDefault();
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
        if (socket) {
            socket.emit('send-message', {fromUsername: currentUser.username, fromDisplayName: currentUser.displayname, fromBoardId: idRoom, content: content});
        }
        //getItemChatList();
        let newItemChatList = itemChatList.slice();
        let newItemChatContent = currentUser.displayname + ": " + content;
        newItemChatList.push(renderItemChat(newItemChatContent));
        setItemChatList(newItemChatList);

    }
    // socket.on('update-area-chat', function (data) {
    //     getItemChatList();
    //     let newItemChatContent = data.fromDisplayName + ": " + data.content;
    //     let currentItemChatList = itemChatList.slice();
    //     currentItemChatList.push(renderItemChat(newItemChatContent));
    //     setItemChatList(currentItemChatList);
    // });

    return (
        <div style={{width: 250, background: 'white'}}>
            <div style={{height: 50, color: 'red'}}>
                <h1>Chat</h1>
            </div>
            <div  style={{borderWidth: 'thin', borderStyle: 'solid', borderColor: 'black', height: 400, overflowX: 'hidden'}}>
                <ul id="chatAreaContent" style={{textAlign: 'left', listStyleType: 'none', display: 'inline'}}>
                    {itemChatList}
                </ul>
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <textarea id="content" name="content" placeholder="Nhập tin nhắn..." style={{width: 200, marginTop: 5}}>{inp}</textarea>
                <input type="submit" value="Gửi" style={{width: 35, marginLeft: 5, marginTop: 10}} onClick={(e) => submitChat(e)}></input>
            </div>
        </div>
    )
}