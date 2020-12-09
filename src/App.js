import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"
import axios from "axios"
import {useState, useEffect} from "react"
import { makeStyles } from '@material-ui/core/styles';
import User from './feature/User';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navigationStyle: {
    backgroundColor: 'aqua',
  }
}));

// const socket = io('https://caro-be.herokuapp.com');
const socket = io('http://localhost:8000');

function App() {
  const classes = useStyles();

  useEffect(() => {
    // async function fetchData() {
    //   try {
    //     const data = await axios.get("http://localhost:8000/api/user");
    //     console.log(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchData();
    // socket.emit("hello-server", "vì một câu nói");
    

  }, []);

  return (
    <div className="App">
      <User/>
    </div>
  );
}

export default App;
