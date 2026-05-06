import { Room } from "./components/Room.tsx";
import { NameEntry } from "./components/NameEntry.tsx";
import { Navigate, Route, Routes } from "react-router";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/name" Component={NameEntry}/>
      <Route path="/room/:room" Component={Room}/>
      <Route path="*" element={<Navigate to="/name" replace />}/>
    </Routes>
  )
}

export default App;
