import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useNavigate, useSearchParams} from "react-router";

export function Index() {
  const [query] = useSearchParams();
  console.log(query.get('join'));
  const [activeForm, setActiveForm] = useState<'create' | 'join' | undefined>(query.get('join') ? 'join' : undefined);
  const [joinRoomCode, setJoinRoomCode] = useState(query.get('join') ?? '');
  const [username, setUsername] = useState(localStorage.getItem('name') ?? '');

  const [generatedCode, setGeneratedCode] = useState("");

  const generateRoomCode = () => {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setGeneratedCode(code);
    return code;
  };

  const navigate = useNavigate();

  function toggleForm(to: 'create' | 'join') {
    if (activeForm === to) {
      setActiveForm(undefined);
    } else {
      setActiveForm(to);
    }
  }

  const handleCreateRoom = () => {
    if (!username.trim()) return;
    const code = generatedCode || generateRoomCode();

    localStorage.setItem('name', username.trim());

    navigate(`room/${code}`);
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !joinRoomCode.trim()) return;

    localStorage.setItem('name', username.trim());

    navigate(`room/${joinRoomCode.trim()}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{rotate: [0, 10, -10, 0]}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {/*<Users className="w-20 h-20 mx-auto text-pink-500" />*/}
          </motion.div>
          <h1>Scrum Poker</h1>
          <p className="text-gray-600">
            Start a new room or join an existing session!
          </p>
        </div>

        <div className="space-y-4">
          <motion.div
            layout
            className="w-full rounded-2xl bg-white text-gray-900 shadow-2xl border-4 border-purple-200 overflow-hidden"
          >
            <div className="bg-linear-to-r from-pink-500 to-purple-500 text-white border-pink-200 hover:shadow-pink-200 transition-all">
              <motion.button
                whileHover={{scale: 1.02, y: -2}}
                whileTap={{scale: 0.98}}
                onClick={() => {
                  toggleForm('create');
                  generateRoomCode();
                }}
                className="w-full p-6 "
              >
                {/*<Plus className="w-8 h-8 mx-auto mb-2" />*/}
                <h3>Start new room</h3>
                <p className="text-sm opacity-90 mt-1">
                  Create a fresh scrum poker room
                </p>
              </motion.button>
            </div>
            <AnimatePresence>
              {activeForm === 'create' && (
                <motion.div
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.3}}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t-2 border-purple-200 pt-6">
                    <div
                      className="p-4 rounded-xl bg-linear-to-r from-pink-50 to-purple-50 border-2 border-pink-300 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Room Code
                      </p>
                      <p className="text-3xl font-bold text-pink-600 tracking-widest">
                        {generatedCode}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-purple-200 focus:border-pink-500 focus:outline-none transition-colors"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCreateRoom()
                        }
                      />
                    </div>

                    <motion.button
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                      onClick={handleCreateRoom}
                      disabled={
                        !username.trim()
                      }
                      className="w-full px-6 py-3 rounded-xl bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:bg-pink-600 transition-colors"
                    >
                      Create Room
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            layout
            className="w-full rounded-2xl bg-white text-gray-900 shadow-2xl border-4 border-purple-200 overflow-hidden"
          >
            <motion.button
              whileHover={{
                scale: activeForm ? 1 : 1.02,
                y: activeForm ? 0 : -2,
              }}
              whileTap={{scale: 0.98}}
              onClick={() => toggleForm('join')}
              className="w-full p-6 transition-all"
            >
              {/*<LogIn className="w-8 h-8 mx-auto mb-2 text-pink-500" />*/}
              <h3>Join room</h3>
              <p className="text-sm text-gray-600 mt-1">
                Join an existing session
              </p>
            </motion.button>

            <AnimatePresence>
              {activeForm === 'join' && (
                <motion.div
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.3}}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t-2 border-purple-200 pt-6">
                    <div>
                      <label className="block text-sm mb-2">
                        Room code
                      </label>
                      <input
                        type="text"
                        value={joinRoomCode}
                        onChange={(e) =>
                          setJoinRoomCode(
                            e.target.value.toUpperCase(),
                          )
                        }
                        placeholder="ABC123"
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-purple-200 focus:border-pink-500 focus:outline-none transition-colors uppercase tracking-widest text-center text-xl"
                        maxLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-purple-200 focus:border-pink-500 focus:outline-none transition-colors"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleJoinRoom()
                        }
                      />
                    </div>

                    <motion.button
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                      onClick={handleJoinRoom}
                      disabled={
                        !username.trim() ||
                        !joinRoomCode.trim()
                      }
                      className="w-full px-6 py-3 rounded-xl bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:bg-pink-600 transition-colors"
                    >
                      Join Room
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}