import {Room} from "./components/Room.tsx";
import {NameEntry} from "./components/NameEntry.tsx";
import {Route, Routes} from "react-router";
import {Index} from "./components/Index.tsx";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" Component={Index}/>
      <Route path="/name" Component={NameEntry}/>
      <Route path="/room/:room" Component={Room}/>
    </Routes>
  )
}

export default App;
