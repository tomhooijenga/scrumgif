import { useChannel } from 'ably/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VoteEntry {
  card: string;
  gifUrl?: string;
}

export function Table({ room }: { room: string }) {
  const [votes, setVotes] = useState<Record<string, VoteEntry>>({});
  const [revealed, setRevealed] = useState(false);

  useChannel(room, 'vote', (message) => {
    const clientId = message.clientId ?? 'Unknown';
    const { card, gifUrl } = message.data as { card: string; gifUrl?: string };
    setVotes(prev => ({ ...prev, [clientId]: { card, gifUrl } }));
  });

  useChannel(room, 'reveal', () => {
    setRevealed(true);
  });

  useChannel(room, 'reset', () => {
    setVotes({});
    setRevealed(false);
  });

  const entries = Object.entries(votes) as [string, VoteEntry][];

  return (
    <div className="p-6">
      <h2 className="text-indigo-600 mb-4 text-xl font-bold">
        Votes
      </h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">No votes yet. Waiting for players…</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          <AnimatePresence>
            {entries.map(([clientId, { card, gifUrl }]) => (
              <motion.div
                key={clientId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-2"
              >
                {/* Card */}
                <div
                  className={[
                    'h-30 rounded-lg border-2 border-indigo-600 flex items-center justify-center font-bold overflow-hidden relative select-none',
                    'aspect-2.5/3.5',
                    '[box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]',
                    revealed
                      ? gifUrl ? 'bg-transparent text-indigo-600' : 'bg-indigo-50 text-indigo-600'
                      : gifUrl ? 'bg-transparent text-indigo-300' : 'bg-indigo-600 text-indigo-300',
                    revealed && isNaN(Number(card)) ? 'text-base' : 'text-4xl',
                  ].join(' ')}
                >
                  {revealed ? (
                    <>
                      {gifUrl && (
                        <img
                          src={gifUrl}
                          alt={card}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <span className={`absolute top-1.5 left-2 text-[0.6rem] ${gifUrl ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]' : 'text-indigo-300'}`}>{card}</span>
                      <span className={`relative z-10 ${isNaN(Number(card)) ? 'text-base' : 'text-4xl'} ${gifUrl ? 'text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]' : 'text-indigo-600'}`}>{card}</span>
                      <span className={`absolute bottom-1.5 right-2 text-[0.6rem] rotate-180 ${gifUrl ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]' : 'text-indigo-300'}`}>{card}</span>
                    </>
                  ) : gifUrl ? (
                    <img
                      src={gifUrl}
                      alt={card}
                      className="w-full h-full object-cover rounded-lg blur-sm scale-110"
                    />
                  ) : (
                    <span className="text-4xl text-indigo-400">🂠</span>
                  )}
                </div>
                {/* Player name */}
                <span className="text-xs text-gray-700 font-medium">{clientId}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


