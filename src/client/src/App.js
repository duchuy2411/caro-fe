import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import socketIOClient from 'socket.io-client';
 


function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    // fetch("http://localhost:9000/")
    //   .then(res => res.text())
    //   .then(res => setResponse(res))
    //   .catch(err => err);
    //const socket = socketIOClient.io().connect("http://localhost:4000/");
    
    //const socket = socketIOClient.io().connect("http://localhost:9000");
    
    // let socket = socketIOClient('localhost:7000');
    // socket.on('connect', function (){
    //   console.log('connected: ');
  //});

    //socket.connect('http://localhost', {port: 7000});
    //setResponse("" + socket.connected);
    
    // socket.on("FromAPI", data => {
    //   setResponse(data);
    // });

    //socket.disconnect();
  }, []);

  return (
    <p>
      Hello world
    </p>
  );
}

export default App;
