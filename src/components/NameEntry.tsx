import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router";

export function NameEntry() {
  const [name, setName] = useState(() => localStorage.getItem("playerName") || "");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("playerName", trimmed);
    navigate(redirect);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Enter Your Name</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          className="px-4 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2 text-lg rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}


