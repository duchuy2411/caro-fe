import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"
import axios from "axios"
import {useState, useEffect} from "react"

// const socket = io('https://caro-be.herokuapp.com');
const socket = io('http://localhost:8000');

function App() {

  const [data, useData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get("https://caro-be.herokuapp.com/api/user");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    socket.on('list-user', (data) => {
      console.log(data);
    })

  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
