import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"
import axios from "axios"
import {useState, useEffect} from "react"

const socket = io('http://localhost:8000');

function App() {

  const [data, useData] = useState("Vì một câu nói");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get("http://localhost:8000/api/user");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    socket.emit("hello-server", "vì một câu nói");

  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
