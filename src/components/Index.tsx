import { useState } from "react";
import { useNavigate } from "react-router";

export function Index() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");

  function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${roomId}`);
  }

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim();
    if (code) {
      navigate(`/room/${code}`);
    }
  }

  console.log('asdf');

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <h1 className="text-4xl font-bold text-indigo-600">Planning Poker</h1>

      <button
        onClick={createRoom}
        className="px-4 py-2 text-white bg-indigo-600 rounded-lg text-lg font-bold cursor-pointer border-none [box-shadow:0px_4px_12px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-colors"
      >
        Create New Room
      </button>

      <div className="flex flex-col items-center gap-3">
        <span className="text-gray-500 font-medium">— or join an existing room —</span>
        <form onSubmit={joinRoom} className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter room code"
            className="px-4 py-2 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-gray-600 rounded-lg text-base font-bold cursor-pointer border-none hover:bg-gray-700 transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}