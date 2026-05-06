import { Room } from "./components/Room.tsx";
import {Route, Routes} from "react-router";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/room/:room" Component={Room}/>
    </Routes>
  )
}


export default App;
